# Database Migration for Journal History Feature

## Date: 2026-07-17

## Purpose
Add support for memory photos and journal-aware side quest assignment to enable accurate Journal History snapshots.

## Changes

### 1. journal_entries table
**Add column:**
```sql
ALTER TABLE journal_entries ADD COLUMN memory_photo_url VARCHAR(500);
```

### 2. user_side_quests table
**Add column:**
```sql
ALTER TABLE user_side_quests ADD COLUMN journal_entry_id BIGINT;
ALTER TABLE user_side_quests 
    ADD CONSTRAINT fk_user_side_quest_journal_entry 
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id);
```

**Optional unique constraint (to prevent duplicate quest assignments to same journal):**
```sql
ALTER TABLE user_side_quests 
    ADD UNIQUE INDEX uk_user_side_quest_journal 
    (user_id, side_quest_id, journal_entry_id);
```

## Application

Since `spring.jpa.hibernate.ddl-auto=update` is configured in `application.properties`, 
Hibernate will automatically apply these schema changes when the application restarts.

## Backward Compatibility

- `memory_photo_url` is nullable (existing journals will have NULL)
- `journal_entry_id` is nullable (existing UserSideQuest records will have NULL)
- All existing data and relationships remain intact
- Existing APIs continue to work without modification

## Rollback

If rollback is needed:
```sql
ALTER TABLE user_side_quests DROP CONSTRAINT fk_user_side_quest_journal_entry;
ALTER TABLE user_side_quests DROP COLUMN journal_entry_id;
ALTER TABLE journal_entries DROP COLUMN memory_photo_url;
```
