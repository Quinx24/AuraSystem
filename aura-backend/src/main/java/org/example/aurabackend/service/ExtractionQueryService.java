package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.aurabackend.dto.response.ExtractionSummaryResponse;
import org.example.aurabackend.dto.response.JournalExtractionResponse;
import org.example.aurabackend.entity.JournalExtraction;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.mapper.JournalExtractionMapper;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.JournalExtractionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Read-only service for journal extraction data.
 *
 * Responsibilities:
 *   - Retrieve the extraction for a specific journal entry (ownership-scoped)
 *   - Retrieve the paginated extraction history for the authenticated user
 *
 * This service owns the mapping from JournalExtraction entity to DTOs.
 * It intentionally excludes rawLlmResponse from all mapped responses.
 *
 * The write side (creating/updating extractions) will be implemented in
 * ExtractionService (Milestone 2) and is entirely separate from this class.
 *
 * Service Rule: No repository access from controllers.
 *   Controllers → ExtractionQueryService → JournalExtractionRepository
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExtractionQueryService {

    private final JournalExtractionRepository journalExtractionRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final CurrentUserService currentUserService;

    /**
     * Returns the extraction for the given journal entry ID, scoped to the
     * authenticated user.
     *
     * Returns {@code Optional.empty()} if the journal entry exists but has
     * not yet been processed by the LLM extraction pipeline.
     *
     * @throws AppException(JOURNAL_ENTRY_NOT_FOUND) if the journal entry does
     *         not exist or does not belong to the authenticated user.
     */
    public Optional<JournalExtractionResponse> getExtractionForJournal(Long journalEntryId) {
        User user = currentUserService.getCurrentUser();

        // Ownership check: verify the journal entry belongs to the user.
        // This prevents a user from probing for extractions by guessing IDs.
        if (!journalEntryRepository.existsByIdAndUser(journalEntryId, user)) {
            throw new AppException(ErrorCode.JOURNAL_ENTRY_NOT_FOUND);
        }

        return journalExtractionRepository
                .findByJournalEntry_IdAndUser(journalEntryId, user)
                .map(JournalExtractionMapper::toFullResponse);
    }

    /**
     * Returns a paginated list of extraction summaries for the authenticated user,
     * ordered newest first.
     *
     * @param page zero-based page index
     * @param size number of records per page (max 50, capped internally)
     */
    public Page<ExtractionSummaryResponse> getExtractionHistory(int page, int size) {
        User user = currentUserService.getCurrentUser();

        // Cap size to prevent oversized responses
        int safeSize = Math.min(size, 50);

        Pageable pageable = PageRequest.of(
                page,
                safeSize,
                Sort.by(Sort.Direction.DESC, "extractedAt")
        );

        return journalExtractionRepository
                .findByUser(user, pageable)
                .map(JournalExtractionMapper::toSummaryResponse);
    }
}
