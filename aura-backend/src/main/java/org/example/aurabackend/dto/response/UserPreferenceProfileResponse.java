package org.example.aurabackend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Public API response DTO for a user's preference profile.
 *
 * Exposes the preference snapshot computed by UserPreferenceProfileService.
 * All fields are nullable — a null or absent value indicates the profile
 * has not yet been computed (cold start, no extractions yet).
 *
 * Consumed by:
 *   GET /users/me/profile
 *
 * No sensitive fields to exclude for this DTO.
 * The entity itself has no audit-only fields beyond what is exposed here.
 */
@Data
@Builder
public class UserPreferenceProfileResponse {

    /** Null if no profile exists for this user yet (cold start). */
    private Long id;

    /** Ranked SideQuestCategory values, e.g. ["EXERCISE", "CREATIVITY"]. */
    private List<String> preferredCategories;

    /** Most frequently mentioned activities, e.g. ["đi bộ", "đọc sách"]. */
    private List<String> topActivities;

    /** Activities that co-occur with positive emotions. */
    private List<String> knownPositiveTriggers;

    /** Activities that co-occur with negative emotions. */
    private List<String> knownNegativeTriggers;

    /**
     * Normalised category weights consumed by the recommendation engine.
     * e.g. {"EXERCISE": 0.8, "MINDFULNESS": 0.3}
     */
    private Map<String, Double> categoryWeights;

    /** When this profile was last recomputed. */
    private LocalDateTime lastRecomputedAt;

    /** Number of journals used to compute this profile. */
    private Integer journalCountAtRecompute;
}
