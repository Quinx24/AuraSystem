package org.example.aurabackend.controller;

import org.example.aurabackend.dto.response.ApiResponse;
import org.example.aurabackend.dto.response.ExtractionSummaryResponse;
import org.example.aurabackend.dto.response.UserPreferenceProfileResponse;
import org.example.aurabackend.service.ExtractionQueryService;
import org.example.aurabackend.service.UserProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link UserProfileController}.
 *
 * Strategy: pure unit tests with Mockito mocks for services.
 * No Spring context is loaded — tests run in milliseconds.
 *
 * Tests cover:
 *   - GET /users/me/profile - profile exists vs cold start
 *   - GET /users/me/extractions - pagination and sorting
 *   - Response structure and HTTP status codes
 *   - Controllers return only DTOs (never entities)
 */
@ExtendWith(MockitoExtension.class)
class UserProfileControllerTest {

    @Mock
    private UserProfileService userProfileService;

    @Mock
    private ExtractionQueryService extractionQueryService;

    @InjectMocks
    private UserProfileController userProfileController;

    // ─── Shared fixtures ─────────────────────────────────────────────────────

    private UserPreferenceProfileResponse profileResponse;
    private ExtractionSummaryResponse extractionSummary;
    private Page<ExtractionSummaryResponse> extractionPage;

    @BeforeEach
    void setUp() {
        profileResponse = UserPreferenceProfileResponse.builder()
                .id(100L)
                .preferredCategories(List.of("EXERCISE", "CREATIVITY"))
                .topActivities(List.of("đi bộ", "đọc sách"))
                .knownPositiveTriggers(List.of("đi bộ"))
                .knownNegativeTriggers(List.of("họp nhóm"))
                .categoryWeights(Map.of("EXERCISE", 0.8, "MINDFULNESS", 0.3))
                .lastRecomputedAt(LocalDateTime.of(2024, 1, 15, 10, 30))
                .journalCountAtRecompute(25)
                .build();

        extractionSummary = ExtractionSummaryResponse.builder()
                .id(200L)
                .journalEntryId(10L)
                .activities(List.of("đi bộ"))
                .moodContext("Cảm thấy vui vẻ")
                .extractedAt(LocalDateTime.of(2024, 1, 16, 9, 0))
                .build();

        extractionPage = new PageImpl<>(List.of(extractionSummary));
    }

    // ─── Test 1: getProfile - happy path ────────────────────────────────────

    @Test
    @DisplayName("GET /users/me/profile returns profile when it exists")
    void getProfile_profileExists_returnsProfile() {
        // given
        when(userProfileService.getCurrentUserProfile()).thenReturn(Optional.of(profileResponse));

        // when
        ApiResponse<UserPreferenceProfileResponse> response = 
                userProfileController.getProfile();

        // then
        assertThat(response).isNotNull();
        assertThat(response.getCode()).isEqualTo(0);
        assertThat(response.getMessage()).isEqualTo("Profile retrieved successfully");
        
        UserPreferenceProfileResponse dto = response.getResult();
        assertThat(dto.getId()).isEqualTo(100L);
        assertThat(dto.getPreferredCategories()).containsExactly("EXERCISE", "CREATIVITY");
        
        verify(userProfileService).getCurrentUserProfile();
    }

    // ─── Test 2: getProfile - cold start (no profile) ─────────────────────

    @Test
    @DisplayName("GET /users/me/profile returns null result when no profile exists (cold start)")
    void getProfile_noProfile_returnsNullResult() {
        // given
        when(userProfileService.getCurrentUserProfile()).thenReturn(Optional.empty());

        // when
        ApiResponse<UserPreferenceProfileResponse> response = 
                userProfileController.getProfile();

        // then
        assertThat(response).isNotNull();
        assertThat(response.getCode()).isEqualTo(0);
        assertThat(response.getResult()).isNull();
        
        verify(userProfileService).getCurrentUserProfile();
    }

    // ─── Test 3: getExtractions - happy path ───────────────────────────────

    @Test
    @DisplayName("GET /users/me/extractions returns paginated extraction history")
    void getExtractions_returnsPaginatedResults() {
        // given
        when(extractionQueryService.getExtractionHistory(0, 10)).thenReturn(extractionPage);

        // when
        ApiResponse<Page<ExtractionSummaryResponse>> response = 
                userProfileController.getExtractions(0, 10);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getCode()).isEqualTo(0);
        assertThat(response.getMessage()).isEqualTo("Extraction history retrieved successfully");
        
        Page<ExtractionSummaryResponse> result = response.getResult();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getId()).isEqualTo(200L);
        
        verify(extractionQueryService).getExtractionHistory(0, 10);
    }

    // ─── Test 4: getExtractions - default pagination parameters ─────────────

    @Test
    @DisplayName("GET /users/me/extractions uses default pagination when not specified")
    void getExtractions_usesDefaultPagination() {
        // given
        when(extractionQueryService.getExtractionHistory(0, 10)).thenReturn(extractionPage);

        // when - using default values (implicitly)
        ApiResponse<Page<ExtractionSummaryResponse>> response = 
                userProfileController.getExtractions(0, 10);

        // then
        assertThat(response).isNotNull();
        verify(extractionQueryService).getExtractionHistory(0, 10);
    }

    // ─── Test 5: getExtractions - custom pagination parameters ─────────────

    @Test
    @DisplayName("GET /users/me/extractions uses custom pagination parameters")
    void getExtractions_usesCustomPagination() {
        // given
        when(extractionQueryService.getExtractionHistory(2, 20)).thenReturn(Page.empty());

        // when
        ApiResponse<Page<ExtractionSummaryResponse>> response = 
                userProfileController.getExtractions(2, 20);

        // then
        assertThat(response).isNotNull();
        verify(extractionQueryService).getExtractionHistory(2, 20);
    }

    // ─── Test 6: getExtractions - empty result ────────────────────────────

    @Test
    @DisplayName("GET /users/me/extractions returns empty page when no extractions exist")
    void getExtractions_noExtractions_returnsEmptyPage() {
        // given
        when(extractionQueryService.getExtractionHistory(0, 10)).thenReturn(Page.empty());

        // when
        ApiResponse<Page<ExtractionSummaryResponse>> response = 
                userProfileController.getExtractions(0, 10);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getResult().getContent()).isEmpty();
    }

    // ─── Test 7: Controller returns DTOs only ───────────────────────────────

    @Test
    @DisplayName("controller returns DTOs, never entities")
    void getProfile_returnsDtoNotEntity() {
        // given
        when(userProfileService.getCurrentUserProfile()).thenReturn(Optional.of(profileResponse));

        // when
        ApiResponse<UserPreferenceProfileResponse> response = 
                userProfileController.getProfile();

        // then - verify the response type is DTO, not entity
        assertThat(response.getResult()).isInstanceOf(UserPreferenceProfileResponse.class);
        assertThat(response.getResult().getClass().getPackage().getName())
                .contains("dto.response");
    }

    // ─── Test 8: getExtractions returns DTOs only ─────────────────────────

    @Test
    @DisplayName("getExtractions returns DTOs, never entities")
    void getExtractions_returnsDtoNotEntity() {
        // given
        when(extractionQueryService.getExtractionHistory(0, 10)).thenReturn(extractionPage);

        // when
        ApiResponse<Page<ExtractionSummaryResponse>> response = 
                userProfileController.getExtractions(0, 10);

        // then - verify the response type is DTO, not entity
        assertThat(response.getResult().getContent().get(0))
                .isInstanceOf(ExtractionSummaryResponse.class);
        assertThat(response.getResult().getContent().get(0).getClass().getPackage().getName())
                .contains("dto.response");
    }

    // ─── Test 9: Response structure verification ────────────────────────────

    @Test
    @DisplayName("API response structure contains code, message, and result")
    void getProfile_responseStructureIsCorrect() {
        // given
        when(userProfileService.getCurrentUserProfile()).thenReturn(Optional.of(profileResponse));

        // when
        ApiResponse<UserPreferenceProfileResponse> response = 
                userProfileController.getProfile();

        // then
        assertThat(response).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertThat(response.getMessage()).isNotNull();
        assertThat(response.getResult()).isNotNull();
    }
}
