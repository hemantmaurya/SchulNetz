#!/bin/bash

echo "🚀 Smart Controller Generator (Stable Version)"
echo "=============================================="

read -p "Enter Controller Name (e.g. UsersController): " CONTROLLER_NAME

if [ -z "$CONTROLLER_NAME" ]; then
  echo "❌ Name required!"
  exit 1
fi

# Convert Controller → table name
TABLE_NAME=$(echo "$CONTROLLER_NAME" | sed 's/Controller$//' | tr '[:upper:]' '[:lower:]')

# Capitalize (users → Users)
TABLE_NAME_CAP=$(echo "$TABLE_NAME" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')

echo "🔍 Searching migration for table: $TABLE_NAME"

MIGRATION_FILE=$(ls backend/src/database/migrations/*create_${TABLE_NAME}_table.sql 2>/dev/null | sort | tail -1)

if [ -z "$MIGRATION_FILE" ]; then
  echo "❌ No migration found!"
  exit 1
fi

echo "✅ Found: $MIGRATION_FILE"

# ✅ Extract columns safely
COLUMNS=$(sed -n '/CREATE TABLE/,/);/p' "$MIGRATION_FILE" \
  | tr ',' '\n' \
  | sed 's/^[ \t]*//' \
  | awk '{print $1}' \
  | grep -v -E "CREATE|TABLE|\(|\)|id|PRIMARY|KEY|created_at|updated_at|deleted_at|CONSTRAINT|UNIQUE|FOREIGN|--" \
  | grep -v '^$')

if [ -z "$COLUMNS" ]; then
  echo "❌ No valid columns found!"
  exit 1
fi

echo "📋 Columns detected:"
echo "$COLUMNS"

# snake_case → camelCase
toCamelCase() {
  echo "$1" | awk -F_ '{
    for (i=1; i<=NF; i++) {
      if (i==1) printf tolower($i);
      else printf toupper(substr($i,1,1)) tolower(substr($i,2));
    }
  }'
}

JS_VARS=""
SQL_COLUMNS=""
SQL_PLACEHOLDERS=""
UPDATE_SET=""
VALUES_ARRAY=""

i=1
for col in $COLUMNS; do
  camel=$(toCamelCase "$col")

  JS_VARS="${JS_VARS}${camel}, "
  SQL_COLUMNS="${SQL_COLUMNS}${col}, "
  SQL_PLACEHOLDERS="${SQL_PLACEHOLDERS}\$${i}, "
  UPDATE_SET="${UPDATE_SET}${col} = \$${i}, "
  VALUES_ARRAY="${VALUES_ARRAY}${camel}, "

  i=$((i+1))
done

# remove trailing commas
JS_VARS="${JS_VARS%, }"
SQL_COLUMNS="${SQL_COLUMNS%, }"
SQL_PLACEHOLDERS="${SQL_PLACEHOLDERS%, }"
UPDATE_SET="${UPDATE_SET%, }"
VALUES_ARRAY="${VALUES_ARRAY%, }"

OUTPUT_PATH="backend/src/controllers/${CONTROLLER_NAME}.js"
mkdir -p backend/src/controllers

echo "📦 Generating controller..."

cat > "$OUTPUT_PATH" <<EOF
import pool from "../config/db.js";

// ========================
// CREATE
// ========================
export const ${TABLE_NAME}Save = async (req, res) => {
  const { $JS_VARS } = req.body;

  try {
    const result = await pool.query(
      \`INSERT INTO $TABLE_NAME ($SQL_COLUMNS)
       VALUES ($SQL_PLACEHOLDERS)
       RETURNING *\`,
      [$VALUES_ARRAY]
    );

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// READ ALL
// ========================
export const get${TABLE_NAME_CAP}All = async (req, res) => {
  try {
    const result = await pool.query(
      \`SELECT * FROM $TABLE_NAME WHERE deleted_at IS NULL ORDER BY id DESC\`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Read Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// READ BY ID
// ========================
export const get${TABLE_NAME_CAP}ById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      \`SELECT * FROM $TABLE_NAME WHERE id = \$1\`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Read By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// UPDATE
// ========================
export const ${TABLE_NAME}Update = async (req, res) => {
  const { id } = req.params;
  const { $JS_VARS } = req.body;

  try {
    const result = await pool.query(
      \`UPDATE $TABLE_NAME
       SET $UPDATE_SET, updated_at = CURRENT_TIMESTAMP
       WHERE id = \$${i}
       RETURNING *\`,
      [$VALUES_ARRAY, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      message: "Updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// DELETE (SOFT)
// ========================
export const ${TABLE_NAME}Delete = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      \`UPDATE $TABLE_NAME
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = \$1
       RETURNING *\`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully"
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
EOF

echo "✅ Controller created successfully!"
echo "📁 File: $OUTPUT_PATH"