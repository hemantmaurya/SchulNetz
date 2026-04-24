#!/bin/bash

echo "🚀 Advanced Laravel-style Migration Generator (Final)"
echo "==================================================="

read -p "Enter Table Name (e.g. students): " TABLE_NAME

if [ -z "$TABLE_NAME" ]; then
  echo "❌ Table name is required!"
  exit 1
fi

echo ""
echo "Define columns for table '$TABLE_NAME'"
echo "⚠️ Do NOT add: id, created_at, updated_at, deleted_at"
echo "Type 'done' when finished."
echo ""

COLUMNS=()
INDEXES=()

while true; do
  echo "------------------------------------------------"
  read -p "Column Name (or 'done'): " col_name

  if [ "$col_name" = "done" ] || [ -z "$col_name" ]; then
    break
  fi

  # Prevent system columns
  if [[ "$col_name" == "id" || "$col_name" == "created_at" || "$col_name" == "updated_at" || "$col_name" == "deleted_at" ]]; then
    echo "❌ These columns are auto-added. Skip."
    continue
  fi

  read -p "Data Type (VARCHAR, INTEGER, BOOLEAN, TEXT, DATE, TIMESTAMP): " data_type

  # Normalize + fix typo
  data_type=$(echo "$data_type" | tr '[:upper:]' '[:lower:]')

  if [ "$data_type" = "interger" ]; then
    data_type="integer"
  fi

  data_type=$(echo "$data_type" | tr '[:lower:]' '[:upper:]')

  read -p "Length (optional): " length
  read -p "Nullable? (y/N): " nullable
  read -p "Unique? (y/N): " unique
  read -p "Default Value (leave empty if none): " default_value
  read -p "Foreign Key? (y/N): " is_fk
  read -p "Indexed? (y/N): " indexed

  nullable=$(echo "$nullable" | tr '[:upper:]' '[:lower:]')
  unique=$(echo "$unique" | tr '[:upper:]' '[:lower:]')
  is_fk=$(echo "$is_fk" | tr '[:upper:]' '[:lower:]')
  indexed=$(echo "$indexed" | tr '[:upper:]' '[:lower:]')

  col_def="$col_name $data_type"

  if [ -n "$length" ]; then
    col_def="$col_def($length)"
  fi

  if [ "$nullable" != "y" ]; then
    col_def="$col_def NOT NULL"
  fi

  if [ "$unique" = "y" ]; then
    col_def="$col_def UNIQUE"
  fi

  if [ "$is_fk" = "y" ]; then
    read -p "References Table: " ref_table
    read -p "References Column (default id): " ref_column
    ref_column=${ref_column:-id}
    col_def="$col_def REFERENCES $ref_table($ref_column) ON DELETE CASCADE"
  fi

  # Smart default handling
  if [ -n "$default_value" ]; then
    if [[ "$default_value" =~ ^[0-9]+$ ]] || [[ "$default_value" == "true" || "$default_value" == "false" ]]; then
      col_def="$col_def DEFAULT $default_value"
    else
      col_def="$col_def DEFAULT '$default_value'"
    fi
  fi

  COLUMNS+=("$col_def")

  if [ "$indexed" = "y" ]; then
    INDEXES+=("CREATE INDEX idx_${TABLE_NAME}_${col_name} ON $TABLE_NAME($col_name);")
  fi

  echo "✅ Added: $col_def"
done

# Default fallback
if [ ${#COLUMNS[@]} -eq 0 ]; then
  echo "⚠️ No columns entered. Using defaults."
  COLUMNS=(
    "name VARCHAR(100) NOT NULL"
  )
fi

echo ""
echo "══════════════════════════════════════════════"
echo "FINAL SUMMARY"
echo "Table: $TABLE_NAME"
echo "Columns:"
for col in "${COLUMNS[@]}"; do
  echo "   • $col"
done
echo "══════════════════════════════════════════════"
echo ""

read -p "Create migration? (y/N): " confirm
confirm=$(echo "$confirm" | tr '[:upper:]' '[:lower:]')

if [[ "$confirm" != "y" ]]; then
  echo "❌ Cancelled."
  exit 1
fi

TIMESTAMP=$(date +"%Y%m%d%H%M%S")
FILENAME="${TIMESTAMP}_create_${TABLE_NAME}_table.sql"

echo "📦 Creating migration..."

# Build column SQL
COLUMN_SQL=""
for col in "${COLUMNS[@]}"; do
  COLUMN_SQL="${COLUMN_SQL}    $col,\n"
done

# CREATE FILE LOCALLY (FIXED)
printf "%b" \
"-- $FILENAME\n" \
"-- Migration for table: $TABLE_NAME\n\n" \
"CREATE TABLE IF NOT EXISTS $TABLE_NAME (\n" \
"    id SERIAL PRIMARY KEY,\n" \
"$COLUMN_SQL" \
"    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n" \
"    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n" \
"    deleted_at TIMESTAMP NULL\n" \
");\n\n" \
"CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_deleted_at ON $TABLE_NAME(deleted_at);\n" \
"$(printf "%s\n" "${INDEXES[@]}")\n" \
> backend/src/database/migrations/$FILENAME

echo "✅ Migration created successfully!"
echo "📁 File: backend/src/database/migrations/$FILENAME"

echo ""
echo "👉 To apply migration:"
echo "docker compose exec backend psql -U postgres -d YOUR_DB -f src/database/migrations/$FILENAME"