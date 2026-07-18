package org.example.aurabackend.repository;

import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserPreferenceProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for {@link UserPreferenceProfile} persistence operations.
 *
 * Access patterns required by the approved architecture:
 *
 * 1. GET /users/me/profile
 *    → findByUser(User) — load the profile for the authenticated user
 *
 * 2. Milestone 2 — UserPreferenceProfileService (write side)
 *    → findByUser — load existing profile before upsert
 *    → save() — inherited, used on every recomputation
 *
 * 3. Milestone 2 — PersonalisedQuestScorer (read side)
 *    → findByUser — load category weights and preference data at scoring time
 *
 * There is exactly one row per user (UNIQUE constraint on user_id).
 * The table stores the latest snapshot only — no history.
 *
 * Repository Rule: No business logic. Persistence and querying only.
 * Profile recomputation belongs in UserPreferenceProfileService (Milestone 2).
 */
@Repository
public interface UserPreferenceProfileRepository extends JpaRepository<UserPreferenceProfile, Long> {

    /**
     * Finds the preference profile for a user.
     * Returns Optional.empty() if the user has not yet generated enough
     * journal entries for the system to build a profile (cold start).
     */
    Optional<UserPreferenceProfile> findByUser(User user);

    /**
     * Finds the preference profile for a user by user ID.
     * Used by PersonalizedQuestScorer for category weight scoring.
     */
    Optional<UserPreferenceProfile> findByUserId(Long userId);
}
