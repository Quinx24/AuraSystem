package org.example.aurabackend.event;

import org.example.aurabackend.entity.JournalEntry;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;

/**
 * Event published when a journal entry is successfully created and committed.
 *
 * This event is published AFTER the transaction commits to ensure the journal
 * entry is persisted before the extraction pipeline begins processing.
 *
 * The event triggers the asynchronous LLM extraction pipeline in Milestone 2.
 */
public class JournalCreatedEvent extends ApplicationEvent {

    private final Long journalEntryId;
    private final Long userId;
    private final String journalContent;
    private final LocalDateTime createdAt;

    /**
     * Creates a new JournalCreatedEvent.
     *
     * @param source the object that published the event (typically the service)
     * @param journalEntry the journal entry that was created
     */
    public JournalCreatedEvent(Object source, JournalEntry journalEntry) {
        super(source);
        this.journalEntryId = journalEntry.getId();
        this.userId = journalEntry.getUser() != null ? journalEntry.getUser().getId() : null;
        this.journalContent = journalEntry.getJournalContent();
        this.createdAt = journalEntry.getCreatedAt();
    }

    public Long getJournalEntryId() {
        return journalEntryId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getJournalContent() {
        return journalContent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
