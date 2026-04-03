#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./scripts/make-seeder.sh SeederName"
  echo "Example: ./scripts/make-seeder.sh TestingSeeder"
  exit 1
fi

SEEDER_NAME="$1"
TABLE_NAME=$(echo "$SEEDER_NAME" | sed 's/Seeder$//' | tr '[:upper:]' '[:lower:]')

TIMESTAMP=$(date +"%Y%m%d%H%M%S")
FILENAME="${TIMESTAMP}_${SEEDER_NAME}.sql"

docker compose exec backend sh -c "
cat > /app/src/database/seeders/$FILENAME << 'TEMPLATE'
-- $FILENAME
-- Seeder: $SEEDER_NAME
-- Table : $TABLE_NAME
-- Created: $(date)

-- =============================================
-- TODO: Add your INSERT statements here
-- =============================================

-- Example (you can delete or modify this):
-- INSERT INTO $TABLE_NAME (name, middle_name, last_name, email, phone, age, is_active, notes)
-- VALUES 
--     (''Rahul'', ''Kumar'', ''Sharma'', ''rahul@example.com'', ''9876543210'', 28, true, ''Software Engineer''),
--     (''Priya'', ''Singh'', ''Rathore'', ''priya@example.com'', ''8765432109'', 24, true, ''Student'')
-- ON CONFLICT DO NOTHING;

TEMPLATE
"

echo "✅ Clean seeder template created!"
echo "📁 File: backend/src/database/seeders/$FILENAME"
echo ""
echo "Next steps:"
echo "1. Open the file in your editor and add your data"
echo "2. Save it"
echo "3. Run: docker compose restart backend"
