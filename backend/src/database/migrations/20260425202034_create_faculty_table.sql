-- 20260425202034_create_faculty_table.sql
-- Migration for table: faculty

CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES (id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation VARCHAR NOT NULL,
    qualification VARCHAR NOT NULL,
    joining_date DATETIME NOT NULL,
    salary INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_faculty_deleted_at ON faculty(deleted_at);

