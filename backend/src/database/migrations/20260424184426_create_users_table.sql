-- 20260424184426_create_users_table.sql
-- Migration for table: users

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL DEFAULT 'n',
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_no_1 INTEGER(12) NOT NULL UNIQUE,
    phone_no_2 INTEGER(12) NOT NULL UNIQUE,
    password_hash VARCHAR(50) NOT NULL,
    role_id INTEGER(5) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    status INTEGER(2) NOT NULL DEFAULT 0,
    created_by VARCHAR(50) NOT NULL,
    deleted_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

