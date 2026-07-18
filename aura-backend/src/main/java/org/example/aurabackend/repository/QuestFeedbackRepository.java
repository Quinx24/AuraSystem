package org.example.aurabackend.repository;

import org.example.aurabackend.entity.QuestFeedback;
import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.entity.User;
import org.example.aurabackend.entity.UserSideQuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link QuestFeedback} persistence operations.
 *
 * Access patterns required by the approved architecture:
 *
 * 1. Milestone 2 — PersonalisedQuestScorer (read side)
 *    → findByUser — load completion history for scoring (completion penalty signal)
 *
 * 2. Milestone 2 — QuestAssignmentService (write side)
 *    → save() — inherited, records each assignment event
 *
 * 3. Admin statistics (future)
 *    → findBySideQuest — popularity and effectiveness analysis per quest
 *
 * 4. Completion sync (Milestone 2)
 *    → findByUserSideQuest — update the feedback row when a quest is completed
 *
 * Repository Rule: No business logic. Persistence and querying only.
 * Completion rate calculations and feedback aggregation belong in services.
 */
@Repository
public interface QuestFeedbackRepository extends JpaRepository<QuestFeedback, Long> {

    /**
     * Loads all feedback records for a user.
     * Used by PersonalisedQuestScorer to build the completion history
     * signal for the recommendation ranking.
     */
    List<QuestFeedback> findByUser(User user);

    /**
     * Looks up the feedback record for a specific UserSideQuest assignment.
     * Used when syncing completion state (Milestone 2).
     * Returns Optional.empty() for pre-Milestone-1 assignments that
     * predate the feedback table.
     */
    Optional<QuestFeedback> findByUserSideQuest(UserSideQuest userSideQuest);

    /**
     * Loads all feedback records for a specific side quest template.
     * Used for quest popularity and effectiveness analysis.
     */
    List<QuestFeedback> findBySideQuest(SideQuest sideQuest);
}
