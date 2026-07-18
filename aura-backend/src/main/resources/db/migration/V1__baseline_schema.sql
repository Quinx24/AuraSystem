-- =============================================================================
-- V1__baseline_schema.sql
-- Aura System — Baseline schema (existing tables as of Milestone 0)
--
-- PURPOSE
-- This script documents the complete schema that already exists on the
-- production database. It serves two roles:
--
--   1. Fresh database (CI, new developer, new Railway deployment):
--      Flyway applies this script to create all tables from scratch.
--
--   2. Existing database (current production):
--      Flyway's baseline-on-migrate=true marks this version as already
--      applied and skips execution. The schema is untouched.
--
-- IMPORTANT
--   Do NOT modify this file after it has been applied to any database.
--   All future schema changes must be made in V2, V3, … scripts.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL       PRIMARY KEY,
    full_name   VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    avatar_url  VARCHAR(500),
    level       INTEGER         NOT NULL DEFAULT 1,
    xp          INTEGER         NOT NULL DEFAULT 0,
    role        VARCHAR(50)     NOT NULL DEFAULT 'USER',
    locked      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP       NOT NULL,
    updated_at  TIMESTAMP       NOT NULL
);


-- -----------------------------------------------------------------------------
-- streaks
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS streaks (
    id              BIGSERIAL   PRIMARY KEY,
    user_id         BIGINT      NOT NULL UNIQUE REFERENCES users(id),
    current_streak  INTEGER     NOT NULL DEFAULT 0,
    longest_streak  INTEGER     NOT NULL DEFAULT 0,
    total_check_in  INTEGER     NOT NULL DEFAULT 0,
    last_check_in   DATE,
    created_at      TIMESTAMP   NOT NULL,
    updated_at      TIMESTAMP   NOT NULL
);


-- -----------------------------------------------------------------------------
-- refresh_tokens
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGSERIAL       PRIMARY KEY,
    token       VARCHAR(500)    NOT NULL UNIQUE,
    expiry_date TIMESTAMP       NOT NULL,
    revoked     BOOLEAN         NOT NULL DEFAULT FALSE,
    user_id     BIGINT          NOT NULL REFERENCES users(id)
);


-- -----------------------------------------------------------------------------
-- tags
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL UNIQUE,
    used_count  INTEGER         NOT NULL DEFAULT 0
);


-- -----------------------------------------------------------------------------
-- journal_entries
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_entries (
    id                BIGSERIAL   PRIMARY KEY,
    journal_content   TEXT        NOT NULL,
    note_to_self      VARCHAR(300),
    memory_photo_url  VARCHAR(500),
    primary_emotion   VARCHAR(50),
    confidence        DOUBLE PRECISION,
    created_at        TIMESTAMP,
    updated_at        TIMESTAMP,
    user_id           BIGINT      REFERENCES users(id)
);


-- -----------------------------------------------------------------------------
-- journal_tags  (many-to-many join table)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_tags (
    journal_id  BIGINT  NOT NULL REFERENCES journal_entries(id),
    tag_id      BIGINT  NOT NULL REFERENCES tags(id),
    PRIMARY KEY (journal_id, tag_id)
);


-- -----------------------------------------------------------------------------
-- journal_emotion
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_emotion (
    id              BIGSERIAL   PRIMARY KEY,
    emotion         VARCHAR(50) NOT NULL,
    score           DOUBLE PRECISION NOT NULL,
    journal_id      BIGINT      NOT NULL REFERENCES journal_entries(id)
);


-- -----------------------------------------------------------------------------
-- side_quests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS side_quests (
    id          BIGSERIAL       PRIMARY KEY,
    title       VARCHAR(255)    NOT NULL,
    description VARCHAR(1000),
    xp_reward   INTEGER         NOT NULL,
    emotion     VARCHAR(50)     NOT NULL,
    category    VARCHAR(50)     NOT NULL,
    difficulty  VARCHAR(50)     DEFAULT 'EASY',
    published   BOOLEAN         DEFAULT TRUE
);


-- -----------------------------------------------------------------------------
-- user_side_quests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_side_quests (
    id               BIGSERIAL   PRIMARY KEY,
    user_id          BIGINT      REFERENCES users(id),
    side_quest_id    BIGINT      REFERENCES side_quests(id),
    journal_entry_id BIGINT      REFERENCES journal_entries(id),
    completed        BOOLEAN,
    assigned_date    DATE,
    completed_date   DATE
);


-- -----------------------------------------------------------------------------
-- inspiration_prompts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspiration_prompts (
    id            BIGSERIAL       PRIMARY KEY,
    title         VARCHAR(255)    NOT NULL,
    description   VARCHAR(1000),
    emotion       VARCHAR(50)     NOT NULL,
    category      VARCHAR(50)     NOT NULL,
    type          VARCHAR(50)     NOT NULL,
    language      VARCHAR(10)     NOT NULL,
    difficulty    VARCHAR(50)     NOT NULL,
    weight        INTEGER         NOT NULL DEFAULT 1,
    active        BOOLEAN         NOT NULL DEFAULT TRUE,
    display_order INTEGER         NOT NULL DEFAULT 0,
    created_at    TIMESTAMP       NOT NULL,
    updated_at    TIMESTAMP       NOT NULL
);


-- -----------------------------------------------------------------------------
-- Indexes for query performance
-- (These mirror the access patterns used by JournalEntryRepository,
--  UserSideQuestRepository, and SideQuestRepository)
-- -----------------------------------------------------------------------------

-- journal_entries: the most common query is findByUser → filter by user_id
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id
    ON journal_entries(user_id);

-- journal_entries: admin date-range filters
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at
    ON journal_entries(created_at);

-- user_side_quests: findByUserAndAssignedDateAndCompleted
CREATE INDEX IF NOT EXISTS idx_user_side_quests_user_date_completed
    ON user_side_quests(user_id, assigned_date, completed);

-- side_quests: findByEmotionAndPublishedTrue (the new SQL-filtered query)
CREATE INDEX IF NOT EXISTS idx_side_quests_emotion_published
    ON side_quests(emotion) WHERE published = TRUE;

-- refresh_tokens: findByToken
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token
    ON refresh_tokens(token);
