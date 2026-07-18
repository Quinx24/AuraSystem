package org.example.aurabackend.recommendation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.UserActivityStat;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.UserActivityStatRepository;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.example.aurabackend.scoring.ActivityCategoryMapping;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Modular scorer for personalized quest recommendations.
 *
 * Responsibilities:
 *   - Score every candidate quest based on multiple factors
 *   - Use modular scoring components for extensibility
 *   - Avoid giant if-else chains
 *   - Support future scoring factors
 *
 * Scoring factors (modular):
 *   - Emotion compatibility
 *   - Category preference (from user profile)
 *   - Activity relevance (from activity statistics)
 *   - Completion history (from quest feedback)
 *   - Recent recommendations (diversity)
 *
 * This component handles scoring only. It does not:
 *   - Generate candidates (handled by CandidateGenerator)
 *   - Select top N (handled by TopNSelector)
 *   - Apply randomization (deterministic only)
 *
 * Architecture:
 *   Repository → CandidateGenerator → PersonalizedQuestScorer → TopNSelector → RecommendationService
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PersonalizedQuestScorer {

    private final UserPreferenceProfileRepository userPreferenceProfileRepository;
    private final UserActivityStatRepository userActivityStatRepository;
    private final ActivityCategoryMapping activityCategoryMapping;
    private final RecommendationWeights recommendationWeights;

    // Performance optimization: cache user profiles to avoid repeated DB access
    private final Map<Long, UserPreferenceProfile> profileCache = new ConcurrentHashMap<>();
    
    // Performance optimization: cache activity stats to avoid repeated DB access
    private final Map<Long, List<UserActivityStat>> activityStatsCache = new ConcurrentHashMap();

    /**
     * Gets user profile from cache or repository.
     *
     * @param userId the user ID
     * @return user profile or null if not found
     */
    private UserPreferenceProfile getCachedProfile(Long userId) {
        return profileCache.computeIfAbsent(userId, 
            id -> userPreferenceProfileRepository.findByUserId(id).orElse(null));
    }

    /**
     * Gets user activity stats from cache or repository.
     *
     * @param userId the user ID
     * @return list of activity stats
     */
    private List<UserActivityStat> getCachedActivityStats(Long userId) {
        return activityStatsCache.computeIfAbsent(userId, 
            id -> userActivityStatRepository.findByUserId(id));
    }

    /**
     * Clears the cache for a specific user.
     * Call this when a user's profile or activity stats are updated.
     *
     * @param userId the user ID
     */
    public void clearCacheForUser(Long userId) {
        profileCache.remove(userId);
        activityStatsCache.remove(userId);
        log.debug("Cleared cache for user: {}", userId);
    }

    /**
     * Clears all caches.
     * Use sparingly, typically only in tests or admin operations.
     */
    public void clearAllCaches() {
        profileCache.clear();
        activityStatsCache.clear();
        log.debug("Cleared all caches");
    }

    /**
     * Scores a quest for a given user and emotion.
     *
     * @param quest the quest to score
     * @param userId the user ID
     * @param emotion the target emotion
     * @return score in range [0.0, 1.0]
     */
    public double scoreQuest(SideQuest quest, Long userId, Emotion emotion) {
        double emotionScore = calculateEmotionScore(quest, emotion);
        double categoryScore = calculateCategoryScore(quest, userId);
        double activityScore = calculateActivityScore(quest, userId);
        double historyScore = calculateHistoryScore(quest, userId);
        double diversityScore = calculateDiversityScore(quest, userId);
        double noveltyScore = calculateNoveltyScore(quest, userId);

        // Weighted combination using configurable weights
        double totalScore = (emotionScore * recommendationWeights.getEmotion()) +
                          (categoryScore * recommendationWeights.getCategory()) +
                          (activityScore * recommendationWeights.getActivity()) +
                          (historyScore * recommendationWeights.getHistory()) +
                          (diversityScore * recommendationWeights.getDiversity()) +
                          (noveltyScore * recommendationWeights.getFutureDecay());

        log.debug("Score for quest {}: emotion={:.2f}, category={:.2f}, activity={:.2f}, history={:.2f}, diversity={:.2f}, novelty={:.2f}, total={:.2f}",
                quest.getId(), emotionScore, categoryScore, activityScore, historyScore, diversityScore, noveltyScore, totalScore);

        return totalScore;
    }

    /**
     * Calculates emotion compatibility score.
     *
     * @param quest the quest
     * @param emotion the target emotion
     * @return score in range [0.0, 1.0]
     */
    private double calculateEmotionScore(SideQuest quest, Emotion emotion) {
        // Direct match gets full score
        if (quest.getEmotion() == emotion) {
            return 1.0;
        }

        // Compatible emotions get partial score
        if (isEmotionCompatible(quest.getEmotion(), emotion)) {
            return 0.7;
        }

        // Incompatible emotions get low score
        return 0.2;
    }

    /**
     * Checks if two emotions are compatible for recommendation.
     *
     * @param questEmotion the quest's emotion
     * @param targetEmotion the target emotion
     * @return true if compatible
     */
    private boolean isEmotionCompatible(Emotion questEmotion, Emotion targetEmotion) {
        // Define compatible emotion pairs
        return switch (targetEmotion) {
            case HAPPY -> questEmotion == Emotion.EXCITED || questEmotion == Emotion.NEUTRAL;
            case SAD -> questEmotion == Emotion.NEUTRAL || questEmotion == Emotion.ANXIETY;
            case STRESS -> questEmotion == Emotion.ANXIETY || questEmotion == Emotion.ANGRY;
            case ANXIETY -> questEmotion == Emotion.STRESS || questEmotion == Emotion.NEUTRAL;
            case ANGRY -> questEmotion == Emotion.STRESS || questEmotion == Emotion.NEUTRAL;
            case EXCITED -> questEmotion == Emotion.HAPPY || questEmotion == Emotion.NEUTRAL;
            case NEUTRAL -> true; // Neutral is compatible with everything
        };
    }

    /**
     * Calculates category preference score based on user profile.
     *
     * @param quest the quest
     * @param userId the user ID
     * @return score in range [0.0, 1.0]
     */
    private double calculateCategoryScore(SideQuest quest, Long userId) {
        UserPreferenceProfile profile = getCachedProfile(userId);

        if (profile == null || profile.getCategoryWeights() == null) {
            // No profile data, give neutral score
            return 0.5;
        }

        Map<String, Double> categoryWeights = profile.getCategoryWeights();
        String questCategory = quest.getCategory().name();

        // Get weight for this category
        Double weight = categoryWeights.get(questCategory);
        if (weight == null) {
            // Category not in profile, give neutral score
            return 0.5;
        }

        return weight; // Weight is already normalized to [0.0, 1.0]
    }

    /**
     * Calculates activity relevance score based on user activity statistics.
     *
     * @param quest the quest
     * @param userId the user ID
     * @return score in range [0.0, 1.0]
     */
    private double calculateActivityScore(SideQuest quest, Long userId) {
        List<UserActivityStat> activityStats = getCachedActivityStats(userId);

        if (activityStats.isEmpty()) {
            // No activity data, give neutral score
            return 0.5;
        }

        // Check if quest category aligns with user's top activities
        String questCategory = quest.getCategory().name();
        int matchingActivities = 0;

        for (UserActivityStat stat : activityStats) {
            String activityCategory = activityCategoryMapping.getCategoryForActivity(stat.getActivityName());
            if (questCategory.equals(activityCategory)) {
                matchingActivities += stat.getMentionCount();
            }
        }

        // Normalize based on total activity mentions
        int totalMentions = activityStats.stream().mapToInt(UserActivityStat::getMentionCount).sum();
        if (totalMentions == 0) {
            return 0.5;
        }

        double relevanceRatio = (double) matchingActivities / totalMentions;
        return Math.min(relevanceRatio * 2.0, 1.0); // Scale up but cap at 1.0
    }

    /**
     * Calculates history score based on quest completion history.
     *
     * @param quest the quest
     * @param userId the user ID
     * @return score in range [0.0, 1.0]
     */
    private double calculateHistoryScore(SideQuest quest, Long userId) {
        // TODO: Implement history-based scoring using quest_feedback table
        // For now, return neutral score
        return 0.5;
    }

    /**
     * Calculates diversity score to recommend variety.
     *
     * This is a placeholder for future implementation that would track
     * recently recommended quests and penalize repeats.
     *
     * @param quest the quest
     * @param userId the user ID
     * @return score in range [0.0, 1.0]
     */
    private double calculateDiversityScore(SideQuest quest, Long userId) {
        // TODO: Implement recent recommendation tracking
        // For now, return neutral score
        return 0.5;
    }

    /**
     * Calculates novelty score based on future plans.
     *
     * @param quest the quest
     * @param userId the user ID
     * @return score in range [0.0, 1.0]
     */
    private double calculateNoveltyScore(SideQuest quest, Long userId) {
        // TODO: Implement novelty scoring based on future plans from extractions
        // For now, return neutral score
        return 0.5;
    }

    /**
     * Scores a list of quests for a user and emotion.
     *
     * @param quests the quests to score
     * @param userId the user ID
     * @param emotion the target emotion
     * @return list of scored quests
     */
    public List<ScoredQuest> scoreQuests(List<SideQuest> quests, Long userId, Emotion emotion) {
        return quests.stream()
                .map(quest -> new ScoredQuest(quest, scoreQuest(quest, userId, emotion)))
                .toList();
    }

    /**
     * Scores a quest and generates an explanation.
     *
     * @param quest the quest to score
     * @param userId the user ID
     * @param emotion the target emotion
     * @return scored quest with explanation
     */
    public ScoredQuestWithExplanation scoreQuestWithExplanation(SideQuest quest, Long userId, Emotion emotion) {
        double score = scoreQuest(quest, userId, emotion);
        RecommendationExplanation explanation = generateExplanation(quest, userId, emotion, score);
        return new ScoredQuestWithExplanation(quest, score, explanation);
    }

    /**
     * Generates a user-friendly explanation for a quest recommendation.
     *
     * @param quest the quest
     * @param userId the user ID
     * @param emotion the target emotion
     * @param score the calculated score
     * @return recommendation explanation
     */
    private RecommendationExplanation generateExplanation(SideQuest quest, Long userId, Emotion emotion, double score) {
        RecommendationExplanation explanation = RecommendationExplanation.builder()
                .questId(quest.getId())
                .questTitle(quest.getTitle())
                .confidence(score)
                .build();

        // Add emotion match reason
        if (quest.getEmotion() == emotion) {
            explanation.addReason(RecommendationExplanation.emotionMatchReason(emotion.name()));
        }

        // Add category match reason
        UserPreferenceProfile profile = getCachedProfile(userId);
        if (profile != null && profile.getPreferredCategories() != null) {
            if (profile.getPreferredCategories().contains(quest.getCategory().name())) {
                explanation.addReason(RecommendationExplanation.categoryMatchReason(quest.getCategory().name()));
            }
        }

        // Add activity alignment reason
        List<UserActivityStat> activityStats = getCachedActivityStats(userId);
        if (!activityStats.isEmpty()) {
            String questCategory = quest.getCategory().name();
            for (UserActivityStat stat : activityStats) {
                String activityCategory = activityCategoryMapping.getCategoryForActivity(stat.getActivityName());
                if (questCategory.equals(activityCategory)) {
                    explanation.addReason(RecommendationExplanation.activityAlignmentReason(stat.getActivityName()));
                    break;
                }
            }
        }

        // Add positive trigger reason
        if (profile != null && profile.getKnownPositiveTriggers() != null) {
            String questCategory = quest.getCategory().name();
            for (UserActivityStat stat : activityStats) {
                if (profile.getKnownPositiveTriggers().contains(stat.getActivityName())) {
                    String activityCategory = activityCategoryMapping.getCategoryForActivity(stat.getActivityName());
                    if (questCategory.equals(activityCategory)) {
                        explanation.addReason(RecommendationExplanation.positiveTriggerReason(stat.getActivityName()));
                        break;
                    }
                }
            }
        }

        return explanation;
    }

    /**
     * Internal class to hold a quest with its score.
     */
    public static class ScoredQuest {
        private final SideQuest quest;
        private final double score;

        public ScoredQuest(SideQuest quest, double score) {
            this.quest = quest;
            this.score = score;
        }

        public SideQuest getQuest() {
            return quest;
        }

        public double getScore() {
            return score;
        }
    }

    /**
     * Internal class to hold a quest with its score and explanation.
     */
    public static class ScoredQuestWithExplanation {
        private final SideQuest quest;
        private final double score;
        private final RecommendationExplanation explanation;

        public ScoredQuestWithExplanation(SideQuest quest, double score, RecommendationExplanation explanation) {
            this.quest = quest;
            this.score = score;
            this.explanation = explanation;
        }

        public SideQuest getQuest() {
            return quest;
        }

        public double getScore() {
            return score;
        }

        public RecommendationExplanation getExplanation() {
            return explanation;
        }
    }
}
