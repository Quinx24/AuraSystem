package org.example.aurabackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Persistence model for the evolved user preference profile.
 *
 * One row per user — enforced by the UNIQUE constraint on user_id at the
 * database level.
 *
 * This snapshot is recomputed by UserPreferenceProfileService (Milestone 2)
 * after each batch of extraction updates. The entity stores the most recent
 * computed state only — history is not tracked here.
 *
 * categoryWeights is stored as a JSONB map, e.g.:
 *   {"EXERCISE": 0.8, "MINDFULNESS": 0.3, "CREATIVITY": 0.5}
 * It is consumed directly by PersonalisedQuestScorer (Milestone 2).
 *
 * Entity Design Rule:
 *   This class is a persistence model only. Profile recomputation algorithms
 *   belong in UserPreferenceProfileService (Milestone 2). Do not add scoring,
 *   weight calculation, or trigger classification logic here.
 */
@Entity
@Table(name = "user_preference_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreferenceProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user this profile belongs to.
     * UNIQUE at DB level — one profile per user.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // ─── Preference fields ────────────────────────────────────────────────────

    /**
     * Ranked SideQuestCategory values ordered by preference strength.
     * e.g. ["EXERCISE", "CREATIVITY", "MINDFULNESS"]
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_categories", columnDefinition = "jsonb")
    private List<String> preferredCategories;

    /**
     * Most frequently mentioned activities across all journals.
     * e.g. ["đi bộ", "đọc sách"]
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "top_activities", columnDefinition = "jsonb")
    private List<String> topActivities;

    /**
     * Activities that co-occur with positive emotions — used to boost
     * aligned quest categories in PersonalisedQuestScorer.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "known_positive_triggers", columnDefinition = "jsonb")
    private List<String> knownPositiveTriggers;

    /**
     * Activities that co-occur with negative emotions — used to surface
     * coping-oriented quest categories.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "known_negative_triggers", columnDefinition = "jsonb")
    private List<String> knownNegativeTriggers;

    /**
     * Normalised weight per SideQuestCategory string key.
     * Values are in [0.0, 1.0]. Consumed by PersonalisedQuestScorer.
     * e.g. {"EXERCISE": 0.8, "MINDFULNESS": 0.3}
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "category_weights", columnDefinition = "jsonb")
    private Map<String, Double> categoryWeights;

    /**
     * Most frequently mentioned places across all journals.
     * e.g. ["công viên", "nhà sách", "quán cafe"]
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_places", columnDefinition = "jsonb")
    private List<String> preferredPlaces;

    /**
     * Most frequently mentioned people across all journals.
     * e.g. ["gia đình", "bạn thân", "đồng nghiệp"]
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_people", columnDefinition = "jsonb")
    private List<String> preferredPeople;

    /**
     * Confidence score for this profile.
     * Values in [0.0, 1.0]. Higher values indicate more reliable preferences.
     * Computed by UserPreferenceCalculator based on:
     * - Journal count
     * - Activity diversity
     * - Emotional consistency
     * - Extraction completeness
     */
    @Column(name = "confidence_score")
    private Double confidenceScore;

    // ─── Audit fields ─────────────────────────────────────────────────────────

    /** Timestamp of the most recent recomputation. */
    @Column(name = "last_recomputed_at", nullable = false)
    private LocalDateTime lastRecomputedAt;

    /**
     * Number of journal entries that contributed to this profile snapshot.
     * Used to decide when the next recomputation should occur.
     */
    @Column(name = "journal_count_at_recompute")
    private Integer journalCountAtRecompute;

    @PrePersist
    public void prePersist() {
        if (lastRecomputedAt == null) {
            lastRecomputedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        lastRecomputedAt = LocalDateTime.now();
    }
}
