package org.example.aurabackend.service;

import org.example.aurabackend.dto.response.UserPreferenceProfileResponse;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link UserProfileService}.
 *
 * Strategy: pure unit tests with Mockito mocks for repositories.
 * No Spring context is loaded — tests run in milliseconds.
 *
 * Tests cover:
 *   - Profile exists vs cold start (no profile yet)
 *   - DTO mapping correctness
 *   - All fields are properly mapped
 */
@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserPreferenceProfileRepository userPreferenceProfileRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private UserProfileService userProfileService;

    // ─── Shared fixtures ─────────────────────────────────────────────────────

    private User user;
    private UserPreferenceProfile profile;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .password("hashed")
                .build();

        profile = UserPreferenceProfile.builder()
                .id(100L)
                .user(user)
                .preferredCategories(List.of("EXERCISE", "CREATIVITY", "MINDFULNESS"))
                .topActivities(List.of("đi bộ", "đọc sách", "chạy bộ"))
                .knownPositiveTriggers(List.of("đi bộ", "đọc sách"))
                .knownNegativeTriggers(List.of("họp nhóm"))
                .categoryWeights(Map.of(
                        "EXERCISE", 0.8,
                        "MINDFULNESS", 0.3,
                        "CREATIVITY", 0.5
                ))
                .lastRecomputedAt(LocalDateTime.of(2024, 1, 15, 10, 30))
                .journalCountAtRecompute(25)
                .build();
    }

    // ─── Test 1: getCurrentUserProfile - happy path ────────────────────────

    @Test
    @DisplayName("returns profile when it exists for the authenticated user")
    void getCurrentUserProfile_profileExists_returnsResponse() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(userPreferenceProfileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        // when
        Optional<UserPreferenceProfileResponse> response = userProfileService.getCurrentUserProfile();

        // then
        assertThat(response).isPresent();
        UserPreferenceProfileResponse dto = response.get();
        
        assertThat(dto.getId()).isEqualTo(100L);
        assertThat(dto.getPreferredCategories()).containsExactly("EXERCISE", "CREATIVITY", "MINDFULNESS");
        assertThat(dto.getTopActivities()).containsExactly("đi bộ", "đọc sách", "chạy bộ");
        assertThat(dto.getKnownPositiveTriggers()).containsExactly("đi bộ", "đọc sách");
        assertThat(dto.getKnownNegativeTriggers()).containsExactly("họp nhóm");
        assertThat(dto.getCategoryWeights()).containsExactlyInAnyOrderEntriesOf(Map.of(
                "EXERCISE", 0.8,
                "MINDFULNESS", 0.3,
                "CREATIVITY", 0.5
        ));
        assertThat(dto.getLastRecomputedAt()).isEqualTo(LocalDateTime.of(2024, 1, 15, 10, 30));
        assertThat(dto.getJournalCountAtRecompute()).isEqualTo(25);
    }

    // ─── Test 2: getCurrentUserProfile - cold start (no profile) ────────────

    @Test
    @DisplayName("returns empty Optional when no profile exists yet (cold start)")
    void getCurrentUserProfile_noProfile_returnsEmpty() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(userPreferenceProfileRepository.findByUser(user)).thenReturn(Optional.empty());

        // when
        Optional<UserPreferenceProfileResponse> response = userProfileService.getCurrentUserProfile();

        // then
        assertThat(response).isEmpty();
    }

    // ─── Test 3: getCurrentUserProfile - repository call verification ───────

    @Test
    @DisplayName("calls repository with authenticated user")
    void getCurrentUserProfile_callsRepositoryWithCurrentUser() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(userPreferenceProfileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        // when
        userProfileService.getCurrentUserProfile();

        // then
        verify(userPreferenceProfileRepository).findByUser(user);
    }

    // ─── Test 4: DTO mapping - all fields present ───────────────────────────

    @Test
    @DisplayName("DTO contains all entity fields")
    void getCurrentUserProfile_dtoContainsAllEntityFields() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(userPreferenceProfileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        // when
        Optional<UserPreferenceProfileResponse> response = userProfileService.getCurrentUserProfile();

        // then
        assertThat(response).isPresent();
        UserPreferenceProfileResponse dto = response.get();
        
        assertThat(dto.getId()).isNotNull();
        assertThat(dto.getPreferredCategories()).isNotNull();
        assertThat(dto.getTopActivities()).isNotNull();
        assertThat(dto.getKnownPositiveTriggers()).isNotNull();
        assertThat(dto.getKnownNegativeTriggers()).isNotNull();
        assertThat(dto.getCategoryWeights()).isNotNull();
        assertThat(dto.getLastRecomputedAt()).isNotNull();
        assertThat(dto.getJournalCountAtRecompute()).isNotNull();
    }

    // ─── Test 5: DTO mapping - null fields handled ───────────────────────────

    @Test
    @DisplayName("DTO handles null entity fields correctly")
    void getCurrentUserProfile_nullEntityFields_mapsToNull() {
        // given - profile with null optional fields
        UserPreferenceProfile profileWithNulls = UserPreferenceProfile.builder()
                .id(100L)
                .user(user)
                .preferredCategories(null)
                .topActivities(null)
                .knownPositiveTriggers(null)
                .knownNegativeTriggers(null)
                .categoryWeights(null)
                .lastRecomputedAt(LocalDateTime.now())
                .journalCountAtRecompute(null)
                .build();

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(userPreferenceProfileRepository.findByUser(user)).thenReturn(Optional.of(profileWithNulls));

        // when
        Optional<UserPreferenceProfileResponse> response = userProfileService.getCurrentUserProfile();

        // then
        assertThat(response).isPresent();
        UserPreferenceProfileResponse dto = response.get();
        
        assertThat(dto.getPreferredCategories()).isNull();
        assertThat(dto.getTopActivities()).isNull();
        assertThat(dto.getKnownPositiveTriggers()).isNull();
        assertThat(dto.getKnownNegativeTriggers()).isNull();
        assertThat(dto.getCategoryWeights()).isNull();
        assertThat(dto.getJournalCountAtRecompute()).isNull();
    }

    // ─── Test 6: getCurrentUserService integration ────────────────────────────

    @Test
    @DisplayName("retrieves current user from CurrentUserService")
    void getCurrentUserProfile_usesCurrentUserService() {
        // given
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(userPreferenceProfileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        // when
        userProfileService.getCurrentUserProfile();

        // then
        verify(currentUserService).getCurrentUser();
    }
}
