#!/bin/bash

echo "🚀 Smart Laravel-style Seeder Generator"
echo "======================================"

read -p "Enter Seeder Name (e.g. CoursesSeeder): " SEEDER_NAME

if [ -z "$SEEDER_NAME" ]; then
  echo "❌ Seeder name is required!"
  exit 1
fi

TABLE_NAME=$(echo "$SEEDER_NAME" | sed 's/Seeder$//' | tr '[:upper:]' '[:lower:]')

echo "🔍 Searching for migration for table '$TABLE_NAME'..."

MIGRATION_FILE=$(ls backend/src/database/migrations/*create_${TABLE_NAME}_table.sql 2>/dev/null | sort | tail -1)

if [ -z "$MIGRATION_FILE" ]; then
  echo "❌ No migration found for table '$TABLE_NAME'!"
  read -p "Do you want to create migration first? (y/N): " create_mig
  create_mig=$(echo "$create_mig" | tr '[:upper:]' '[:lower:]')
  
  if [[ "$create_mig" == "y" ]]; then
    ./scripts/make-migration.sh
    MIGRATION_FILE=$(ls backend/src/database/migrations/*create_${TABLE_NAME}_table.sql 2>/dev/null | sort | tail -1)
  else
    echo "Seeder creation cancelled."
    exit 1
  fi
fi

echo "✅ Found migration: $MIGRATION_FILE"

# Extract column names (excluding id, created_at, updated_at, deleted_at)
COLUMNS=$(grep -o '^[[:space:]]*[a-z_][a-z0-9_]*[[:space:]]' "$MIGRATION_FILE" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | grep -v "^id$" | grep -v "^created_at$" | grep -v "^updated_at$" | grep -v "^deleted_at$")

if [ -z "$COLUMNS" ]; then
  echo "Could not extract columns. Using default columns."
  COLUMNS="name middle_name last_name email phone age is_active notes"
fi

echo ""
echo "Found columns: $COLUMNS"
echo "Now enter sample data. You can add multiple rows."
echo ""

ROWS=()

while true; do
  echo "Entering data for a new row:"
  ROW_VALUES=()
  for col in $COLUMNS; do
    read -p "  Value for '$col': " value
    ROW_VALUES+=("$value")
  done

  ROWS+=("($(printf "'%s'," "${ROW_VALUES[@]}" | sed 's/,$//'))")

  read -p "Add another row? (y/N): " add_more
  add_more=$(echo "$add_more" | tr '[:upper:]' '[:lower:]')
  if [[ "$add_more" != "y" ]]; then
    break
  fi
done

TIMESTAMP=$(date +"%Y%m%d%H%M%S")
FILENAME="${TIMESTAMP}_${SEEDER_NAME}.sql"

docker compose exec backend sh -c "
cat > /app/src/database/seeders/$FILENAME << 'SEEDER'
-- $FILENAME
-- Seeder: $SEEDER_NAME for table $TABLE_NAME

INSERT INTO $TABLE_NAME ($(echo $COLUMNS | tr ' ' ','))
VALUES 
    $(printf "%s,\n" "${ROWS[@]}" | sed '$ s/,$//')
ON CONFLICT DO NOTHING;

SEEDER
"

echo "✅ Seeder created successfully!"
echo "📁 File: backend/src/database/seeders/$FILENAME"
echo ""
echo "Next step: Run 'docker compose restart backend' to apply the seeder"
