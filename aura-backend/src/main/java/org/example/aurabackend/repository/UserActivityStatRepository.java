package org.example.aurabackend.repository;

import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserActivityStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link UserActivityStat} persistence operations.
 *
 * Access patterns required by the approved architecture:
 *
 * 1. Milestone 2 — UserActivityStatsService (write side)
 *    → findByUserAndActivityName — upsert lookup before incrementing counts
 *    → existsByUserAndActivityName — check before creating a new row
 *    → save() — inherited
 *
 * 2. Milestone 2 — UserPreferenceProfileService (read side)
 *    → findByUser — load all activity stats for a user during profile recomputation
 *
 * 3. Milestone 2 — PersonalisedQuestScorer (read side)
 *    → findByUser — load activity stats at scoring time
 *
 * Repository Rule: No business logic. Persistence and querying only.
 * Activity normalisation and trigger detection belong in UserActivityStatsService.
 */
@Repository
public interface UserActivityStatRepository extends JpaRepository<UserActivityStat, Long> {

    /**
     * Loads all activity stats for a user.
     * Used by UserPreferenceProfileService during profile recomputation
     * and by PersonalisedQuestScorer at recommendation time.
     */
    List<UserActivityStat> findByUser(User user);

    /**
     * Looks up a single activity stat row for the (user, activityName) pair.
     * Used by UserActivityStatsService for the upsert pattern:
     *   find → update if present → save new if absent.
     */
    Optional<UserActivityStat> findByUserAndActivityName(User user, String activityName);

    /**
     * Checks whether a stat row exists for a (user, activityName) pair.
     * Lightweight existence check before deciding whether to insert or update.
     */
    boolean existsByUserAndActivityName(User user, String activityName);

    /**
     * Loads all activity stats for a user by user ID.
     * Used by PersonalizedQuestScorer for activity relevance scoring.
     */
    List<UserActivityStat> findByUserId(Long userId);
}
