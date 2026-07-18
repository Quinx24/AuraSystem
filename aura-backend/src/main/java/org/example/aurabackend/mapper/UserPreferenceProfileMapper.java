package org.example.aurabackend.mapper;

import org.example.aurabackend.dto.response.UserPreferenceProfileResponse;
import org.example.aurabackend.entity.UserPreferenceProfile;

/**
 * Mapper for UserPreferenceProfile entity and DTOs.
 *
 * Responsibilities:
 *   - Entity → DTO conversion
 *   - Future DTO → Entity support (for write operations in Milestone 2+)
 *
 * Usage:
 *   Controllers → Services → Mapper → Repository
 */
public class UserPreferenceProfileMapper {

    /**
     * Maps a UserPreferenceProfile entity to the response DTO.
     *
     * All fields are nullable — a null value indicates the profile
     * has not yet been computed (cold start, no extractions yet).
     */
    public static UserPreferenceProfileResponse toResponse(UserPreferenceProfile profile) {
        if (profile == null) {
            return null;
        }

        return UserPreferenceProfileResponse.builder()
                .id(profile.getId())
                .preferredCategories(profile.getPreferredCategories())
                .topActivities(profile.getTopActivities())
                .knownPositiveTriggers(profile.getKnownPositiveTriggers())
                .knownNegativeTriggers(profile.getKnownNegativeTriggers())
                .categoryWeights(profile.getCategoryWeights())
                .lastRecomputedAt(profile.getLastRecomputedAt())
                .journalCountAtRecompute(profile.getJournalCountAtRecompute())
                .build();
    }

    /**
     * Future: DTO → Entity conversion for write operations.
     * This will be implemented in Milestone 2 when profile updates are added.
     */
    // public static UserPreferenceProfile toEntity(UserPreferenceProfileRequest request) {
    //     // Implementation for Milestone 2
    // }
}
