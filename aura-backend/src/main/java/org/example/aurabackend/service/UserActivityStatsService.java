package org.example.aurabackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.aurabackend.entity.JournalEntry;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserActivityStat;
import org.example.aurabackend.enumeration.Emotion;
import org.example.aurabackend.repository.UserActivityStatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Service for updating user activity statistics.
 *
 * Responsibilities:
 *   - Update activity mention frequencies
 *   - Update per-emotion activity frequencies
 *   - Track last mentioned dates
 *   - Handle upsert logic for user_activity_stats table
 *
 * This service handles statistics only. No recommendation logic here.
 * Recommendation logic is handled by RecommendationService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserActivityStatsService {

    private final UserActivityStatRepository userActivityStatRepository;

    /**
     * Updates activity statistics based on extraction data.
     *
     * This method processes the extracted activities and updates the
     * user_activity_stats table with upsert logic.
     *
     * @param user the user whose stats to update
     * @param extractionData the extraction data containing activities
     */
    @Transactional
    public void updateActivityStats(User user, ExtractionService.ExtractionData extractionData) {
        if (user == null) {
            log.warn("Cannot update activity stats: user is null");
            return;
        }

        LocalDate today = LocalDate.now();

        // Update activity statistics
        if (extractionData.activities != null && !extractionData.activities.isEmpty()) {
            for (String activity : extractionData.activities) {
                String normalizedActivity = normalizeActivityName(activity);
                upsertActivityStat(user, normalizedActivity, today);
            }
        }

        // Note: Place and people statistics could be added here in future milestones
        // For now, we focus on activities as the primary recommendation signal
    }

    /**
     * Updates activity statistics for a specific journal entry with emotion context.
     *
     * This version includes emotion tracking for trigger detection.
     *
     * @param journalEntry the journal entry
     * @param activities list of activities mentioned
     */
    @Transactional
    public void updateActivityStatsWithEmotion(JournalEntry journalEntry, List<String> activities) {
        if (journalEntry == null || journalEntry.getUser() == null) {
            log.warn("Cannot update activity stats with emotion: journal entry or user is null");
            return;
        }

        User user = journalEntry.getUser();
        LocalDate today = LocalDate.now();
        Emotion primaryEmotion = journalEntry.getPrimaryEmotion();

        if (activities != null && !activities.isEmpty()) {
            for (String activity : activities) {
                String normalizedActivity = normalizeActivityName(activity);
                upsertActivityStatWithEmotion(user, normalizedActivity, today, primaryEmotion);
            }
        }
    }

    /**
     * Upserts an activity stat record.
     *
     * @param user the user
     * @param activityName the normalized activity name
     * @param today the current date
     */
    private void upsertActivityStat(User user, String activityName, LocalDate today) {
        UserActivityStat stat = userActivityStatRepository
                .findByUserAndActivityName(user, activityName)
                .orElse(null);

        if (stat == null) {
            // Create new stat
            stat = UserActivityStat.builder()
                    .user(user)
                    .activityName(activityName)
                    .mentionCount(1)
                    .lastMentioned(today)
                    .build();
            userActivityStatRepository.save(stat);
            log.debug("Created new activity stat for user: {}, activity: {}", user.getId(), activityName);
        } else {
            // Update existing stat
            stat.setMentionCount(stat.getMentionCount() + 1);
            stat.setLastMentioned(today);
            userActivityStatRepository.save(stat);
            log.debug("Updated activity stat for user: {}, activity: {}, count: {}", 
                    user.getId(), activityName, stat.getMentionCount());
        }
    }

    /**
     * Upserts an activity stat record with emotion tracking.
     *
     * @param user the user
     * @param activityName the normalized activity name
     * @param today the current date
     * @param emotion the primary emotion from the journal
     */
    private void upsertActivityStatWithEmotion(User user, String activityName, LocalDate today, Emotion emotion) {
        UserActivityStat stat = userActivityStatRepository
                .findByUserAndActivityName(user, activityName)
                .orElse(null);

        if (stat == null) {
            // Create new stat
            stat = UserActivityStat.builder()
                    .user(user)
                    .activityName(activityName)
                    .mentionCount(1)
                    .lastMentioned(today)
                    .build();
            
            // Set initial emotion count
            incrementEmotionCount(stat, emotion);
            
            userActivityStatRepository.save(stat);
            log.debug("Created new activity stat with emotion for user: {}, activity: {}, emotion: {}", 
                    user.getId(), activityName, emotion);
        } else {
            // Update existing stat
            stat.setMentionCount(stat.getMentionCount() + 1);
            stat.setLastMentioned(today);
            
            // Increment emotion count
            incrementEmotionCount(stat, emotion);
            
            userActivityStatRepository.save(stat);
            log.debug("Updated activity stat with emotion for user: {}, activity: {}, emotion: {}, count: {}", 
                    user.getId(), activityName, emotion, stat.getMentionCount());
        }
    }

    /**
     * Increments the appropriate emotion count based on the emotion type.
     *
     * @param stat the activity stat to update
     * @param emotion the emotion to increment
     */
    private void incrementEmotionCount(UserActivityStat stat, Emotion emotion) {
        if (emotion == null) {
            return;
        }

        switch (emotion) {
            case HAPPY:
                stat.setEmotionHappy(stat.getEmotionHappy() + 1);
                break;
            case SAD:
                stat.setEmotionSad(stat.getEmotionSad() + 1);
                break;
            case STRESS:
                stat.setEmotionStress(stat.getEmotionStress() + 1);
                break;
            case ANXIETY:
                stat.setEmotionAnxiety(stat.getEmotionAnxiety() + 1);
                break;
            case ANGRY:
                stat.setEmotionAngry(stat.getEmotionAngry() + 1);
                break;
            case EXCITED:
                stat.setEmotionExcited(stat.getEmotionExcited() + 1);
                break;
            case NEUTRAL:
                stat.setEmotionNeutral(stat.getEmotionNeutral() + 1);
                break;
            default:
                log.debug("Unknown emotion type: {}", emotion);
        }
    }

    /**
     * Normalizes activity name to lowercase and trims whitespace.
     *
     * @param activity the raw activity name
     * @return normalized activity name
     */
    private String normalizeActivityName(String activity) {
        if (activity == null) {
            return null;
        }
        return activity.toLowerCase().trim();
    }

    /**
     * Gets all activity statistics for a user.
     *
     * @param user the user
     * @return list of activity statistics
     */
    public List<UserActivityStat> getUserActivityStats(User user) {
        return userActivityStatRepository.findByUser(user);
    }
}
