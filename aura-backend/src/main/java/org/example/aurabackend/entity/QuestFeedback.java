package org.example.aurabackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.aurabackend.enumeration.Emotion;

import java.time.LocalDateTime;

/**
 * Persistence model for quest assignment and outcome tracking.
 *
 * Records each quest assignment event with the state at the time of assignment
 * so that PersonalisedQuestScorer (Milestone 2) can learn which quests
 * produced positive outcomes for which users and emotions.
 *
 * The userSideQuest FK is nullable: if a UserSideQuest row is deleted (e.g.,
 * admin cleanup), this feedback record is preserved with userSideQuest = null,
 * maintaining the historical log for the scorer.
 *
 * scoreAtAssign is null for quests assigned before PersonalisedQuestScorer
 * was introduced (Milestone 0 era), allowing backward compatibility.
 *
 * Entity Design Rule:
 *   This class is a persistence model only. It must not contain scoring,
 *   completion rate calculations, or feedback aggregation. Those belong
 *   in services introduced in Milestone 2.
 */
@Entity
@Table(name = "quest_feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the UserSideQuest assignment record.
     * Nullable: preserved with null if the UserSideQuest is later deleted
     * (ON DELETE SET NULL at the database level).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_side_quest_id")
    private UserSideQuest userSideQuest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "side_quest_id", nullable = false)
    private SideQuest sideQuest;

    /** Primary emotion of the journal entry at the time this quest was assigned. */
    @Enumerated(EnumType.STRING)
    @Column(name = "assigned_emotion", length = 50)
    private Emotion assignedEmotion;

    /**
     * Score computed by PersonalisedQuestScorer at assignment time.
     * Null for quests assigned before scoring was introduced.
     */
    @Column(name = "score_at_assign")
    private Double scoreAtAssign;

    /** True when the user completed this quest. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean completed = false;

    /**
     * True when the user dismissed this quest without completing it.
     * Reserved for future UI interaction (Milestone 3+).
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean dismissed = false;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    public void prePersist() {
        if (assignedAt == null) {
            assignedAt = LocalDateTime.now();
        }
    }
}
