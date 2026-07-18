package org.example.aurabackend.recommendation.strategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.enumeration.SideQuestCategory;
import org.example.aurabackend.repository.SideQuestRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Strategy for users with insufficient history (cold start).
 *
 * Generates deterministic recommendations without random selection:
 * 1. Match emotion if available
 * 2. Use popular categories (EXERCISE, MINDFULNESS, CREATIVITY)
 * 3. Select from published quests
 * 4. Apply deterministic ranking (by ID, then title)
 *
 * This ensures consistent results for the same user and emotion.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ColdStartCandidateStrategy implements CandidateStrategy {

    private final SideQuestRepository sideQuestRepository;

    // Popular categories for cold start users (ordered by priority)
    private static final List<SideQuestCategory> POPULAR_CATEGORIES = List.of(
        SideQuestCategory.EXERCISE,
        SideQuestCategory.MINDFULNESS,
        SideQuestCategory.CREATIVITY,
        SideQuestCategory.SOCIAL,
        SideQuestCategory.PRODUCTIVITY
    );

    @Override
    public List<SideQuest> generateCandidates(Long userId, Emotion emotion) {
        log.debug("ColdStartCandidateStrategy: generating candidates for user: {}, emotion: {}", userId, emotion);

        // Get all published quests
        List<SideQuest> allPublished = sideQuestRepository.findByPublishedTrue();

        if (allPublished.isEmpty()) {
            log.debug("ColdStartCandidateStrategy: no published quests available");
            return List.of();
        }

        List<SideQuest> candidates = new ArrayList<>();

        if (emotion != null) {
            // Step 1: Match emotion first
            List<SideQuest> emotionMatches = allPublished.stream()
                    .filter(q -> q.getEmotion() == emotion)
                    .collect(Collectors.toList());
            
            if (!emotionMatches.isEmpty()) {
                candidates.addAll(emotionMatches);
                log.debug("ColdStartCandidateStrategy: found {} emotion-matching quests", emotionMatches.size());
            }
        }

        // Step 2: Add popular categories if we need more candidates
        if (candidates.size() < 10) {
            for (SideQuestCategory category : POPULAR_CATEGORIES) {
                List<SideQuest> categoryQuests = allPublished.stream()
                        .filter(q -> q.getCategory() == category)
                        .filter(q -> !candidates.contains(q)) // Avoid duplicates
                        .collect(Collectors.toList());
                
                candidates.addAll(categoryQuests);
                
                if (candidates.size() >= 20) {
                    break;
                }
            }
        }

        // Step 3: Apply deterministic ranking (by ID, then title for consistency)
        List<SideQuest> rankedCandidates = candidates.stream()
                .sorted(Comparator
                        .comparing(SideQuest::getId)
                        .thenComparing(q -> q.getTitle().toLowerCase()))
                .collect(Collectors.toList());

        log.debug("ColdStartCandidateStrategy: generated {} deterministic candidates for user: {}", 
                rankedCandidates.size(), userId);

        return rankedCandidates;
    }

    @Override
    public String getStrategyName() {
        return "ColdStartCandidateStrategy";
    }
}
