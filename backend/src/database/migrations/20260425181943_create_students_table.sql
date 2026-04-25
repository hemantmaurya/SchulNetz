-- 20260425181943_create_students_table.sql
-- Migration for table: students

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admission_no INTEGER NOT NULL UNIQUE,
    dob DATETIME NOT NULL,
    gender VARCHAR NOT NULL,
    blood_group VARCHAR,
    address TEXT NOT NULL,
    city INTEGER NOT NULL,
    state INTEGER NOT NULL,
    pincode INTEGER NOT NULL,
    guardian_name VARCHAR NOT NULL,
    guardian_phone INTEGER NOT NULL,
    admission_date DATETIME NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_students_deleted_at ON students(deleted_at);

