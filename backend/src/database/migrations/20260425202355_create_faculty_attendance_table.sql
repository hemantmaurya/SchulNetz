-- 20260425202355_create_faculty_attendance_table.sql
-- Migration for table: faculty_attendance

CREATE TABLE IF NOT EXISTS faculty_attendance (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR NOT NULL REFERENCES faculty(employee_id) ON DELETE CASCADE,
    date DATETIME NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_faculty_attendance_deleted_at ON faculty_attendance(deleted_at);

