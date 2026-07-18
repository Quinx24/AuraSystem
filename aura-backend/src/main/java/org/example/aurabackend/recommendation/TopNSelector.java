package org.example.aurabackend.recommendation;

import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.SideQuest;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Selects top N quests from scored candidates.
 *
 * Responsibilities:
 *   - Sort candidates by score (descending)
 *   - Return top N results
 *   - Maintain determinism (no randomization)
 *
 * This component handles ranking selection only. It does not:
 *   - Generate candidates (handled by CandidateGenerator)
 *   - Score candidates (handled by PersonalizedQuestScorer)
 *   - Shuffle or randomize (strictly deterministic)
 *
 * Architecture:
 *   Repository → CandidateGenerator → PersonalizedQuestScorer → TopNSelector → RecommendationService
 */
@Slf4j
@Component
public class TopNSelector {

    private static final int DEFAULT_TOP_N = 3;

    /**
     * Selects top N quests from scored candidates.
     *
     * @param scoredQuests the list of scored quests
     * @param n the number of top quests to return
     * @return list of top N quests, sorted by score (descending)
     */
    public List<SideQuest> selectTopN(List<PersonalizedQuestScorer.ScoredQuest> scoredQuests, int n) {
        log.debug("Selecting top {} from {} scored quests", n, scoredQuests.size());

        // Sort by score (descending) and take top N
        List<SideQuest> topQuests = scoredQuests.stream()
                .sorted(Comparator.comparingDouble(PersonalizedQuestScorer.ScoredQuest::getScore).reversed())
                .limit(n)
                .map(PersonalizedQuestScorer.ScoredQuest::getQuest)
                .collect(Collectors.toList());

        log.debug("Selected {} top quests", topQuests.size());
        return topQuests;
    }

    public List<PersonalizedQuestScorer.ScoredQuest> selectTopScored(
            List<PersonalizedQuestScorer.ScoredQuest> scoredQuests,
            int n
    ) {
        log.debug("Selecting top {} scored quests from {} candidates", n, scoredQuests.size());

        return scoredQuests.stream()
                .sorted(Comparator.comparingDouble(PersonalizedQuestScorer.ScoredQuest::getScore).reversed())
                .limit(n)
                .collect(Collectors.toList());
    }

    /**
     * Selects top N quests using default N value.
     *
     * @param scoredQuests the list of scored quests
     * @return list of top N quests, sorted by score (descending)
     */
    public List<SideQuest> selectTopN(List<PersonalizedQuestScorer.ScoredQuest> scoredQuests) {
        return selectTopN(scoredQuests, DEFAULT_TOP_N);
    }

    /**
     * Selects top N quests with minimum score threshold.
     *
     * @param scoredQuests the list of scored quests
     * @param n the number of top quests to return
     * @param minScore the minimum score threshold
     * @return list of top N quests above threshold, sorted by score (descending)
     */
    public List<SideQuest> selectTopNWithThreshold(List<PersonalizedQuestScorer.ScoredQuest> scoredQuests, 
                                                   int n, double minScore) {
        log.debug("Selecting top {} from {} scored quests with minimum score: {}", n, scoredQuests.size(), minScore);

        // Filter by minimum score, sort by score (descending), and take top N
        List<SideQuest> topQuests = scoredQuests.stream()
                .filter(sq -> sq.getScore() >= minScore)
                .sorted(Comparator.comparingDouble(PersonalizedQuestScorer.ScoredQuest::getScore).reversed())
                .limit(n)
                .map(PersonalizedQuestScorer.ScoredQuest::getQuest)
                .collect(Collectors.toList());

        log.debug("Selected {} top quests above threshold", topQuests.size());
        return topQuests;
    }
}
