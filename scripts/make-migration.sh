#!/bin/bash

if [ -z "\$1" ]; then
  echo "Usage: ./scripts/make-migration.sh migration_name"
  echo "Example: ./scripts/make-migration.sh create_students_table"
  exit 1
fi

TIMESTAMP=\$(date +"%Y%m%d%H%M%S")
FILENAME="\${TIMESTAMP}_\$1.sql"
FILEPATH="backend/src/database/migrations/\$FILENAME"

# Create the migrations directory if it doesn't exist
mkdir -p backend/src/database/migrations

cat > "\$FILEPATH" << EOT
-- \$FILENAME
-- Description: \$1

-- Write your SQL here for this migration

EOT

echo "✅ Migration created successfully!"
echo "📁 File: \$FILEPATH"
echo ""
echo "To apply this migration, run:"
echo "   docker compose restart backend"
