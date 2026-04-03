-- 20260403182521_create_testing_table.sql
-- Description: create_testing_table
-- Table: testing
-- Created: Fri Apr  3 18:25:21 IST 2026

CREATE TABLE IF NOT EXISTS testing (
    id SERIAL PRIMARY KEY,
    
    -- Add your columns here
    name VARCHAR(100) UNIQUE NOT NULL,           -- Name is now UNIQUE
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    
    -- Standard timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL                    -- Soft Delete support
);

-- Recommended indexes
-- CREATE INDEX IF NOT EXISTS idx_testing_name ON testing(name);
-- CREATE INDEX IF NOT EXISTS idx_testing_deleted_at ON testing(deleted_at);

COMMENT ON TABLE testing IS 'Table for testing management';

