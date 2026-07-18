package org.example.aurabackend.recommendation.strategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.UserActivityStat;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.SideQuestRepository;
import org.example.aurabackend.repository.UserActivityStatRepository;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.example.aurabackend.scoring.ActivityCategoryMapping;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Strategy that generates candidates based on user's activity history.
 *
 * Retrieves quests that align with the user's preferred categories and activities.
 * Uses the user's preference profile to find relevant quests.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class HistoryCandidateStrategy implements CandidateStrategy {

    private final SideQuestRepository sideQuestRepository;
    private final UserPreferenceProfileRepository userPreferenceProfileRepository;
    private final UserActivityStatRepository userActivityStatRepository;
    private final ActivityCategoryMapping activityCategoryMapping;

    @Override
    public List<SideQuest> generateCandidates(Long userId, Emotion emotion) {
        log.debug("HistoryCandidateStrategy: generating candidates for user: {}", userId);

        // Get user's preference profile
        UserPreferenceProfile profile = userPreferenceProfileRepository.findByUserId(userId).orElse(null);

        if (profile == null || profile.getPreferredCategories() == null || profile.getPreferredCategories().isEmpty()) {
            log.debug("HistoryCandidateStrategy: no profile found for user {}, returning empty list", userId);
            return List.of();
        }

        // Get user's activity stats
        List<UserActivityStat> activityStats = userActivityStatRepository.findByUserId(userId);

        // Get all published quests
        List<SideQuest> allQuests = sideQuestRepository.findByPublishedTrue();

        // Filter quests based on preferred categories
        List<SideQuest> candidates = allQuests.stream()
                .filter(quest -> profile.getPreferredCategories().contains(quest.getCategory().name()))
                .collect(Collectors.toList());

        log.debug("HistoryCandidateStrategy: generated {} candidates for user {} based on history", 
                candidates.size(), userId);

        return candidates;
    }

    @Override
    public String getStrategyName() {
        return "HistoryCandidateStrategy";
    }
}
