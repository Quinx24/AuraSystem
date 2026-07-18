package org.example.aurabackend.event;

import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Emotion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for JournalCreatedEvent.
 */
class JournalCreatedEventTest {

    private JournalEntry journalEntry;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .password("password")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        journalEntry = JournalEntry.builder()
                .id(100L)
                .user(user)
                .journalContent("Test journal content")
                .primaryEmotion(Emotion.HAPPY)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("JournalCreatedEvent stores correct journal entry ID")
    void event_storesCorrectJournalEntryId() {
        JournalCreatedEvent event = new JournalCreatedEvent(this, journalEntry);
        assertThat(event.getJournalEntryId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("JournalCreatedEvent stores correct user ID")
    void event_storesCorrectUserId() {
        JournalCreatedEvent event = new JournalCreatedEvent(this, journalEntry);
        assertThat(event.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("JournalCreatedEvent stores correct journal content")
    void event_storesCorrectJournalContent() {
        JournalCreatedEvent event = new JournalCreatedEvent(this, journalEntry);
        assertThat(event.getJournalContent()).isEqualTo("Test journal content");
    }

    @Test
    @DisplayName("JournalCreatedEvent stores correct creation time")
    void event_storesCorrectCreationTime() {
        LocalDateTime now = LocalDateTime.now();
        journalEntry.setCreatedAt(now);
        
        JournalCreatedEvent event = new JournalCreatedEvent(this, journalEntry);
        assertThat(event.getCreatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("JournalCreatedEvent handles null user gracefully")
    void event_handlesNullUser() {
        journalEntry.setUser(null);
        JournalCreatedEvent event = new JournalCreatedEvent(this, journalEntry);
        assertThat(event.getUserId()).isNull();
    }
}
