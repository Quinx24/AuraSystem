package org.example.aurabackend.repository;

import java.util.List;

import org.example.aurabackend.entity.SideQuest;
import org.example.aurabackend.enumeration.Emotion;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SideQuestRepository extends JpaRepository<SideQuest, Long>, JpaSpecificationExecutor<SideQuest> {

    /**
     * Returns all quests for the given emotion regardless of published status.
     * Used by admin queries and statistics only.
     */
    List<SideQuest> findByEmotion(Emotion emotion);

    /**
     * Returns only published quests for the given emotion.
     *
     * Applies the published = true filter in SQL (WHERE emotion = ? AND published = true),
     * avoiding an in-memory stream filter on the full candidate list.
     * This is the method that must be used everywhere a user-facing quest list is needed.
     */
    List<SideQuest> findByEmotionAndPublishedTrue(Emotion emotion);

    /**
     * Returns all published quests regardless of emotion.
     * Used by CandidateGenerator when emotion context is not available.
     */
    List<SideQuest> findByPublishedTrue();
}
