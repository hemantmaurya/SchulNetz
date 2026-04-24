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

# -------------------------------
# ✅ IMPROVED COLUMN EXTRACTION
# -------------------------------
COLUMNS=()
COLUMN_TYPES=()

while IFS= read -r line; do
  # Match column lines only
  if [[ $line =~ ^[[:space:]]+([a-zA-Z_][a-zA-Z0-9_]*)[[:space:]]+([a-zA-Z]+) ]]; then
    col="${BASH_REMATCH[1]}"
    type="${BASH_REMATCH[2]}"

    # Skip unwanted columns
    if [[ "$col" =~ ^(id|created_at|updated_at|deleted_at)$ ]]; then
      continue
    fi

    COLUMNS+=("$col")
    COLUMN_TYPES+=("$type")
  fi
done < "$MIGRATION_FILE"

if [ ${#COLUMNS[@]} -eq 0 ]; then
  echo "❌ Failed to extract columns"
  exit 1
fi

echo ""
echo "📋 Columns detected:"
for col in "${COLUMNS[@]}"; do
  echo "   • $col"
done

echo ""
echo "👉 Enter data for rows"
echo ""

ROWS=()

while true; do
  ROW_SQL="("
  echo "🧾 New Row:"

  for i in "${!COLUMNS[@]}"; do
    col="${COLUMNS[$i]}"
    type="${COLUMN_TYPES[$i]}"

    read -p "  $col: " value

    # Handle NULL
    if [ -z "$value" ]; then
      ROW_SQL+="NULL,"
      continue
    fi

    # Escape single quotes
    value=$(echo "$value" | sed "s/'/''/g")

    # Detect numeric types
    if [[ "$type" =~ ^(INTEGER|INT|BIGINT|SMALLINT|DECIMAL|NUMERIC)$ ]]; then
      ROW_SQL+="$value,"
    else
      ROW_SQL+="'$value',"
    fi
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

mkdir -p backend/src/database/seeders

# Join column names with comma safely
COLUMN_LIST=$(IFS=, ; echo "${COLUMNS[*]}")

# Write SQL file
cat > "$OUTPUT_PATH" <<SQL
-- Seeder: $SEEDER_NAME
-- Table: $TABLE_NAME
-- Created: $(date)

INSERT INTO $TABLE_NAME ($COLUMN_LIST)
VALUES
$(printf "    %s,\n" "${ROWS[@]}" | sed '$ s/,$//');

SQL

echo "✅ Seeder created successfully!"
echo "📁 $OUTPUT_PATH"

echo ""
echo "👉 To run seeder:"
echo "docker compose exec db psql -U postgres -d YOUR_DB -f src/database/seeders/$FILENAME"