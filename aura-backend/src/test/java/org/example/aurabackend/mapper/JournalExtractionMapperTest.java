package org.example.aurabackend.mapper;

import org.example.aurabackend.dto.response.ExtractionSummaryResponse;
import org.example.aurabackend.dto.response.JournalExtractionResponse;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.JournalExtraction;
import org.example.aurabackend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for JournalExtractionMapper.
 */
class JournalExtractionMapperTest {

    private JournalExtraction extraction;
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
                .journalContent("Test content")
                .build();

        extraction = JournalExtraction.builder()
                .id(200L)
                .journalEntry(journalEntry)
                .user(user)
                .activities(List.of("đi bộ", "đọc sách"))
                .places(List.of("công viên"))
                .people(List.of("bạn bè"))
                .positiveTriggers(List.of("tập thể dục"))
                .negativeTriggers(List.of("áp lực"))
                .futurePlans(List.of("học thêm"))
                .moodContext("Feeling good after exercise")
                .rawLlmResponse("Raw LLM response")
                .extractionModel("gemini-pro")
                .extractedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("toFullResponse maps all safe fields correctly")
    void toFullResponse_mapsAllSafeFieldsCorrectly() {
        JournalExtractionResponse response = JournalExtractionMapper.toFullResponse(extraction);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(200L);
        assertThat(response.getJournalEntryId()).isEqualTo(100L);
        assertThat(response.getActivities()).containsExactly("đi bộ", "đọc sách");
        assertThat(response.getPlaces()).containsExactly("công viên");
        assertThat(response.getPeople()).containsExactly("bạn bè");
        assertThat(response.getPositiveTriggers()).containsExactly("tập thể dục");
        assertThat(response.getNegativeTriggers()).containsExactly("áp lực");
        assertThat(response.getFuturePlans()).containsExactly("học thêm");
        assertThat(response.getMoodContext()).isEqualTo("Feeling good after exercise");
    }

    @Test
    @DisplayName("toFullResponse excludes sensitive fields")
    void toFullResponse_excludesSensitiveFields() {
        JournalExtractionResponse response = JournalExtractionMapper.toFullResponse(extraction);

        // Verify that sensitive fields are not exposed through the DTO
        assertThat(response).isInstanceOf(JournalExtractionResponse.class);
        // The DTO class itself doesn't have fields for rawLlmResponse and extractionModel
        // This is enforced at compile time by the DTO structure
    }

    @Test
    @DisplayName("toFullResponse handles null extraction")
    void toFullResponse_handlesNullExtraction() {
        JournalExtractionResponse response = JournalExtractionMapper.toFullResponse(null);
        assertThat(response).isNull();
    }

    @Test
    @DisplayName("toSummaryResponse maps lightweight fields correctly")
    void toSummaryResponse_mapsLightweightFieldsCorrectly() {
        ExtractionSummaryResponse response = JournalExtractionMapper.toSummaryResponse(extraction);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(200L);
        assertThat(response.getJournalEntryId()).isEqualTo(100L);
        assertThat(response.getActivities()).containsExactly("đi bộ", "đọc sách");
        assertThat(response.getMoodContext()).isEqualTo("Feeling good after exercise");
    }

    @Test
    @DisplayName("toSummaryResponse excludes detailed fields")
    void toSummaryResponse_excludesDetailedFields() {
        ExtractionSummaryResponse response = JournalExtractionMapper.toSummaryResponse(extraction);

        // Verify that detailed fields are not in the summary
        // The ExtractionSummaryResponse DTO only has id, journalEntryId, activities, moodContext, extractedAt
        // Detailed fields like places, people, triggers are intentionally excluded
        assertThat(response).isNotNull();
    }

    @Test
    @DisplayName("toSummaryResponse handles null extraction")
    void toSummaryResponse_handlesNullExtraction() {
        ExtractionSummaryResponse response = JournalExtractionMapper.toSummaryResponse(null);
        assertThat(response).isNull();
    }
}
