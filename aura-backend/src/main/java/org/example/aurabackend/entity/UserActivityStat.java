package org.example.aurabackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Persistence model for aggregated activity mention statistics per user.
 *
 * One row per (user_id, activity_name) pair — enforced by the uq_user_activity
 * unique constraint at the database level.
 *
 * The seven emotion count columns record how many times this activity appeared
 * in a journal that was classified with each primary emotion. This data is
 * consumed by PersonalisedQuestScorer (Milestone 2) to identify positive and
 * negative triggers without requiring a full journal scan at recommendation time.
 *
 * Entity Design Rule:
 *   This class is a persistence model only. Activity normalisation, trigger
 *   detection, and profile recomputation belong in UserActivityStatsService
 *   (Milestone 2). Do not add those methods here.
 */
@Entity
@Table(
    name = "user_activity_stats",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_activity", columnNames = {"user_id", "activity_name"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActivityStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Normalised lowercase activity name, e.g. "đi bộ", "đọc sách". */
    @Column(name = "activity_name", nullable = false, length = 200)
    private String activityName;

    /** Total number of times this activity has been mentioned across all journals. */
    @Column(name = "mention_count", nullable = false)
    @Builder.Default
    private Integer mentionCount = 1;

    /** Date of the most recent journal mentioning this activity. */
    @Column(name = "last_mentioned", nullable = false)
    private LocalDate lastMentioned;

    // ─── Per-emotion mention counts ───────────────────────────────────────────
    // Each column counts how many times this activity appeared alongside
    // a journal classified with that primary emotion.

    @Column(name = "emotion_happy", nullable = false)
    @Builder.Default
    private Integer emotionHappy = 0;

    @Column(name = "emotion_sad", nullable = false)
    @Builder.Default
    private Integer emotionSad = 0;

    @Column(name = "emotion_stress", nullable = false)
    @Builder.Default
    private Integer emotionStress = 0;

    @Column(name = "emotion_anxiety", nullable = false)
    @Builder.Default
    private Integer emotionAnxiety = 0;

    @Column(name = "emotion_angry", nullable = false)
    @Builder.Default
    private Integer emotionAngry = 0;

    @Column(name = "emotion_excited", nullable = false)
    @Builder.Default
    private Integer emotionExcited = 0;

    @Column(name = "emotion_neutral", nullable = false)
    @Builder.Default
    private Integer emotionNeutral = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
