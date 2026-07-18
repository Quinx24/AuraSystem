package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.aurabackend.dto.request.JournalEntryCreationRequest;
import org.example.aurabackend.dto.response.EmotionResponse;
import org.example.aurabackend.dto.response.JournalEmotionResponse;
import org.example.aurabackend.dto.response.JournalEntryResponse;
import org.example.aurabackend.dto.response.JournalSideQuestResponse;
import org.example.aurabackend.entity.JournalEmotion;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.Tag;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserSideQuest;
import org.example.aurabackend.event.JournalCreatedEvent;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.JournalEmotionRepository;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.TagRepository;
import org.example.aurabackend.repository.UserSideQuestRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Manages journal entry CRUD and orchestrates the journal-creation pipeline.
 *
 * Responsibilities (this class only):
 *   - Create, read, update, delete journal entries
 *   - Resolve tags (upsert)
 *   - Call EmotionService for emotion classification
 *   - Call StreakService to update the user's streak
 *   - Call QuestAssignmentService to assign side quests
 *   - Map entities to response DTOs
 *
 * Side quest assignment logic was extracted to QuestAssignmentService
 * (Milestone 0, Task 4) to satisfy the Single Responsibility Principle and
 * to prepare for the PersonalisedQuestScorer introduced in Milestone 1.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;
    private final TagRepository tagRepository;
    private final EmotionService emotionService;
    private final JournalEmotionRepository journalEmotionRepository;
    private final CurrentUserService currentUserService;
    private final StreakService streakService;
    private final UserSideQuestRepository userSideQuestRepository;
    private final QuestAssignmentService questAssignmentService;
    private final ApplicationEventPublisher eventPublisher;

    // ─── Response mapping ────────────────────────────────────────────────────

    /**
     * Maps a JournalEntry entity to its API response DTO.
     * Loads linked UserSideQuest records for this entry to populate
     * the sideQuests[] field in the response.
     */
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
                                        .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
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

    // ─── Create ──────────────────────────────────────────────────────────────

    /**
     * Creates a new journal entry and runs the full pipeline:
     * emotion analysis → tag upsert → save → streak update →
     * emotion records → quest assignment.
     *
     * The entire pipeline runs within a single @Transactional boundary.
     * Quest assignment is delegated to QuestAssignmentService.
     */
    @Transactional
    public JournalEntryResponse createJournalEntry(JournalEntryCreationRequest request) {
        long startedAt = System.nanoTime();

        User user = currentUserService.getCurrentUser();

        EmotionResponse emotion = emotionService.predictEmotion(request.getJournalContent());

        Set<Tag> tags = resolveTags(request.getTags());

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

        saveEmotionScores(emotion, savedEntry);

        // Delegate quest selection and persistence to QuestAssignmentService
        questAssignmentService.assignQuestsForJournal(savedEntry, emotion.getEmotion(), user);

        // Publish event for asynchronous extraction pipeline
        // Event will be processed AFTER transaction commit by @TransactionalEventListener
        log.info("event=JournalCreated journalEntryId={} userId={} emotion={}",
                savedEntry.getId(), user.getId(), emotion.getEmotion());
        eventPublisher.publishEvent(new JournalCreatedEvent(this, savedEntry));

        log.info("event=JournalCreationCompleted journalEntryId={} userId={} latencyMs={}",
                savedEntry.getId(), user.getId(), elapsedMillis(startedAt));

        return mapToResponse(savedEntry);
    }

    // ─── Read ────────────────────────────────────────────────────────────────

    /** Returns a single journal entry by id, scoped to the authenticated user. */
    public JournalEntryResponse getJournalEntryById(Long id) {
        User user = currentUserService.getCurrentUser();

        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));

        return mapToResponse(entry);
    }

    /** Returns a paginated list of journal entries for the authenticated user. */
    public Page<JournalEntryResponse> getAllEntries(int page, int size) {
        User user = currentUserService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return journalEntryRepository.findByUser(user, pageable).map(this::mapToResponse);
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    /**
     * Updates an existing journal entry.
     * Re-runs emotion analysis on the new content.
     * Note: quest assignment is NOT re-run on update — the original quests
     * assigned at creation time are preserved.
     */
    @Transactional
    public JournalEntryResponse updateJournalEntry(Long id, JournalEntryCreationRequest request) {
        User user = currentUserService.getCurrentUser();

        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));

        entry.setJournalContent(request.getJournalContent());
        entry.setNoteToSelf(request.getNoteToSelf());
        entry.setMemoryPhotoUrl(request.getMemoryPhoto());

        EmotionResponse emotion = emotionService.predictEmotion(request.getJournalContent());

        entry.setPrimaryEmotion(emotion.getEmotion());
        entry.setConfidence(emotion.getConfidence());
        entry.setTags(resolveTags(request.getTags()));

        journalEmotionRepository.deleteAll(entry.getJournalEmotions());
        entry.getJournalEmotions().clear();

        JournalEntry updatedEntry = journalEntryRepository.save(entry);

        saveEmotionScores(emotion, updatedEntry);

        return mapToResponse(updatedEntry);
    }

    // ─── Delete ──────────────────────────────────────────────────────────────

    /** Deletes a journal entry owned by the authenticated user. */
    public void deleteJournalEntry(Long id) {
        User user = currentUserService.getCurrentUser();

        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));

        journalEntryRepository.delete(entry);
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    /**
     * Resolves tag names to persisted Tag entities.
     * Creates the tag if it does not yet exist; increments usedCount on each use.
     */
    private Set<Tag> resolveTags(Set<String> tagNames) {
        if (tagNames == null) {
            return Set.of();
        }

        return tagNames.stream()
                .map(tagName -> {
                    Tag tag = tagRepository.findByName(tagName)
                            .orElseGet(() -> Tag.builder()
                                    .name(tagName)
                                    .usedCount(0)
                                    .build());

                    int usedCount = tag.getUsedCount() == null ? 0 : tag.getUsedCount();
                    tag.setUsedCount(usedCount + 1);

                    return tagRepository.save(tag);
                })
                .collect(Collectors.toSet());
    }

    /**
     * Persists one JournalEmotion score record per emotion class returned
     * by the emotion service (up to 7 records for a 7-class model).
     */
    private void saveEmotionScores(EmotionResponse emotion, JournalEntry entry) {
        emotion.getScores().forEach((emotionType, score) -> {
            JournalEmotion journalEmotion = JournalEmotion.builder()
                    .emotion(emotionType)
                    .score(score)
                    .journalEntry(entry)
                    .build();

            journalEmotionRepository.save(journalEmotion);
            entry.getJournalEmotions().add(journalEmotion);
        });
    }

    private long elapsedMillis(long startedAt) {
        return (System.nanoTime() - startedAt) / 1_000_000;
    }
}
