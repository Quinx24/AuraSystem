package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.JournalExtraction;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserActivityStat;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.example.aurabackend.repository.JournalEntryRepository;
import org.example.aurabackend.repository.JournalExtractionRepository;
import org.example.aurabackend.repository.UserActivityStatRepository;
import org.example.aurabackend.repository.UserPreferenceProfileRepository;
import org.example.aurabackend.recommendation.PersonalizedQuestScorer;
import org.example.aurabackend.recommendation.UserPreferenceCalculator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for orchestrating user preference profile recomputation.
 *
 * Responsibilities:
 *   - Load data from repositories
 *   - Invoke UserPreferenceCalculator for all preference computations
 *   - Save profile to repository
 *   - Publish events if necessary
 *
 * This service handles orchestration only. All business algorithms are delegated
 * to UserPreferenceCalculator. No preference calculation remains in this service.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserPreferenceProfileService {

    private final UserPreferenceProfileRepository userPreferenceProfileRepository;
    private final UserActivityStatRepository userActivityStatRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final JournalExtractionRepository journalExtractionRepository;
    private final UserPreferenceCalculator userPreferenceCalculator;
    private final PersonalizedQuestScorer personalizedQuestScorer;

    private static final int MIN_JOURNALS_FOR_PROFILE = 3;

    /**
     * Recomputes the preference profile for a user.
     *
     * This method analyzes the user's activity statistics and journal history
     * to build a comprehensive preference profile.
     *
     * @param user the user whose profile to recompute
     */
    @Transactional
    public void recomputeProfile(User user) {
        if (user == null) {
            log.warn("Cannot recompute profile: user is null");
            return;
        }

        // Check if user has enough data
        long journalCount = journalEntryRepository.countByUser(user);
        if (journalCount < MIN_JOURNALS_FOR_PROFILE) {
            log.info("User {} has only {} journals (minimum {}), skipping profile recomputation",
                    user.getId(), journalCount, MIN_JOURNALS_FOR_PROFILE);
            return;
        }

        log.info("Recomputing profile for user {}", user.getId());

        // Get activity statistics
        List<UserActivityStat> activityStats = userActivityStatRepository.findByUser(user);

        if (activityStats.isEmpty()) {
            log.info("No activity statistics found for user {}, skipping profile recomputation", user.getId());
            return;
        }

        // Get journal extractions for place and people preferences
        List<JournalExtraction> extractions = journalExtractionRepository.findByUser(user);

        // Extract places and people from extractions
        List<String> allPlaces = extractions.stream()
                .flatMap(e -> e.getPlaces() != null ? e.getPlaces().stream() : java.util.stream.Stream.empty())
                .toList();
        List<String> allPeople = extractions.stream()
                .flatMap(e -> e.getPeople() != null ? e.getPeople().stream() : java.util.stream.Stream.empty())
                .toList();

        // Calculate extraction completeness (ratio of non-null extractions)
        double extractionCompleteness = extractions.isEmpty() ? 0.0 :
            extractions.stream()
                .filter(e -> e.getActivities() != null && !e.getActivities().isEmpty())
                .count() / (double) extractions.size();

        // Delegate all computation to calculator
        List<String> preferredCategories = userPreferenceCalculator.computePreferredCategories(activityStats);
        List<String> topActivities = userPreferenceCalculator.computeTopActivities(activityStats);
        List<String> preferredPlaces = userPreferenceCalculator.computePreferredPlaces(allPlaces);
        List<String> preferredPeople = userPreferenceCalculator.computePreferredPeople(allPeople);
        List<String> positiveTriggers = userPreferenceCalculator.computePositiveTriggers(activityStats);
        List<String> negativeTriggers = userPreferenceCalculator.computeNegativeTriggers(activityStats);
        java.util.Map<String, Double> categoryWeights = userPreferenceCalculator.computeCategoryWeights(activityStats, preferredCategories);
        double confidenceScore = userPreferenceCalculator.computeConfidenceScore((int) journalCount, activityStats, extractionCompleteness);

        // Create or update profile
        UserPreferenceProfile profile = userPreferenceProfileRepository.findByUser(user)
                .orElse(UserPreferenceProfile.builder().user(user).build());

        profile.setPreferredCategories(preferredCategories);
        profile.setTopActivities(topActivities);
        profile.setPreferredPlaces(preferredPlaces);
        profile.setPreferredPeople(preferredPeople);
        profile.setKnownPositiveTriggers(positiveTriggers);
        profile.setKnownNegativeTriggers(negativeTriggers);
        profile.setCategoryWeights(categoryWeights);
        profile.setConfidenceScore(confidenceScore);
        profile.setLastRecomputedAt(LocalDateTime.now());
        profile.setJournalCountAtRecompute((int) journalCount);

        userPreferenceProfileRepository.save(profile);
        personalizedQuestScorer.clearCacheForUser(user.getId());

        log.info("event=PreferenceProfileRecomputed userId={} confidenceScore={}", user.getId(), confidenceScore);
    }

}
