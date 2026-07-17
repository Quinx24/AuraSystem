package org.example.aurabackend.service;

import org.example.aurabackend.entity.User;

import org.example.aurabackend.dto.request.JournalEntryCreationRequest;
import org.example.aurabackend.dto.response.EmotionResponse;
import org.example.aurabackend.dto.response.JournalEmotionResponse;
import org.example.aurabackend.dto.response.JournalEntryResponse;
import org.example.aurabackend.dto.response.JournalSideQuestResponse;
import org.springframework.stereotype.Service;
import org.example.aurabackend.repository.JournalEmotionRepository;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.TagRepository;
import org.example.aurabackend.repository.UserSideQuestRepository;

import lombok.RequiredArgsConstructor;

import org.example.aurabackend.entity.JournalEmotion;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.Tag;
import org.example.aurabackend.entity.UserSideQuest;

import org.example.aurabackend.enumeration.Emotion;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;
    private final TagRepository tagRepository;
    private final EmotionService emotionService;
    private final JournalEmotionRepository journalEmotionRepository;
    private final CurrentUserService currentUserService;
    private final StreakService streakService;
    private final UserSideQuestRepository userSideQuestRepository;
    private final SideQuestRepository sideQuestRepository;

    // Map JournalEntry entity to JournalEntryResponse DTO
    private JournalEntryResponse mapToResponse(JournalEntry entry) {
        List<UserSideQuest> userSideQuests = userSideQuestRepository.findByJournalEntry(entry);

        return JournalEntryResponse.builder()
                .id(entry.getId())
                .journalContent(entry.getJournalContent())
                .noteToSelf(entry.getNoteToSelf())
                .memoryPhoto(entry.getMemoryPhotoUrl())
                .primaryEmotion(entry.getPrimaryEmotion())
                .confidence(entry.getConfidence())
                .createdAt(entry.getCreatedAt())
                .updatedAt(entry.getUpdatedAt())
                .tags(
                        entry.getTags() == null
                                ? Set.of()
                                : entry.getTags()
                                        .stream()
                                        .map(Tag::getName)
                                        .collect(Collectors.toSet()))
                .emotions(
                        entry.getJournalEmotions() == null
                                ? List.of()
                                : entry.getJournalEmotions()
                                        .stream()
                                        .sorted(
                                                (a, b) -> Double.compare(
                                                        b.getScore(),
                                                        a.getScore()))
                                        .map(e -> JournalEmotionResponse.builder()
                                                .emotion(e.getEmotion())
                                                .score(e.getScore())
                                                .build())
                                        .toList())
                .sideQuests(
                        userSideQuests == null
                                ? List.of()
                                : userSideQuests
                                        .stream()
                                        .map(uq -> JournalSideQuestResponse.builder()
                                                .id(uq.getId())
                                                .sideQuestId(uq.getSideQuest().getId())
                                                .title(uq.getSideQuest().getTitle())
                                                .description(uq.getSideQuest().getDescription())
                                                .xpReward(uq.getSideQuest().getXpReward())
                                                .category(uq.getSideQuest().getCategory())
                                                .completed(uq.getCompleted())
                                                .completedDate(uq.getCompletedDate())
                                                .build())
                                        .toList())
                .build();
    }

    // Create a new journal entry
    @Transactional
    public JournalEntryResponse createJournalEntry(JournalEntryCreationRequest request) {

        User user = currentUserService.getCurrentUser();

        EmotionResponse emotion = emotionService.predictEmotion(
                request.getJournalContent());

        Set<Tag> tags = request.getTags() == null
                ? Set.of()
                : request.getTags()
                        .stream()
                        .map(tagName -> {

                            Tag tag = tagRepository.findByName(tagName)
                                    .orElseGet(() -> Tag.builder()
                                            .name(tagName)
                                            .usedCount(0)
                                            .build());

                            Integer usedCount = tag.getUsedCount();

                            if (usedCount == null) {
                                usedCount = 0;
                            }

                            tag.setUsedCount(usedCount + 1);

                            return tagRepository.save(tag);
                        })
                        .collect(Collectors.toSet());

        JournalEntry newEntry = JournalEntry.builder()
                .journalContent(request.getJournalContent())
                .noteToSelf(request.getNoteToSelf())
                .memoryPhotoUrl(request.getMemoryPhoto())
                .primaryEmotion(emotion.getEmotion())
                .confidence(emotion.getConfidence())
                .tags(tags)
                .user(user)
                .build();

        JournalEntry savedEntry = journalEntryRepository.save(newEntry);

        streakService.updateStreak();

        emotion.getScores()
                .forEach((emotionType, score) -> {

                    JournalEmotion journalEmotion = JournalEmotion.builder()
                            .emotion(emotionType)
                            .score(score)
                            .journalEntry(savedEntry)
                            .build();

                    journalEmotionRepository.save(journalEmotion);

                    savedEntry.getJournalEmotions()
                            .add(journalEmotion);
                });

        // Assign random side quests based on journal emotion
        assignSideQuestsToJournal(savedEntry, emotion.getEmotion(), user);

        return mapToResponse(savedEntry);
    }

    private void assignSideQuestsToJournal(JournalEntry journalEntry, Emotion emotion, User user) {
        List<SideQuest> availableQuests = sideQuestRepository.findByEmotion(emotion);

        // Shuffle and limit to 3 quests
        java.util.Collections.shuffle(availableQuests);
        List<SideQuest> selectedQuests = availableQuests.stream()
                .filter(sideQuest -> !Boolean.FALSE.equals(sideQuest.getPublished()))
                .limit(3)
                .toList();

        // Create UserSideQuest records with journal reference
        for (SideQuest sideQuest : selectedQuests) {
            // Check if this quest is already assigned to this journal
            boolean alreadyAssigned = userSideQuestRepository
                    .existsByUserAndSideQuestAndJournalEntry(user, sideQuest, journalEntry);

            if (!alreadyAssigned) {
                UserSideQuest userSideQuest = UserSideQuest.builder()
                        .user(user)
                        .sideQuest(sideQuest)
                        .journalEntry(journalEntry)
                        .completed(false)
                        .assignedDate(java.time.LocalDate.now())
                        .build();

                userSideQuestRepository.save(userSideQuest);
            }
        }
    }

    // Get a journal entry by its ID
    public JournalEntryResponse getJournalEntryById(Long id) {

        User user = currentUserService.getCurrentUser();

        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));

        return mapToResponse(entry);
    }

    // Get all journal entries for the current user
    public Page<JournalEntryResponse> getAllEntries(int page, int size) {

        User user = currentUserService.getCurrentUser();

        Pageable pageable = PageRequest.of(page, size);

        Page<JournalEntry> entries = journalEntryRepository.findByUser(user, pageable);

        return entries.map(this::mapToResponse);
    }

    // Update a journal entry by its ID
    @Transactional
    public JournalEntryResponse updateJournalEntry(Long id, JournalEntryCreationRequest request) {

        User user = currentUserService.getCurrentUser();

        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));

        entry.setJournalContent(request.getJournalContent());
        entry.setNoteToSelf(request.getNoteToSelf());

        EmotionResponse emotion = emotionService.predictEmotion(
                request.getJournalContent());

        entry.setPrimaryEmotion(emotion.getEmotion());
        entry.setConfidence(emotion.getConfidence());

        Set<Tag> tags = request.getTags() == null
                ? Set.of()
                : request.getTags()
                        .stream()
                        .map(tagName -> {
                            Tag tag = tagRepository.findByName(tagName)
                                    .orElseGet(() -> Tag.builder()
                                            .name(tagName)
                                            .usedCount(0)
                                            .build());
                            return tagRepository.save(tag);
                        })
                        .collect(Collectors.toSet());

        entry.setTags(tags);

        journalEmotionRepository.deleteAll(
                entry.getJournalEmotions());

        entry.getJournalEmotions().clear();

        JournalEntry updatedEntry = journalEntryRepository.save(entry);

        emotion.getScores()
                .forEach((emotionType, score) -> {

                    JournalEmotion journalEmotion = JournalEmotion.builder()
                            .emotion(emotionType)
                            .score(score)
                            .journalEntry(updatedEntry)
                            .build();

                    journalEmotionRepository.save(journalEmotion);

                    updatedEntry
                            .getJournalEmotions()
                            .add(journalEmotion);
                });

        return mapToResponse(updatedEntry);
    }

    // Delete a journal entry by its ID
    public void deleteJournalEntry(Long id) {

        User user = currentUserService.getCurrentUser();

        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));
        journalEntryRepository.delete(entry);
    }
}
