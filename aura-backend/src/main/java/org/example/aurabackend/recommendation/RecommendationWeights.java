package org.example.aurabackend.recommendation;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for recommendation scoring weights.
 *
 * This class loads scoring weights from application.properties using
 * @ConfigurationProperties. Changing weights requires no recompilation.
 *
 * Weights must sum to 1.0 for consistent scoring.
 *
 * Example configuration in application.properties:
 *   recommendation.weights.emotion=0.35
 *   recommendation.weights.category=0.25
 *   recommendation.weights.activity=0.20
 *   recommendation.weights.history=0.10
 *   recommendation.weights.diversity=0.10
 *   recommendation.weights.futureDecay=0.05
 */
@Getter
@Component
@ConfigurationProperties(prefix = "recommendation.weights")
public class RecommendationWeights {

    /**
     * Weight for emotion compatibility score.
     * Higher values prioritize emotion-matched quests.
     */
    private double emotion = 0.35;

    /**
     * Weight for category preference score.
     * Higher values prioritize user's preferred categories.
     */
    private double category = 0.25;

    /**
     * Weight for activity relevance score.
     * Higher values prioritize quests aligned with user's activities.
     */
    private double activity = 0.20;

    /**
     * Weight for completion history score.
     * Higher values prioritize quests with good completion history.
     */
    private double history = 0.10;

    /**
     * Weight for diversity score.
     * Higher values prioritize variety in recommendations.
     */
    private double diversity = 0.10;

    /**
     * Weight for future decay score.
     * Higher values penalize quests that don't align with future plans.
     */
    private double futureDecay = 0.05;

    /**
     * Validates that weights sum to approximately 1.0.
     *
     * @throws IllegalStateException if weights don't sum to 1.0 within tolerance
     */
    public void validate() {
        double sum = emotion + category + activity + history + diversity + futureDecay;
        double tolerance = 0.01;

        if (Math.abs(sum - 1.0) > tolerance) {
            throw new IllegalStateException(
                String.format("Recommendation weights must sum to 1.0, but sum is %.2f", sum)
            );
        }
    }

    /**
     * Gets the total weight sum.
     * Useful for debugging and validation.
     *
     * @return sum of all weights
     */
    public double getTotalWeight() {
        return emotion + category + activity + history + diversity + futureDecay;
    }
}
