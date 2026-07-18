package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.dto.response.RecommendationResult;
import org.example.aurabackend.dto.response.SideQuestResponse;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.recommendation.CandidateGenerator;
import org.example.aurabackend.recommendation.PersonalizedQuestScorer;
import org.example.aurabackend.recommendation.RecommendationExplanation;
import org.example.aurabackend.recommendation.TopNSelector;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for personalized quest recommendation orchestration.
 *
 * Responsibilities:
 *   - Orchestrate the complete recommendation pipeline
 *   - Coordinate between CandidateGenerator, PersonalizedQuestScorer, and TopNSelector
 *   - Provide high-level recommendation interface
 *
 * This service handles recommendation orchestration only. It does not:
 *   - Generate candidates (handled by CandidateGenerator)
 *   - Score candidates (handled by PersonalizedQuestScorer)
 *   - Select top N (handled by TopNSelector)
 *   - Apply randomization (strictly deterministic)
 *
 * Architecture:
 *   Repository → CandidateGenerator → PersonalizedQuestScorer → TopNSelector → RecommendationService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final CandidateGenerator candidateGenerator;
    private final PersonalizedQuestScorer personalizedQuestScorer;
    private final TopNSelector topNSelector;
    private final CurrentUserService currentUserService;
    private final JournalEntryRepository journalEntryRepository;

    private static final int DEFAULT_RECOMMENDATION_COUNT = 3;

    /**
     * Generates personalized quest recommendations for the current user.
     *
     * @param emotion the target emotion
     * @return list of recommended quests
     */
    public List<SideQuest> recommendQuests(Emotion emotion) {
        User user = currentUserService.getCurrentUser();
        return recommendQuests(user.getId(), emotion);
    }

    /**
     * Generates personalized quest recommendations for a specific user.
     *
     * @param userId the user ID
     * @param emotion the target emotion
     * @return list of recommended quests
     */
    public List<SideQuest> recommendQuests(Long userId, Emotion emotion) {
        log.info("event=RecommendationStarted userId={} emotion={} count={}",
                userId, emotion, DEFAULT_RECOMMENDATION_COUNT);

        // Step 1: Generate candidate pool
        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, emotion);

        if (candidates.isEmpty()) {
            log.warn("No candidates found for emotion: {}", emotion);
            return List.of();
        }

        // Step 2: Score all candidates
        List<PersonalizedQuestScorer.ScoredQuest> scoredQuests = 
                personalizedQuestScorer.scoreQuests(candidates, userId, emotion);

        // Step 3: Select top N
        List<SideQuest> recommendations = topNSelector.selectTopN(scoredQuests, DEFAULT_RECOMMENDATION_COUNT);

        log.info("event=RecommendationCompleted userId={} emotion={} resultCount={}",
                userId, emotion, recommendations.size());

        return recommendations;
    }

    /**
     * Generates personalized quest recommendations with custom count.
     *
     * @param userId the user ID
     * @param emotion the target emotion
     * @param count the number of recommendations to return
     * @return list of recommended quests
     */
    public List<SideQuest> recommendQuests(Long userId, Emotion emotion, int count) {
        log.info("event=RecommendationStarted userId={} emotion={} count={}", userId, emotion, count);

        // Step 1: Generate candidate pool
        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, emotion);

        if (candidates.isEmpty()) {
            log.warn("No candidates found for emotion: {}", emotion);
            return List.of();
        }

        // Step 2: Score all candidates
        List<PersonalizedQuestScorer.ScoredQuest> scoredQuests = 
                personalizedQuestScorer.scoreQuests(candidates, userId, emotion);

        // Step 3: Select top N
        List<SideQuest> recommendations = topNSelector.selectTopN(scoredQuests, count);

        log.info("event=RecommendationCompleted userId={} emotion={} resultCount={}",
                userId, emotion, recommendations.size());

        return recommendations;
    }

    public List<RecommendationResult> recommendQuestResults(Emotion emotion, int count) {
        User user = currentUserService.getCurrentUser();
        Emotion effectiveEmotion = resolveRecommendationEmotion(user, emotion);

        return recommendQuestResults(user.getId(), effectiveEmotion, count);
    }

    public List<RecommendationResult> recommendQuestResults(Long userId, Emotion emotion, int count) {
        long startedAt = System.nanoTime();
        log.info("event=RecommendationStarted userId={} emotion={} count={}", userId, emotion, count);

        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, emotion);

        if (candidates.isEmpty()) {
            log.warn("event=RecommendationCompleted userId={} emotion={} resultCount=0 latencyMs={} reason=no_candidates",
                    userId, emotion, elapsedMillis(startedAt));
            return List.of();
        }

        List<PersonalizedQuestScorer.ScoredQuest> scoredQuests =
                personalizedQuestScorer.scoreQuests(candidates, userId, emotion);

        List<RecommendationResult> results = topNSelector.selectTopScored(scoredQuests, count)
                .stream()
                .map(scoredQuest -> toRecommendationResult(scoredQuest, userId, emotion))
                .toList();

        log.info("event=RecommendationCompleted userId={} emotion={} resultCount={} latencyMs={}",
                userId, emotion, results.size(), elapsedMillis(startedAt));

        return results;
    }

    /**
     * Generates recommendations with minimum score threshold.
     *
     * @param userId the user ID
     * @param emotion the target emotion
     * @param count the number of recommendations to return
     * @param minScore the minimum score threshold
     * @return list of recommended quests
     */
    public List<SideQuest> recommendQuestsWithThreshold(Long userId, Emotion emotion, int count, double minScore) {
        log.info("Generating {} recommendations with min score {} for user ID: {}, emotion: {}", 
                count, minScore, userId, emotion);

        // Step 1: Generate candidate pool
        List<SideQuest> candidates = candidateGenerator.generateCandidates(userId, emotion);

        if (candidates.isEmpty()) {
            log.warn("No candidates found for emotion: {}", emotion);
            return List.of();
        }

        // Step 2: Score all candidates
        List<PersonalizedQuestScorer.ScoredQuest> scoredQuests = 
                personalizedQuestScorer.scoreQuests(candidates, userId, emotion);

        // Step 3: Select top N with threshold
        List<SideQuest> recommendations = topNSelector.selectTopNWithThreshold(scoredQuests, count, minScore);

        log.info("Generated {} recommendations for user ID: {}, emotion: {}", 
                recommendations.size(), userId, emotion);

        return recommendations;
    }

    private Emotion resolveRecommendationEmotion(User user, Emotion requestedEmotion) {
        if (requestedEmotion != null) {
            return requestedEmotion;
        }

        return journalEntryRepository.findTopByUserOrderByCreatedAtDesc(user)
                .map(JournalEntry::getPrimaryEmotion)
                .orElse(Emotion.NEUTRAL);
    }

    private RecommendationResult toRecommendationResult(
            PersonalizedQuestScorer.ScoredQuest scoredQuest,
            Long userId,
            Emotion emotion
    ) {
        SideQuest quest = scoredQuest.getQuest();
        RecommendationExplanation explanation = personalizedQuestScorer
                .scoreQuestWithExplanation(quest, userId, emotion)
                .getExplanation();

        List<String> reasons = explanation.getReasons();
        if (reasons == null || reasons.isEmpty()) {
            reasons = List.of(RecommendationExplanation.coldStartReason());
        }

        return RecommendationResult.builder()
                .quest(toSideQuestResponse(quest))
                .score(round(scoredQuest.getScore()))
                .explanations(reasons)
                .confidence(round(explanation.getConfidence()))
                .recommendationTime(LocalDateTime.now())
                .build();
    }

    private SideQuestResponse toSideQuestResponse(SideQuest sideQuest) {
        return SideQuestResponse.builder()
                .id(sideQuest.getId())
                .title(sideQuest.getTitle())
                .description(sideQuest.getDescription())
                .xpReward(sideQuest.getXpReward())
                .emotion(sideQuest.getEmotion())
                .category(sideQuest.getCategory())
                .build();
    }

    private double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

    private long elapsedMillis(long startedAt) {
        return (System.nanoTime() - startedAt) / 1_000_000;
    }
}
