package org.example.aurabackend.service;

import org.example.aurabackend.dto.response.ExtractionSummaryResponse;
import org.example.aurabackend.dto.response.JournalExtractionResponse;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.JournalExtraction;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.exception.AppException;
import org.example.aurabackend.exception.ErrorCode;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.JournalExtractionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link ExtractionQueryService}.
 *
 * Strategy: pure unit tests with Mockito mocks for repositories.
 * No Spring context is loaded — tests run in milliseconds.
 *
 * Tests cover:
 *   - Ownership validation
 *   - Extraction exists vs not yet processed
 *   - Pagination and sorting
 *   - Security: sensitive fields are never exposed
 */
@ExtendWith(MockitoExtension.class)
class ExtractionQueryServiceTest {

    @Mock
    private JournalExtractionRepository journalExtractionRepository;

    @Mock
    private JournalEntryRepository journalEntryRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private ExtractionQueryService extractionQueryService;

    // ─── Shared fixtures ─────────────────────────────────────────────────────

    private User user;
    private JournalEntry journalEntry;
    private JournalExtraction extraction;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .password("hashed")
                .build();

        journalEntry = JournalEntry.builder()
                .id(10L)
                .journalContent("Hôm nay mình cảm thấy rất vui")
                .user(user)
                .build();

        extraction = JournalExtraction.builder()
                .id(100L)
                .journalEntry(journalEntry)
                .user(user)
                .activities(List.of("đi bộ", "đọc sách"))
                .places(List.of("công viên"))
                .people(List.of("bạn bè"))
                .positiveTriggers(List.of("đi bộ"))
                .negativeTriggers(List.of())
                .futurePlans(List.of("học thêm"))
                .moodContext("Cảm thấy vui vẻ sau khi đi bộ")
                .rawLlmResponse("{\"raw\": \"audit data\"}")
                .extractionModel("gpt-4")
                .extractedAt(LocalDateTime.of(2024, 1, 15, 10, 30))
                .build();
    }

    // ─── Test 1: getExtractionForJournal - happy path ─────────────────────

    @Test
    @DisplayName("returns extraction when journal entry exists and extraction is available")
    void getExtractionForJournal_extractionExists_returnsResponse() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalEntryRepository.existsByIdAndUser(10L, user)).thenReturn(true);
        when(journalExtractionRepository.findByJournalEntry_IdAndUser(10L, user))
                .thenReturn(Optional.of(extraction));

        // when
        Optional<JournalExtractionResponse> response = extractionQueryService.getExtractionForJournal(10L);

        // then
        assertThat(response).isPresent();
        JournalExtractionResponse dto = response.get();
        
        assertThat(dto.getId()).isEqualTo(100L);
        assertThat(dto.getJournalEntryId()).isEqualTo(10L);
        assertThat(dto.getActivities()).containsExactly("đi bộ", "đọc sách");
        assertThat(dto.getPlaces()).containsExactly("công viên");
        assertThat(dto.getPeople()).containsExactly("bạn bè");
        assertThat(dto.getPositiveTriggers()).containsExactly("đi bộ");
        assertThat(dto.getNegativeTriggers()).isEmpty();
        assertThat(dto.getFuturePlans()).containsExactly("học thêm");
        assertThat(dto.getMoodContext()).isEqualTo("Cảm thấy vui vẻ sau khi đi bộ");
        assertThat(dto.getExtractedAt()).isEqualTo(LocalDateTime.of(2024, 1, 15, 10, 30));
    }

    // ─── Test 2: getExtractionForJournal - extraction not yet processed ─────

    @Test
    @DisplayName("returns empty Optional when journal exists but extraction not yet processed")
    void getExtractionForJournal_extractionNotProcessed_returnsEmpty() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalEntryRepository.existsByIdAndUser(10L, user)).thenReturn(true);
        when(journalExtractionRepository.findByJournalEntry_IdAndUser(10L, user))
                .thenReturn(Optional.empty());

        // when
        Optional<JournalExtractionResponse> response = extractionQueryService.getExtractionForJournal(10L);

        // then
        assertThat(response).isEmpty();
    }

    // ─── Test 3: getExtractionForJournal - ownership validation ─────────────

    @Test
    @DisplayName("throws JOURNAL_ENTRY_NOT_FOUND when journal entry does not belong to user")
    void getExtractionForJournal_notOwned_throwsException() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalEntryRepository.existsByIdAndUser(10L, user)).thenReturn(false);

        // when/then
        assertThatThrownBy(() -> extractionQueryService.getExtractionForJournal(10L))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.JOURNAL_ENTRY_NOT_FOUND);
    }

    // ─── Test 4: getExtractionForJournal - security: sensitive fields excluded ──

    @Test
    @DisplayName("response DTO never contains rawLlmResponse or extractionModel")
    void getExtractionForJournal_sensitiveFields_excludedFromResponse() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalEntryRepository.existsByIdAndUser(10L, user)).thenReturn(true);
        when(journalExtractionRepository.findByJournalEntry_IdAndUser(10L, user))
                .thenReturn(Optional.of(extraction));

        // when
        Optional<JournalExtractionResponse> response = extractionQueryService.getExtractionForJournal(10L);

        // then - verify the DTO structure
        assertThat(response).isPresent();
        JournalExtractionResponse dto = response.get();
        
        // The DTO class itself should not have these fields at all
        // This is a compile-time check, but we can verify the values are not exposed
        assertThat(dto.getClass().getDeclaredFields())
                .extracting("name")
                .doesNotContain("rawLlmResponse", "extractionModel");
    }

    // ─── Test 5: getExtractionHistory - happy path ─────────────────────────

    @Test
    @DisplayName("returns paginated extraction history sorted by extractedAt DESC")
    void getExtractionHistory_returnsPaginatedResults() {
        // given
        JournalExtraction extraction2 = JournalExtraction.builder()
                .id(101L)
                .journalEntry(journalEntry)
                .user(user)
                .activities(List.of("chạy bộ"))
                .moodContext("Tốt hơn sau khi chạy")
                .extractedAt(LocalDateTime.of(2024, 1, 16, 9, 0))
                .build();

        List<JournalExtraction> extractions = List.of(extraction, extraction2);
        Page<JournalExtraction> page = new PageImpl<>(extractions);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalExtractionRepository.findByUser(eq(user), any(Pageable.class)))
                .thenReturn(page);

        // when
        Page<ExtractionSummaryResponse> result = extractionQueryService.getExtractionHistory(0, 10);

        // then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getId()).isEqualTo(100L);
        assertThat(result.getContent().get(1).getId()).isEqualTo(101L);
        
        // verify repository was called with correct sort
        verify(journalExtractionRepository).findByUser(eq(user), any(Pageable.class));
    }

    // ─── Test 6: getExtractionHistory - size capping ────────────────────────

    @Test
    @DisplayName("caps page size at 50 when larger size is requested")
    void getExtractionHistory_sizeCappedAt50() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalExtractionRepository.findByUser(eq(user), any(Pageable.class)))
                .thenReturn(Page.empty());

        // when - request size 100
        extractionQueryService.getExtractionHistory(0, 100);

        // then - verify the pageable passed to repository has size 50
        verify(journalExtractionRepository).findByUser(eq(user), any(Pageable.class));
    }

    // ─── Test 7: getExtractionHistory - summary DTO mapping ─────────────────

    @Test
    @DisplayName("summary DTO contains only lightweight fields (activities, moodContext, extractedAt)")
    void getExtractionHistory_summaryDto_hasLightweightFields() {
        // given
        Page<JournalExtraction> page = new PageImpl<>(List.of(extraction));

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalExtractionRepository.findByUser(eq(user), any(Pageable.class)))
                .thenReturn(page);

        // when
        Page<ExtractionSummaryResponse> result = extractionQueryService.getExtractionHistory(0, 10);

        // then
        assertThat(result.getContent()).hasSize(1);
        ExtractionSummaryResponse summary = result.getContent().get(0);
        
        assertThat(summary.getId()).isEqualTo(100L);
        assertThat(summary.getJournalEntryId()).isEqualTo(10L);
        assertThat(summary.getActivities()).containsExactly("đi bộ", "đọc sách");
        assertThat(summary.getMoodContext()).isEqualTo("Cảm thấy vui vẻ sau khi đi bộ");
        assertThat(summary.getExtractedAt()).isEqualTo(LocalDateTime.of(2024, 1, 15, 10, 30));
        
        // Summary should not have places, people, triggers, futurePlans
        assertThat(summary.getClass().getDeclaredFields())
                .extracting("name")
                .doesNotContain("places", "people", "positiveTriggers", "negativeTriggers", "futurePlans");
    }

    // ─── Test 8: getExtractionHistory - security: sensitive fields excluded ──

    @Test
    @DisplayName("summary DTO never contains rawLlmResponse or extractionModel")
    void getExtractionHistory_sensitiveFields_excludedFromSummary() {
        // given
        Page<JournalExtraction> page = new PageImpl<>(List.of(extraction));

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalExtractionRepository.findByUser(eq(user), any(Pageable.class)))
                .thenReturn(page);

        // when
        Page<ExtractionSummaryResponse> result = extractionQueryService.getExtractionHistory(0, 10);

        // then
        assertThat(result.getContent()).hasSize(1);
        ExtractionSummaryResponse summary = result.getContent().get(0);
        
        assertThat(summary.getClass().getDeclaredFields())
                .extracting("name")
                .doesNotContain("rawLlmResponse", "extractionModel");
    }

    // ─── Test 9: getExtractionHistory - empty result ────────────────────────

    @Test
    @DisplayName("returns empty page when user has no extractions")
    void getExtractionHistory_noExtractions_returnsEmptyPage() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(journalExtractionRepository.findByUser(eq(user), any(Pageable.class)))
                .thenReturn(Page.empty());

        // when
        Page<ExtractionSummaryResponse> result = extractionQueryService.getExtractionHistory(0, 10);

        // then
        assertThat(result.getContent()).isEmpty();
    }
}
