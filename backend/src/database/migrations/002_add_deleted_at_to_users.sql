-- 002_add_deleted_at_to_users.sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

COMMENT ON COLUMN users.deleted_at IS 'NULL = active user, timestamp = soft deleted user';
