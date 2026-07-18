package org.example.aurabackend.repository;

import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.JournalExtraction;
import org.example.aurabackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link JournalExtraction} persistence operations.
 *
 * Access patterns required by the approved architecture:
 *
 * 1. GET /journal-entries/{id}/extraction
 *    → findByJournalEntry(JournalEntry) — lookup by journal entry object
 *    → findByJournalEntry_IdAndUser(Long, User) — ownership-scoped lookup by ID
 *
 * 2. GET /users/me/extractions (paginated)
 *    → findByUser(User, Pageable) — all extractions for a user, newest first
 *
 * 3. Milestone 2 — ExtractionService (write side)
 *    → save() — inherited from JpaRepository
 *    → existsByJournalEntry(JournalEntry) — idempotency check before extraction
 *
 * Repository Rule: No business logic. Persistence and querying only.
 */
@Repository
public interface JournalExtractionRepository extends JpaRepository<JournalExtraction, Long> {

    /**
     * Finds the extraction for a specific journal entry.
     * Returns Optional.empty() if no extraction exists yet (not yet processed).
     */
    Optional<JournalExtraction> findByJournalEntry(JournalEntry journalEntry);

    /**
     * Ownership-scoped lookup by journal entry ID and user.
     * Prevents a user from reading another user's extraction by guessing IDs.
     */
    Optional<JournalExtraction> findByJournalEntry_IdAndUser(Long journalEntryId, User user);

    /**
     * Paginated list of all extractions for a user, ordered by the caller's
     * Pageable (typically extractedAt DESC for newest-first).
     */
    Page<JournalExtraction> findByUser(User user, Pageable pageable);

    /**
     * Idempotency guard used by ExtractionService (Milestone 2) to avoid
     * re-extracting an entry that was already processed.
     */
    boolean existsByJournalEntry(JournalEntry journalEntry);

    /**
     * Idempotency guard by journal entry ID.
     * Used by ExtractionService to check if extraction already exists.
     */
    boolean existsByJournalEntry_Id(Long journalEntryId);

    /**
     * Finds all extractions for a user.
     * Used by UserPreferenceProfileService for preference computation.
     */
    List<JournalExtraction> findByUser(User user);
}
