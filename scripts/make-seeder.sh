#!/bin/bash

echo "🚀 Migration-Based Seeder Generator"
echo "==================================="

read -p "Enter Seeder Name (e.g. UsersSeeder): " SEEDER_NAME

if [ -z "$SEEDER_NAME" ]; then
  echo "❌ Seeder name is required!"
  exit 1
fi

# Convert Seeder name → table name
TABLE_NAME=$(echo "$SEEDER_NAME" | sed 's/Seeder$//' | tr '[:upper:]' '[:lower:]')

echo "🔍 Searching migration for table: $TABLE_NAME"

# Find latest migration
MIGRATION_FILE=$(ls backend/src/database/migrations/*create_${TABLE_NAME}_table.sql 2>/dev/null | sort | tail -1)

if [ -z "$MIGRATION_FILE" ]; then
  echo "❌ No migration found for table '$TABLE_NAME'"
  exit 1
fi

echo "✅ Found: $MIGRATION_FILE"

# Extract columns safely
COLUMNS=$(grep -E '^[[:space:]]+[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]' "$MIGRATION_FILE" \
  | awk '{print $1}' \
  | grep -v -E "id|created_at|updated_at|deleted_at")

if [ -z "$COLUMNS" ]; then
  echo "❌ Failed to extract columns"
  exit 1
fi

echo ""
echo "📋 Columns detected:"
for col in $COLUMNS; do
  echo "   • $col"
done

echo ""
echo "👉 Enter data for rows"
echo ""

ROWS=()

while true; do
  ROW_VALUES=()

  echo "🧾 New Row:"
  for col in $COLUMNS; do
    read -p "  $col: " value
    ROW_VALUES+=("$value")
  done

  # Build SQL row
  ROW_SQL="("
  for val in "${ROW_VALUES[@]}"; do
    ROW_SQL="$ROW_SQL'$val',"
  done
  ROW_SQL="${ROW_SQL%,})"

  ROWS+=("$ROW_SQL")

  read -p "Add another row? (y/N): " more
  more=$(echo "$more" | tr '[:upper:]' '[:lower:]')

  [[ "$more" != "y" ]] && break
done

# Generate file name
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
FILENAME="${TIMESTAMP}_${SEEDER_NAME}.sql"
OUTPUT_PATH="backend/src/database/seeders/$FILENAME"

echo ""
echo "📦 Creating seeder file..."

# Ensure directory exists
mkdir -p backend/src/database/seeders

# Write file LOCALLY (IMPORTANT FIX)
cat > "$OUTPUT_PATH" <<SQL
-- Seeder: $SEEDER_NAME
-- Table: $TABLE_NAME
-- Created: $(date)

INSERT INTO $TABLE_NAME ($(echo $COLUMNS | tr ' ' ','))
VALUES
$(printf "    %s,\n" "${ROWS[@]}" | sed '$ s/,$//');

SQL

echo "✅ Seeder created successfully!"
echo "📁 $OUTPUT_PATH"

echo ""
echo "👉 To run seeder:"
echo "docker compose exec db psql -U postgres -d YOUR_DB -f src/database/seeders/$FILENAME"