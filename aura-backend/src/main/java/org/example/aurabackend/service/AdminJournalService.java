package org.example.aurabackend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.example.aurabackend.dto.response.AdminJournalResponse;
import org.example.aurabackend.dto.response.JournalEmotionResponse;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.Tag;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.JournalEntrySpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminJournalService {

    private final JournalEntryRepository journalEntryRepository;

    public Page<AdminJournalResponse> getJournalEntries(
            int page,
            int size,
            String username,
            String search,
            Emotion emotion,
            LocalDate date,
            String sort) {

        Specification<JournalEntry> specification = Specification
                .where(JournalEntrySpecification.containsUsername(username))
                .and(JournalEntrySpecification.containsContent(search))
                .and(JournalEntrySpecification.hasEmotion(emotion))
                .and(JournalEntrySpecification.createdOn(date));

        Pageable pageable = PageRequest.of(page, size, resolveSort(sort));

        return journalEntryRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    public AdminJournalResponse getById(Long id) {
        return mapToResponse(findJournal(id));
    }

    @Transactional
    public void delete(Long id) {
        journalEntryRepository.delete(findJournal(id));
    }

    private JournalEntry findJournal(Long id) {
        return journalEntryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND));
    }

    private AdminJournalResponse mapToResponse(JournalEntry entry) {
        Set<String> tags = entry.getTags() == null
                ? Set.of()
                : entry.getTags().stream().map(Tag::getName).collect(Collectors.toSet());

        List<JournalEmotionResponse> emotions = entry.getJournalEmotions() == null
                ? List.of()
                : entry.getJournalEmotions().stream()
                        .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                        .map(emotion -> JournalEmotionResponse.builder()
                                .emotion(emotion.getEmotion())
                                .score(emotion.getScore())
                                .build())
                        .toList();

        return AdminJournalResponse.builder()
                .id(entry.getId())
                .journalContent(entry.getJournalContent())
                .noteToSelf(entry.getNoteToSelf())
                .primaryEmotion(entry.getPrimaryEmotion())
                .confidence(entry.getConfidence())
                .userId(entry.getUser() != null ? entry.getUser().getId() : null)
                .userFullName(entry.getUser() != null ? entry.getUser().getFullName() : null)
                .userEmail(entry.getUser() != null ? entry.getUser().getEmail() : null)
                .tags(tags)
                .emotions(emotions)
                .createdAt(entry.getCreatedAt())
                .updatedAt(entry.getUpdatedAt())
                .build();
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        String[] parts = sort.split(",");
        String property = parts[0].isBlank() ? "createdAt" : parts[0];
        Sort.Direction direction = parts.length > 1 && "asc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return Sort.by(direction, property);
    }
}
