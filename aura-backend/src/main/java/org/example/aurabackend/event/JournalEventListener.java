package org.example.aurabackend.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.service.ExtractionService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Asynchronous event listener for journal creation events.
 *
 * Responsibilities:
 *   - Listens for JournalCreatedEvent AFTER transaction commit
 *   - Triggers the LLM extraction pipeline asynchronously
 *   - Ensures journal creation is never blocked by extraction processing
 *   - Provides exception isolation - extraction failures don't affect journal creation
 *
 * Architecture:
 *   Journal Saved → Transaction Commit → JournalCreatedEvent → @Async → ExtractionService
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JournalEventListener {

    private final ExtractionService extractionService;

    /**
     * Handles the JournalCreatedEvent asynchronously after transaction commit.
     *
     * Key characteristics:
     *   - @TransactionalEventListener(phase = AFTER_COMMIT): Event fires only after successful commit
     *   - @Async: Processing happens in a separate thread, not blocking the HTTP response
     *   - Exception isolation: Any exception here is logged but doesn't roll back the journal creation
     *
     * @param event the journal creation event
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleJournalCreated(JournalCreatedEvent event) {
        log.info("event=JournalCreatedEvent journalEntryId={} userId={}",
                event.getJournalEntryId(), event.getUserId());

        try {
            extractionService.processJournalExtraction(event);
        } catch (Exception e) {
            // Exception isolation: log the error but don't propagate
            // The journal entry is already committed and safe
            log.error("Failed to process extraction for journal entry ID: {}, user ID: {}. Error: {}",
                    event.getJournalEntryId(), event.getUserId(), e.getMessage(), e);
            
            // In production, you might want to:
            // - Update a failure status in the database
            // - Send an alert to monitoring
            // - Queue for retry
        }
    }
}
