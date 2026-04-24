-- 20260424153846_create_new_testing_migration_table.sql
-- Migration for table: new_testing_migration

CREATE TABLE IF NOT EXISTS new_testing_migration (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(50) NOT NULL UNIQUE,
    created_by VARCHAR NOT NULL DEFAULT 'n',
    user INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_new_testing_migration_deleted_at ON new_testing_migration(deleted_at);

