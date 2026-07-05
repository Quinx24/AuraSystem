package org.example.aurabackend.service;

import org.example.aurabackend.entity.User;

import org.example.aurabackend.dto.request.JournalEntryCreationRequest;
import org.example.aurabackend.dto.response.EmotionResponse;
import org.example.aurabackend.dto.response.JournalEmotionResponse;
import org.example.aurabackend.dto.response.JournalEntryResponse;
import org.springframework.stereotype.Service;
import org.example.aurabackend.repository.JournalEmotionRepository;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.TagRepository;

import lombok.RequiredArgsConstructor;

import org.example.aurabackend.entity.JournalEmotion;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.Tag;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;
    private final TagRepository tagRepository;
    private final EmotionService emotionService;
    private final JournalEmotionRepository journalEmotionRepository;
    private final CurrentUserService currentUserService;

    //Map JournalEntry entity to JournalEntryResponse DTO
    private JournalEntryResponse mapToResponse(JournalEntry entry) {
        return JournalEntryResponse.builder()
                .id(entry.getId())
                .journalContent(entry.getJournalContent())
                .noteToSelf(entry.getNoteToSelf())
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
                            .collect(Collectors.toSet())   
                )
                .emotions(
                    entry.getJournalEmotions() == null
                        ? List.of()
                        : entry.getJournalEmotions()
                            .stream()
                            .sorted(
                                (a, b) -> Double.compare(
                                    b.getScore(),
                                    a.getScore()
                                )
                            )
                            .map(e ->
                                JournalEmotionResponse.builder()
                                    .emotion(e.getEmotion())
                                    .score(e.getScore())
                                    .build()
                            )
                            .toList()
                )
                .build();
    }

    //Create a new journal entry
    public JournalEntryResponse createJournalEntry(JournalEntryCreationRequest request) {

        User user = currentUserService.getCurrentUser();

        EmotionResponse emotion = emotionService.predictEmotion(
            request.getJournalContent()
        );

        Set<Tag> tags = request.getTags() == null
                ? Set.of()
                :request.getTags()
                    .stream()
                    .map(tagName -> {

                        Tag tag = tagRepository.findByName(tagName)
                                .orElseGet(() ->
                                    Tag.builder()
                                        .name(tagName)
                                        .usedCount(0)
                                        .build()
                            );
                            
                        tag.setUsedCount(tag.getUsedCount() + 1);

                        return tagRepository.save(tag);
                    })
                    .collect(Collectors.toSet());

        JournalEntry newEntry = JournalEntry.builder()
                .journalContent(request.getJournalContent())
                .noteToSelf(request.getNoteToSelf())
                .primaryEmotion(emotion.getEmotion())
                .confidence(emotion.getConfidence())
                .tags(tags)
                .user(user)
                .build();
        
        JournalEntry savedEntry = journalEntryRepository.save(newEntry);

        emotion.getScores()
                    .forEach((emotionType, score) -> {

                        JournalEmotion journalEmotion = 
                            JournalEmotion.builder()
                                    .emotion(emotionType)
                                    .score(score)
                                    .journalEntry(savedEntry)
                                    .build();

                        journalEmotionRepository.save(journalEmotion);

                        savedEntry.getJournalEmotions()
                                .add(journalEmotion);
                    });

        
        return mapToResponse(savedEntry);
    }

    //Get a journal entry by its ID
    public JournalEntryResponse getJournalEntryById(Long id) {

        User user = currentUserService.getCurrentUser();

        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user).orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));

        return mapToResponse(entry);
    }

    //Get all journal entries for the current user
    public Page<JournalEntryResponse> getAllEntries(int page, int size) {

        User user = currentUserService.getCurrentUser();

        Pageable pageable = PageRequest.of(page, size);

        Page<JournalEntry> entries = journalEntryRepository.findByUser(user, pageable);

        return entries.map(this::mapToResponse);
    }

    //Update a journal entry by its ID
    public JournalEntryResponse updateJournalEntry(Long id, JournalEntryCreationRequest request) {

        User user = currentUserService.getCurrentUser();
        
        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user).orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));

        entry.setJournalContent(request.getJournalContent());
        entry.setNoteToSelf(request.getNoteToSelf());

        EmotionResponse emotion = emotionService.predictEmotion(
            request.getJournalContent()
        );

        entry.setPrimaryEmotion(emotion.getEmotion());
        entry.setConfidence(emotion.getConfidence());

        Set<Tag> tags = request.getTags() == null
                ? Set.of()
                : request.getTags()
                    .stream()
                    .map(tagName -> {
                        Tag tag = tagRepository.findByName(tagName)
                                .orElseGet(() ->
                                    Tag.builder()
                                        .name(tagName)
                                        .usedCount(0)
                                        .build()
                            );
                        return tagRepository.save(tag);
                    })
                    .collect(Collectors.toSet());

        entry.setTags(tags);

        journalEmotionRepository.deleteAll(
            entry.getJournalEmotions()
        );

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

    //Delete a journal entry by its ID
    public void deleteJournalEntry(Long id) {

        User user = currentUserService.getCurrentUser();
        
        JournalEntry entry = journalEntryRepository.findByIdAndUser(id, user).orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));
        journalEntryRepository.delete(entry);
    }
}
