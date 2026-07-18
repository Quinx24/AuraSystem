package org.example.aurabackend.recommendation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.example.aurabackend.recommendation.strategy.CandidateStrategy;
import org.example.aurabackend.recommendation.strategy.ColdStartCandidateStrategy;
import org.example.aurabackend.recommendation.strategy.EmotionCandidateStrategy;
import org.example.aurabackend.recommendation.strategy.HistoryCandidateStrategy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Generates quest candidate pool for recommendation using strategy pattern.
 *
 * Responsibilities:
 *   - Coordinate multiple candidate strategies
 *   - Select appropriate strategy based on user state
 *   - Combine strategy results into candidate pool
 *   - Apply basic eligibility filters
 *
 * This component handles candidate orchestration only. It does not:
 *   - Rank candidates (handled by PersonalizedQuestScorer)
 *   - Score candidates (handled by PersonalizedQuestScorer)
 *   - Shuffle or randomize (deterministic only)
 *   - Apply personalization (handled by scorer)
 *
 * Strategy Selection:
 *   - Cold start: users with low confidence score (< 0.3)
 *   - History-based: users with sufficient history
 *   - Emotion-based: primary strategy for most users
 *
 * Architecture:
 *   Repository → CandidateGenerator → PersonalizedQuestScorer → TopNSelector → RecommendationService
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CandidateGenerator {

    private final SideQuestRepository sideQuestRepository;
    private final UserPreferenceProfileRepository userPreferenceProfileRepository;
    private final EmotionCandidateStrategy emotionCandidateStrategy;
    private final HistoryCandidateStrategy historyCandidateStrategy;
    private final ColdStartCandidateStrategy coldStartCandidateStrategy;

    private static final double COLD_START_CONFIDENCE_THRESHOLD = 0.3;

    /**
     * Generates a candidate pool for the given user and emotion.
     *
     * Selects the appropriate strategy based on user's profile confidence:
     * - Cold start strategy for users with low confidence
     * - History-based strategy for users with sufficient history
     * - Emotion-based strategy as primary fallback
     *
     * @param userId the user ID
     * @param emotion the target emotion
     * @return list of candidate quests
     */
    public List<SideQuest> generateCandidates(Long userId, Emotion emotion) {
        log.debug("Generating candidates for user: {}, emotion: {}", userId, emotion);

        // Get user's preference profile to determine strategy
        UserPreferenceProfile profile = userPreferenceProfileRepository.findByUserId(userId).orElse(null);

        // Select strategy based on profile confidence
        CandidateStrategy strategy = selectStrategy(profile, emotion);

        log.debug("Selected strategy: {} for user: {}", strategy.getStrategyName(), userId);

        // Generate candidates using selected strategy
        List<SideQuest> candidates = strategy.generateCandidates(userId, emotion);

        // Remove duplicates while preserving order
        List<SideQuest> uniqueCandidates = candidates.stream()
                .distinct()
                .collect(Collectors.toList());

        log.debug("Generated {} unique candidates for user: {}, emotion: {}", 
                uniqueCandidates.size(), userId, emotion);

        return uniqueCandidates;
    }

    /**
     * Selects the appropriate candidate strategy based on user profile.
     *
     * @param profile the user's preference profile
     * @param emotion the target emotion
     * @return selected strategy
     */
    private CandidateStrategy selectStrategy(UserPreferenceProfile profile, Emotion emotion) {
        // Cold start: no profile or low confidence
        if (profile == null || 
            profile.getConfidenceScore() == null || 
            profile.getConfidenceScore() < COLD_START_CONFIDENCE_THRESHOLD) {
            return coldStartCandidateStrategy;
        }

        // History-based: user has sufficient history
        if (profile.getPreferredCategories() != null && 
            !profile.getPreferredCategories().isEmpty()) {
            return historyCandidateStrategy;
        }

        // Default to emotion-based
        return emotionCandidateStrategy;
    }

    /**
     * Generates a candidate pool for the given emotion (legacy method for backward compatibility).
     *
     * @param emotion the target emotion
     * @return list of candidate quests
     * @deprecated Use generateCandidates(Long userId, Emotion emotion) instead
     */
    @Deprecated
    public List<SideQuest> generateCandidates(Emotion emotion) {
        log.debug("Generating candidates for emotion: {} (legacy method)", emotion);
        return emotionCandidateStrategy.generateCandidates(null, emotion);
    }
}
