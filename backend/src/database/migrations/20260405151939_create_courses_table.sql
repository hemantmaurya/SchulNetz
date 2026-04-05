-- 20260405151939_create_courses_table.sql
-- Migration for table: courses
-- Created: Sun Apr  5 15:19:39 IST 2026

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    
    name varchar(40) NOT NULL UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Recommended indexes
CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
CREATE INDEX IF NOT EXISTS idx_courses_deleted_at ON courses(deleted_at);

COMMENT ON TABLE courses IS 'Table for courses management';
