-- 20260402173814_create_drivers_table.sql
-- Description: create_drivers_table
-- Created: Thu Apr  2 17:38:14 IST 2026

-- =============================================
-- Laravel-style Migration Template
-- =============================================

-- Drop table if exists (optional - useful during development)
-- DROP TABLE IF EXISTS your_table_name;

CREATE TABLE IF NOT EXISTS your_table_name (
    id SERIAL PRIMARY KEY,
    
    -- Add your columns here
    -- name VARCHAR(100) NOT NULL,
    -- email VARCHAR(255) UNIQUE NOT NULL,
    -- status VARCHAR(20) DEFAULT 'active',
    
    -- Standard Laravel-style timestamp columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL                     -- Soft Delete support
);

-- Add indexes for better performance (recommended)
-- CREATE INDEX IF NOT EXISTS idx_your_table_name_status ON your_table_name(status);
-- CREATE INDEX IF NOT EXISTS idx_your_table_name_deleted_at ON your_table_name(deleted_at);

-- Add comments (very useful for documentation)
-- COMMENT ON TABLE your_table_name IS 'Description of this table';
-- COMMENT ON COLUMN your_table_name.deleted_at IS 'NULL = active record, timestamp = soft deleted';

-- =============================================
-- TODO: Replace 'your_table_name' with actual table name
-- TODO: Add your specific columns
-- TODO: Add appropriate indexes and constraints
-- =============================================

