-- Enable commonly-required extensions for migrations
-- File: backend/migrations/0000_enable_extensions.sql
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

COMMIT;
