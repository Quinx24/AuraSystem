package org.example.aurabackend.mapper;

import org.example.aurabackend.dto.response.UserPreferenceProfileResponse;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for UserPreferenceProfileMapper.
 */
class UserPreferenceProfileMapperTest {

    private UserPreferenceProfile profile;
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

        profile = UserPreferenceProfile.builder()
                .id(100L)
                .user(user)
                .preferredCategories(List.of("EXERCISE", "CREATIVITY"))
                .topActivities(List.of("đi bộ", "đọc sách"))
                .knownPositiveTriggers(List.of("tập thể dục"))
                .knownNegativeTriggers(List.of("áp lực"))
                .categoryWeights(Map.of("EXERCISE", 0.8, "CREATIVITY", 0.6))
                .lastRecomputedAt(LocalDateTime.now())
                .journalCountAtRecompute(5)
                .build();
    }

    @Test
    @DisplayName("toResponse maps all fields correctly")
    void toResponse_mapsAllFieldsCorrectly() {
        UserPreferenceProfileResponse response = UserPreferenceProfileMapper.toResponse(profile);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(100L);
        assertThat(response.getPreferredCategories()).containsExactly("EXERCISE", "CREATIVITY");
        assertThat(response.getTopActivities()).containsExactly("đi bộ", "đọc sách");
        assertThat(response.getKnownPositiveTriggers()).containsExactly("tập thể dục");
        assertThat(response.getKnownNegativeTriggers()).containsExactly("áp lực");
        assertThat(response.getCategoryWeights()).hasSize(2);
        assertThat(response.getCategoryWeights().get("EXERCISE")).isEqualTo(0.8);
        assertThat(response.getJournalCountAtRecompute()).isEqualTo(5);
    }

    @Test
    @DisplayName("toResponse handles null profile")
    void toResponse_handlesNullProfile() {
        UserPreferenceProfileResponse response = UserPreferenceProfileMapper.toResponse(null);
        assertThat(response).isNull();
    }

    @Test
    @DisplayName("toResponse handles null collections")
    void toResponse_handlesNullCollections() {
        profile.setPreferredCategories(null);
        profile.setTopActivities(null);
        profile.setKnownPositiveTriggers(null);
        profile.setKnownNegativeTriggers(null);
        profile.setCategoryWeights(null);

        UserPreferenceProfileResponse response = UserPreferenceProfileMapper.toResponse(profile);

        assertThat(response).isNotNull();
        assertThat(response.getPreferredCategories()).isNull();
        assertThat(response.getTopActivities()).isNull();
        assertThat(response.getKnownPositiveTriggers()).isNull();
        assertThat(response.getKnownNegativeTriggers()).isNull();
        assertThat(response.getCategoryWeights()).isNull();
    }
}
