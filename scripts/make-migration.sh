#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./scripts/make-migration.sh migration_name"
  echo "Example: ./scripts/make-migration.sh create_testing_table"
  exit 1
fi

# Extract table name from migration name (e.g. create_testing_table → testing)
TABLE_NAME=$(echo "$1" | sed 's/create_//' | sed 's/_table//')

TIMESTAMP=$(date +"%Y%m%d%H%M%S")
FILENAME="${TIMESTAMP}_$1.sql"
FILEPATH="backend/src/database/migrations/$FILENAME"

mkdir -p backend/src/database/migrations

cat > "$FILEPATH" << EOT
-- $FILENAME
-- Description: $1
-- Table: $TABLE_NAME
-- Created: $(date)

CREATE TABLE IF NOT EXISTS $TABLE_NAME (
    id SERIAL PRIMARY KEY,
    
    -- Add your columns here
    -- name VARCHAR(100) NOT NULL,
    -- code VARCHAR(50) UNIQUE,
    -- description TEXT,
    
    -- Standard timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL                    -- Soft Delete support
);

-- Recommended indexes
-- CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_name ON $TABLE_NAME(name);
-- CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_deleted_at ON $TABLE_NAME(deleted_at);

COMMENT ON TABLE $TABLE_NAME IS 'Table for $TABLE_NAME management';

EOT

echo "✅ Smart migration created successfully!"
echo "📁 File: $FILEPATH"
echo "🗃️  Table name: $TABLE_NAME"
echo ""
echo "Next step: Restart backend to apply"
echo "   docker compose restart backend"
