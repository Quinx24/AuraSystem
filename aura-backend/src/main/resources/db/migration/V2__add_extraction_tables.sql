-- =============================================================================
-- V2__add_extraction_tables.sql
-- Aura System — AI Personalization layer (Milestone 1)
--
-- Introduces 4 new tables required for the LLM-based extraction pipeline and
-- personalised recommendation engine.
--
-- IMPORTANT
--   These tables are additive — no existing tables are modified.
--   All foreign keys reference existing V1 tables.
--   Do NOT modify this file after it has been applied to any database.
--   Future schema changes must go into V3, V4, … scripts.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- journal_extractions
--
-- Stores the structured information extracted from a journal entry by the LLM.
-- One row per journal entry (enforced by unique constraint).
-- SECURITY: raw_llm_response contains the full LLM output and is for audit /
--   debugging only. It must never be exposed through any public API or DTO.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_extractions (
    id                  BIGSERIAL   PRIMARY KEY,
    journal_entry_id    BIGINT      NOT NULL UNIQUE REFERENCES journal_entries(id) ON DELETE CASCADE,
    user_id             BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Structured extraction results stored as JSON arrays for flexibility.
    -- Future milestones can query these fields or normalize them further.
    activities          JSONB,          -- e.g. ["đi bộ", "đọc sách"]
    places              JSONB,          -- e.g. ["công viên"]
    people              JSONB,          -- e.g. ["bạn bè"]
    positive_triggers   JSONB,          -- activities co-occurring with positive emotion shift
    negative_triggers   JSONB,          -- activities co-occurring with negative emotion shift
    future_plans        JSONB,          -- expressed intentions

    -- One-sentence contextual summary of the journal entry
    mood_context        TEXT,

    -- AUDIT ONLY — never expose through public APIs or DTOs
    raw_llm_response    JSONB,

    -- Model identification for future reproducibility analysis
    extraction_model    VARCHAR(100),

    extracted_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Lookup by user for GET /users/me/extractions (paginated)
CREATE INDEX IF NOT EXISTS idx_journal_extractions_user_id
    ON journal_extractions(user_id);

-- Lookup by journal for GET /journal-entries/{id}/extraction
CREATE INDEX IF NOT EXISTS idx_journal_extractions_journal_entry_id
    ON journal_extractions(journal_entry_id);

-- Most recent extractions first
CREATE INDEX IF NOT EXISTS idx_journal_extractions_extracted_at
    ON journal_extractions(extracted_at DESC);


-- -----------------------------------------------------------------------------
-- user_activity_stats
--
-- Aggregated activity mention statistics per user.
-- Updated by UserActivityStatsService each time an extraction is processed.
-- One row per (user_id, activity_name) pair — enforced by unique constraint.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_activity_stats (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_name   VARCHAR(200)    NOT NULL,   -- normalised lowercase activity name

    -- Total number of times this activity has been mentioned across all journals
    mention_count   INTEGER         NOT NULL DEFAULT 1,

    -- Date of the most recent mention — used to detect recently active patterns
    last_mentioned  DATE            NOT NULL,

    -- Per-emotion mention counts — how often this activity appeared with each emotion.
    -- Used by PersonalisedQuestScorer to identify positive / negative triggers.
    emotion_happy   INTEGER         NOT NULL DEFAULT 0,
    emotion_sad     INTEGER         NOT NULL DEFAULT 0,
    emotion_stress  INTEGER         NOT NULL DEFAULT 0,
    emotion_anxiety INTEGER         NOT NULL DEFAULT 0,
    emotion_angry   INTEGER         NOT NULL DEFAULT 0,
    emotion_excited INTEGER         NOT NULL DEFAULT 0,
    emotion_neutral INTEGER         NOT NULL DEFAULT 0,

    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_activity UNIQUE (user_id, activity_name)
);

-- Lookup all activities for a user (profile recomputation, scoring)
CREATE INDEX IF NOT EXISTS idx_user_activity_stats_user_id
    ON user_activity_stats(user_id);

-- Find a specific activity for a user (upsert during extraction processing)
CREATE INDEX IF NOT EXISTS idx_user_activity_stats_user_activity
    ON user_activity_stats(user_id, activity_name);


-- -----------------------------------------------------------------------------
-- user_preference_profiles
--
-- Evolved user preference snapshot, recomputed by UserPreferenceProfileService
-- after each batch of extraction updates.
-- One row per user — enforced by unique constraint.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preference_profiles (
    id                          BIGSERIAL   PRIMARY KEY,
    user_id                     BIGINT      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Ranked SideQuestCategory values (JSON array, ordered by preference strength)
    preferred_categories        JSONB,      -- e.g. ["EXERCISE", "CREATIVITY"]

    -- Most frequently mentioned activities across all journals
    top_activities              JSONB,      -- e.g. ["đi bộ", "đọc sách"]

    -- Activities with strong positive emotion correlation
    known_positive_triggers     JSONB,      -- e.g. ["đi bộ"]

    -- Activities with strong negative emotion correlation
    known_negative_triggers     JSONB,      -- e.g. ["họp nhóm"]

    -- Normalised weights per SideQuestCategory — consumed by PersonalisedQuestScorer
    -- e.g. {"EXERCISE": 0.8, "MINDFULNESS": 0.3}
    category_weights            JSONB,

    -- Audit fields — when and from how many journals this profile was computed
    last_recomputed_at          TIMESTAMP   NOT NULL DEFAULT NOW(),
    journal_count_at_recompute  INTEGER
);

-- Direct lookup by user_id (the only access pattern for this table)
CREATE INDEX IF NOT EXISTS idx_user_preference_profiles_user_id
    ON user_preference_profiles(user_id);


-- -----------------------------------------------------------------------------
-- quest_feedback
--
-- Records each quest assignment event for future scoring analysis.
-- Captures the state at assignment time so the scorer can learn from outcomes.
-- The link to user_side_quests is nullable: if the assignment row is later
-- deleted, the feedback log is preserved (SET NULL).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quest_feedback (
    id                  BIGSERIAL   PRIMARY KEY,
    user_id             BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Nullable: preserved even if the UserSideQuest is deleted
    user_side_quest_id  BIGINT      REFERENCES user_side_quests(id) ON DELETE SET NULL,

    side_quest_id       BIGINT      NOT NULL REFERENCES side_quests(id) ON DELETE CASCADE,

    -- Emotion detected at the time the quest was assigned
    assigned_emotion    VARCHAR(50),

    -- Score calculated by PersonalisedQuestScorer at assignment time
    -- NULL for quests assigned before scoring was introduced (Milestone 0 era)
    score_at_assign     DOUBLE PRECISION,

    completed           BOOLEAN     NOT NULL DEFAULT FALSE,
    dismissed           BOOLEAN     NOT NULL DEFAULT FALSE,   -- reserved for future UI interaction
    assigned_at         TIMESTAMP   NOT NULL DEFAULT NOW(),
    completed_at        TIMESTAMP
);

-- Lookup all feedback for a user (completion rate analysis)
CREATE INDEX IF NOT EXISTS idx_quest_feedback_user_id
    ON quest_feedback(user_id);

-- Lookup feedback for a specific side quest (popularity / effectiveness)
CREATE INDEX IF NOT EXISTS idx_quest_feedback_side_quest_id
    ON quest_feedback(side_quest_id);

-- Lookup by user_side_quest_id (join from assignment record)
CREATE INDEX IF NOT EXISTS idx_quest_feedback_user_side_quest_id
    ON quest_feedback(user_side_quest_id);
