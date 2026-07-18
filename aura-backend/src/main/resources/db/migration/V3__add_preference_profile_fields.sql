-- =============================================================================
-- V3__add_preference_profile_fields.sql
-- Aura System — Preference Engine (Milestone 3)
--
-- Adds new fields to user_preference_profiles table for enhanced preference
-- tracking and confidence scoring.
--
-- IMPORTANT
--   This migration is additive — no existing data is modified.
--   All new fields are nullable to support existing profiles.
-- =============================================================================

-- Add preferred_places field
ALTER TABLE user_preference_profiles 
ADD COLUMN IF NOT EXISTS preferred_places JSONB;

-- Add preferred_people field
ALTER TABLE user_preference_profiles 
ADD COLUMN IF NOT EXISTS preferred_people JSONB;

-- Add confidence_score field
ALTER TABLE user_preference_profiles 
ADD COLUMN IF NOT EXISTS confidence_score DOUBLE PRECISION;
