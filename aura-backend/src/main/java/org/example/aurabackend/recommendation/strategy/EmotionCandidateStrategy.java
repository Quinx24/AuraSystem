package org.example.aurabackend.recommendation.strategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.SideQuestRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Strategy that generates candidates based on emotion matching.
 *
 * Retrieves all published quests that match the target emotion.
 * This is the primary strategy for users with sufficient history.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EmotionCandidateStrategy implements CandidateStrategy {

    private final SideQuestRepository sideQuestRepository;

    @Override
    public List<SideQuest> generateCandidates(Long userId, Emotion emotion) {
        if (emotion == null) {
            log.debug("EmotionCandidateStrategy: emotion is null, returning empty list");
            return List.of();
        }

        log.debug("EmotionCandidateStrategy: generating candidates for emotion: {}", emotion);

        List<SideQuest> candidates = sideQuestRepository.findByEmotionAndPublishedTrue(emotion);

        log.debug("EmotionCandidateStrategy: generated {} candidates for emotion: {}", 
                candidates.size(), emotion);

        return candidates;
    }

    @Override
    public String getStrategyName() {
        return "EmotionCandidateStrategy";
    }
}
