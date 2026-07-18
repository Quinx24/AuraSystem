package org.example.aurabackend.recommendation.strategy;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Emotion;

import java.util.List;

/**
 * Strategy interface for generating quest candidates.
 *
 * Each strategy produces candidate quests based on different criteria:
 * - Emotion-based: matches current emotion
 * - History-based: uses user's activity history
 * - Cold start: for users with insufficient history
 *
 * CandidateGenerator coordinates multiple strategies and combines their results.
 * This design avoids giant if-else chains and makes the system extensible.
 */
public interface CandidateStrategy {

    /**
     * Generates candidate quests for a user and emotion.
     *
     * @param userId the user ID
     * @param emotion the target emotion (may be null for some strategies)
     * @return list of candidate quests
     */
    List<SideQuest> generateCandidates(Long userId, Emotion emotion);

    /**
     * Returns the strategy name for logging and debugging.
     *
     * @return strategy name
     */
    String getStrategyName();
}
