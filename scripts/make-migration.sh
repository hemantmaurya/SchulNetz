#!/bin/bash

echo "🚀 Advanced Laravel-style Migration Generator"
echo "============================================="

read -p "Enter Table Name (e.g. students): " TABLE_NAME

if [ -z "$TABLE_NAME" ]; then
  echo "❌ Table name is required!"
  exit 1
fi

echo ""
echo "Define columns for table '$TABLE_NAME'"
echo "Type 'done' when finished."
echo ""

COLUMNS=()

while true; do
  echo "------------------------------------------------"
  read -p "Column Name (or 'done'): " col_name
  if [ "$col_name" = "done" ] || [ -z "$col_name" ]; then
    break
  fi

  read -p "Data Type (VARCHAR, INTEGER, BOOLEAN, TEXT, DATE, TIMESTAMP): " data_type
  read -p "Length (for VARCHAR/DECIMAL, press Enter for default): " length
  read -p "Nullable? (y/N): " nullable
  read -p "Unique? (y/N): " unique
  read -p "Default Value (leave empty if none): " default_value
  read -p "Is it Primary Key? (y/N): " is_pk
  read -p "Is it Foreign Key? (y/N): " is_fk
  read -p "Indexed? (y/N): " indexed
  read -p "Comment (optional): " comment

  nullable=$(echo "$nullable" | tr '[:upper:]' '[:lower:]')
  unique=$(echo "$unique" | tr '[:upper:]' '[:lower:]')
  is_pk=$(echo "$is_pk" | tr '[:upper:]' '[:lower:]')
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

  if [ "$is_pk" = "y" ]; then
    col_def="$col_def PRIMARY KEY"
  fi

  if [ "$is_fk" = "y" ]; then
    read -p "References Table Name: " ref_table
    read -p "References Column (usually id): " ref_column
    col_def="$col_def REFERENCES $ref_table($ref_column)"
  fi

  if [ -n "$default_value" ]; then
    col_def="$col_def DEFAULT '$default_value'"
  fi

  COLUMNS+=("$col_def")

  echo "Added: $col_def"
done

if [ ${#COLUMNS[@]} -eq 0 ]; then
  echo "No columns entered. Using recommended defaults."
  COLUMNS=(
    "name VARCHAR(100) NOT NULL"
    "middle_name VARCHAR(100)"
    "last_name VARCHAR(100) NOT NULL"
    "email VARCHAR(255) UNIQUE"
    "phone VARCHAR(20)"
    "age INTEGER"
    "is_active BOOLEAN DEFAULT true"
    "notes TEXT"
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

read -p "Create this migration file? (y/N): " confirm
confirm=$(echo "$confirm" | tr '[:upper:]' '[:lower:]')

if [[ "$confirm" != "y" ]]; then
  echo "❌ Migration creation cancelled."
  exit 1
fi

TIMESTAMP=$(date +"%Y%m%d%H%M%S")
FILENAME="${TIMESTAMP}_create_${TABLE_NAME}_table.sql"

docker compose exec backend sh -c "
cat > /app/src/database/migrations/$FILENAME << 'MIGRATION'
-- $FILENAME
-- Migration for table: $TABLE_NAME
-- Created: $(date)

CREATE TABLE IF NOT EXISTS $TABLE_NAME (
    id SERIAL PRIMARY KEY,
    
$(for col in "${COLUMNS[@]}"; do echo "    $col,"; done)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Recommended indexes
CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_name ON $TABLE_NAME(name);
CREATE INDEX IF NOT EXISTS idx_${TABLE_NAME}_deleted_at ON $TABLE_NAME(deleted_at);

COMMENT ON TABLE $TABLE_NAME IS 'Table for $TABLE_NAME management';
MIGRATION
"

echo "✅ Migration created successfully!"
echo "📁 File: src/database/migrations/$FILENAME"
echo ""
echo "Next step: Run 'docker compose restart backend' to apply the migration"
"
