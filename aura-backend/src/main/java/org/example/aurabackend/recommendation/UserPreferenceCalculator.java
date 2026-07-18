package org.example.aurabackend.recommendation;

import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.UserActivityStat;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.scoring.ActivityCategoryMapping;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Calculator for user preference profiles.
 *
 * Responsibilities:
 *   - Compute preferred categories based on activity statistics
 *   - Compute top activities by mention frequency
 *   - Detect positive and negative triggers from emotion correlations
 *   - Calculate category weights for recommendation scoring
 *   - Compute profile confidence score
 *
 * This class owns every preference algorithm. No calculation remains in
 * UserPreferenceProfileService after refactoring.
 *
 * Confidence Score Factors:
 *   - Journal count (more journals = higher confidence)
 *   - Activity diversity (more unique activities = higher confidence)
 *   - Emotional consistency (consistent patterns = higher confidence)
 *   - Extraction completeness (more complete extractions = higher confidence)
 */
@Slf4j
@Component
public class UserPreferenceCalculator {

    private final ActivityCategoryMapping activityCategoryMapping;

    private static final int TOP_ACTIVITIES_LIMIT = 10;
    private static final double POSITIVE_TRIGGER_THRESHOLD = 0.6;
    private static final int MIN_JOURNALS_FOR_CONFIDENCE = 3;
    private static final int MIN_ACTIVITIES_FOR_CONFIDENCE = 5;

    public UserPreferenceCalculator(ActivityCategoryMapping activityCategoryMapping) {
        this.activityCategoryMapping = activityCategoryMapping;
    }

    /**
     * Computes preferred categories based on activity statistics.
     *
     * @param activityStats the user's activity statistics
     * @return ordered list of preferred categories
     */
    public List<String> computePreferredCategories(List<UserActivityStat> activityStats) {
        Map<String, Integer> categoryScores = new HashMap<>();

        // Initialize all categories with 0
        for (SideQuestCategory category : SideQuestCategory.values()) {
            categoryScores.put(category.name(), 0);
        }

        // Score categories based on activity mentions
        for (UserActivityStat stat : activityStats) {
            String activityName = stat.getActivityName();
            String category = activityCategoryMapping.getCategoryForActivity(activityName);
            
            if (category != null && categoryScores.containsKey(category)) {
                categoryScores.put(category, categoryScores.get(category) + stat.getMentionCount());
            }
        }

        // Sort by score (descending)
        return categoryScores.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * Computes top activities by mention frequency.
     *
     * @param activityStats the user's activity statistics
     * @return list of top activity names
     */
    public List<String> computeTopActivities(List<UserActivityStat> activityStats) {
        return activityStats.stream()
                .sorted(Comparator.comparingInt(UserActivityStat::getMentionCount).reversed())
                .limit(TOP_ACTIVITIES_LIMIT)
                .map(UserActivityStat::getActivityName)
                .collect(Collectors.toList());
    }

    /**
     * Computes preferred places based on journal extractions.
     *
     * @param places list of places from journal extractions
     * @return ordered list of preferred places
     */
    public List<String> computePreferredPlaces(List<String> places) {
        if (places == null || places.isEmpty()) {
            return List.of();
        }

        // Count place occurrences
        Map<String, Integer> placeCounts = new HashMap<>();
        for (String place : places) {
            if (place != null && !place.trim().isEmpty()) {
                String normalizedPlace = place.trim().toLowerCase();
                placeCounts.put(normalizedPlace, placeCounts.getOrDefault(normalizedPlace, 0) + 1);
            }
        }

        // Sort by frequency (descending)
        return placeCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * Computes preferred people based on journal extractions.
     *
     * @param people list of people from journal extractions
     * @return ordered list of preferred people
     */
    public List<String> computePreferredPeople(List<String> people) {
        if (people == null || people.isEmpty()) {
            return List.of();
        }

        // Count people occurrences
        Map<String, Integer> peopleCounts = new HashMap<>();
        for (String person : people) {
            if (person != null && !person.trim().isEmpty()) {
                String normalizedPerson = person.trim().toLowerCase();
                peopleCounts.put(normalizedPerson, peopleCounts.getOrDefault(normalizedPerson, 0) + 1);
            }
        }

        // Sort by frequency (descending)
        return peopleCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * Computes positive triggers based on emotion correlations.
     *
     * An activity is a positive trigger if it appears with positive emotions
     * (HAPPY, EXCITED) more frequently than with negative emotions.
     *
     * @param activityStats the user's activity statistics
     * @return list of positive trigger activities
     */
    public List<String> computePositiveTriggers(List<UserActivityStat> activityStats) {
        List<String> positiveTriggers = new ArrayList<>();

        for (UserActivityStat stat : activityStats) {
            int positiveCount = stat.getEmotionHappy() + stat.getEmotionExcited();
            int negativeCount = stat.getEmotionSad() + stat.getEmotionStress() + 
                              stat.getEmotionAnxiety() + stat.getEmotionAngry();
            int totalCount = positiveCount + negativeCount + stat.getEmotionNeutral();

            if (totalCount > 0) {
                double positiveRatio = (double) positiveCount / totalCount;
                if (positiveRatio >= POSITIVE_TRIGGER_THRESHOLD) {
                    positiveTriggers.add(stat.getActivityName());
                }
            }
        }

        return positiveTriggers;
    }

    /**
     * Computes negative triggers based on emotion correlations.
     *
     * An activity is a negative trigger if it appears with negative emotions
     * (SAD, STRESS, ANXIETY, ANGRY) more frequently than with positive emotions.
     *
     * @param activityStats the user's activity statistics
     * @return list of negative trigger activities
     */
    public List<String> computeNegativeTriggers(List<UserActivityStat> activityStats) {
        List<String> negativeTriggers = new ArrayList<>();

        for (UserActivityStat stat : activityStats) {
            int positiveCount = stat.getEmotionHappy() + stat.getEmotionExcited();
            int negativeCount = stat.getEmotionSad() + stat.getEmotionStress() + 
                              stat.getEmotionAnxiety() + stat.getEmotionAngry();
            int totalCount = positiveCount + negativeCount + stat.getEmotionNeutral();

            if (totalCount > 0) {
                double negativeRatio = (double) negativeCount / totalCount;
                if (negativeRatio >= POSITIVE_TRIGGER_THRESHOLD) {
                    negativeTriggers.add(stat.getActivityName());
                }
            }
        }

        return negativeTriggers;
    }

    /**
     * Computes normalized category weights for recommendation scoring.
     *
     * Weights are normalized to [0.0, 1.0] range.
     *
     * @param activityStats the user's activity statistics
     * @param preferredCategories the ordered list of preferred categories
     * @return map of category names to weights
     */
    public Map<String, Double> computeCategoryWeights(List<UserActivityStat> activityStats, 
                                                       List<String> preferredCategories) {
        Map<String, Double> weights = new HashMap<>();
        Map<String, Integer> categoryScores = new HashMap<>();

        // Calculate raw scores
        for (UserActivityStat stat : activityStats) {
            String activityName = stat.getActivityName();
            String category = activityCategoryMapping.getCategoryForActivity(activityName);
            
            if (category != null) {
                categoryScores.put(category, categoryScores.getOrDefault(category, 0) + stat.getMentionCount());
            }
        }

        // Find max score for normalization
        int maxScore = categoryScores.values().stream().max(Integer::compare).orElse(1);

        // Normalize to [0.0, 1.0]
        for (String category : preferredCategories) {
            int score = categoryScores.getOrDefault(category, 0);
            double normalizedWeight = maxScore > 0 ? (double) score / maxScore : 0.0;
            weights.put(category, normalizedWeight);
        }

        return weights;
    }

    /**
     * Computes profile confidence score.
     *
     * Confidence factors:
     *   - Journal count: more journals = higher confidence
     *   - Activity diversity: more unique activities = higher confidence
     *   - Emotional consistency: consistent patterns = higher confidence
     *   - Extraction completeness: more complete extractions = higher confidence
     *
     * @param journalCount number of journal entries
     * @param activityStats the user's activity statistics
     * @param extractionCompleteness ratio of complete extractions (0.0 to 1.0)
     * @return confidence score in range [0.0, 1.0]
     */
    public double computeConfidenceScore(int journalCount, 
                                         List<UserActivityStat> activityStats,
                                         double extractionCompleteness) {
        double journalScore = computeJournalConfidence(journalCount);
        double diversityScore = computeDiversityConfidence(activityStats);
        double completenessScore = extractionCompleteness;

        // Weighted average of confidence factors
        double confidence = (journalScore * 0.4) + 
                           (diversityScore * 0.3) + 
                           (completenessScore * 0.3);

        log.debug("Confidence score: journal={:.2f}, diversity={:.2f}, completeness={:.2f}, total={:.2f}",
                journalScore, diversityScore, completenessScore, confidence);

        return Math.min(confidence, 1.0);
    }

    /**
     * Computes journal-based confidence.
     *
     * @param journalCount number of journal entries
     * @return confidence score in range [0.0, 1.0]
     */
    private double computeJournalConfidence(int journalCount) {
        if (journalCount < MIN_JOURNALS_FOR_CONFIDENCE) {
            return 0.0;
        }
        // Logarithmic scaling: confidence increases with journal count but plateaus
        return Math.min(Math.log(journalCount) / Math.log(20), 1.0);
    }

    /**
     * Computes diversity-based confidence.
     *
     * @param activityStats the user's activity statistics
     * @return confidence score in range [0.0, 1.0]
     */
    private double computeDiversityConfidence(List<UserActivityStat> activityStats) {
        int uniqueActivities = activityStats.size();
        if (uniqueActivities < MIN_ACTIVITIES_FOR_CONFIDENCE) {
            return 0.0;
        }
        // Linear scaling up to 20 unique activities
        return Math.min((double) uniqueActivities / 20.0, 1.0);
    }
}
