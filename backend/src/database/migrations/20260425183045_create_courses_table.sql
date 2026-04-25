-- 20260425183045_create_courses_table.sql
-- Migration for table: courses

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR NOT NULL UNIQUE,
    course_code VARCHAR NOT NULL UNIQUE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    duration VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_courses_deleted_at ON courses(deleted_at);

