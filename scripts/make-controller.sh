#!/bin/bash

echo "🚀 Simple & Clean Controller Generator"
echo "====================================="

read -p "Enter Controller Name (e.g. CoursesController): " CONTROLLER_NAME
if [ -z "$CONTROLLER_NAME" ]; then
  echo "❌ Name required!"
  exit 1
fi

TABLE_NAME=$(echo "$CONTROLLER_NAME" | sed 's/Controller$//' | tr '[:upper:]' '[:lower:]')

MIGRATION_FILE=$(ls backend/src/database/migrations/*create_${TABLE_NAME}_table.sql 2>/dev/null | sort | tail -1)

if [ -z "$MIGRATION_FILE" ]; then
  echo "❌ No migration found for table '$TABLE_NAME'!"
  exit 1
fi

echo "✅ Using migration: $MIGRATION_FILE"

COLUMNS=$(grep -o '^[[:space:]]*[a-z_][a-z0-9_]*' "$MIGRATION_FILE" 2>/dev/null | sed 's/^[[:space:]]*//' | grep -vE '^(id|created_at|updated_at|deleted_at)$' | tr '\n' ' ')

echo ""
echo "Found columns: $COLUMNS"
read -p "Is this correct? (y/N): " correct
correct=$(echo "$correct" | tr '[:upper:]' '[:lower:]')
if [[ "$correct" != "y" ]]; then
  echo "Cancelled."
  exit 1
fi

echo ""
echo "Which functions do you want?"
read -p "  Create? (y/N): " want_create
read -p "  Pagination? (y/N): " want_pagination
read -p "  Simple List? (y/N): " want_simple
read -p "  Get by ID? (y/N): " want_byid
read -p "  Update? (y/N): " want_update
read -p "  Soft Delete? (y/N): " want_delete

want_create=$(echo "$want_create" | tr '[:upper:]' '[:lower:]')
want_pagination=$(echo "$want_pagination" | tr '[:upper:]' '[:lower:]')
want_simple=$(echo "$want_simple" | tr '[:upper:]' '[:lower:]')
want_byid=$(echo "$want_byid" | tr '[:upper:]' '[:lower:]')
want_update=$(echo "$want_update" | tr '[:upper:]' '[:lower:]')
want_delete=$(echo "$want_delete" | tr '[:upper:]' '[:lower:]')

echo "Generating controller..."

docker compose exec backend sh -c '
cat > /app/src/controllers/'${CONTROLLER_NAME}'.js << "BASE"
import pool from "../config/db.js";

/*
 * '${CONTROLLER_NAME}'
 * Table: '${TABLE_NAME}'
 */

BASE
'

# Create
if [ "$want_create" = "y" ]; then
  docker compose exec backend sh -c '
cat >> /app/src/controllers/'${CONTROLLER_NAME}'.js << "CREATE"
// ======================== CREATE ========================
export const '${TABLE_NAME}'Save = async (req, res) => {
    const data = req.body;
    try {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((_, i) => "$" + (i+1)).join(", ");

        const result = await pool.query(
            "INSERT INTO '${TABLE_NAME}' (" + columns.join(", ") + ") VALUES (" + placeholders + ") RETURNING *",
            values
        );
        res.status(201).json({
            success: true,
            message: "Record created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Create Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
CREATE
'
fi

# Pagination
if [ "$want_pagination" = "y" ]; then
  docker compose exec backend sh -c '
cat >> /app/src/controllers/'${CONTROLLER_NAME}'.js << "PAG"
// ======================== READ ALL - With Pagination ========================
export const get'${TABLE_NAME}'All = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM '${TABLE_NAME}'");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            "SELECT * FROM '${TABLE_NAME}' ORDER BY id DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
PAG
'
fi

# Simple List
if [ "$want_simple" = "y" ]; then
  docker compose exec backend sh -c '
cat >> /app/src/controllers/'${CONTROLLER_NAME}'.js << "SIMPLE"
// ======================== READ ALL - Simple ========================
export const get'${TABLE_NAME}'AllSimple = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM '${TABLE_NAME}' ORDER BY id DESC");
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
SIMPLE
'
fi

# Get by ID
if [ "$want_byid" = "y" ]; then
  docker compose exec backend sh -c '
cat >> /app/src/controllers/'${CONTROLLER_NAME}'.js << "BYID"
// ======================== READ BY ID ========================
export const get'${TABLE_NAME}'ById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM '${TABLE_NAME}' WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
BYID
'
fi

# Update
if [ "$want_update" = "y" ]; then
  docker compose exec backend sh -c '
cat >> /app/src/controllers/'${CONTROLLER_NAME}'.js << "UPDATE"
// ======================== UPDATE ========================
export const '${TABLE_NAME}'Update = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => col + " = $" + (i+1)).join(", ");

    try {
        const result = await pool.query(
            "UPDATE '${TABLE_NAME}' SET " + setClause + ", updated_at = CURRENT_TIMESTAMP WHERE id = $" + (values.length + 1) + " RETURNING *",
            [...values, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }
        res.json({
            success: true,
            message: "Record updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
UPDATE
'
fi

# Soft Delete
if [ "$want_delete" = "y" ]; then
  docker compose exec backend sh -c '
cat >> /app/src/controllers/'${CONTROLLER_NAME}'.js << "DELETE"
// ======================== SOFT DELETE ========================
export const '${TABLE_NAME}'Delete = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE '${TABLE_NAME}' SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }
        res.json({
            success: true,
            message: "Record soft deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
DELETE
'
fi

echo "✅ Controller created successfully!"
echo "📁 File: src/controllers/${CONTROLLER_NAME}.js"
echo "Next step: docker compose restart backend"
