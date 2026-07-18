package org.example.aurabackend.recommendation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * User-friendly explanation for a quest recommendation.
 *
 * This class provides structured, human-readable reasons for why a quest
 * was recommended. It never exposes internal scoring formulas or raw data.
 *
 * Examples of explanations:
 * - "Matched your preferred category: EXERCISE"
 * - "Aligns with your recent emotion: HAPPY"
 * - "Supports your frequent activity: đi bộ"
 * - "Avoids recently completed quests"
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationExplanation {

    /**
     * The quest ID this explanation refers to.
     */
    private Long questId;

    /**
     * The quest title.
     */
    private String questTitle;

    /**
     * List of user-friendly reasons for this recommendation.
     */
    @Builder.Default
    private List<String> reasons = new ArrayList<>();

    /**
     * Overall confidence in this recommendation (0.0 to 1.0).
     */
    private double confidence;

    /**
     * Adds a reason to the explanation.
     *
     * @param reason the reason to add
     */
    public void addReason(String reason) {
        if (this.reasons == null) {
            this.reasons = new ArrayList<>();
        }
        this.reasons.add(reason);
    }

    /**
     * Creates a reason for category match.
     *
     * @param category the matched category
     * @return user-friendly reason string
     */
    public static String categoryMatchReason(String category) {
        return String.format("Matched your preferred category: %s", category);
    }

    /**
     * Creates a reason for emotion match.
     *
     * @param emotion the matched emotion
     * @return user-friendly reason string
     */
    public static String emotionMatchReason(String emotion) {
        return String.format("Aligns with your recent emotion: %s", emotion);
    }

    /**
     * Creates a reason for activity alignment.
     *
     * @param activity the aligned activity
     * @return user-friendly reason string
     */
    public static String activityAlignmentReason(String activity) {
        return String.format("Supports your frequent activity: %s", activity);
    }

    /**
     * Creates a reason for positive trigger.
     *
     * @param trigger the positive trigger
     * @return user-friendly reason string
     */
    public static String positiveTriggerReason(String trigger) {
        return String.format("Based on activities that make you feel good: %s", trigger);
    }

    /**
     * Creates a reason for diversity.
     *
     * @return user-friendly reason string
     */
    public static String diversityReason() {
        return "Offers variety from your recent activities";
    }

    /**
     * Creates a reason for cold start.
     *
     * @return user-friendly reason string
     */
    public static String coldStartReason() {
        return "Popular quest for getting started";
    }

    /**
     * Creates a reason for history-based recommendation.
     *
     * @return user-friendly reason string
     */
    public static String historyReason() {
        return "Based on your activity history";
    }
}
