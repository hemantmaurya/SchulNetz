import pool from "../config/db.js";

/*
 * CoursesController
 * Table: courses
 */

// ======================== CREATE ========================
export const coursesSave = async (req, res) => {
    const data = req.body;
    try {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((_, i) => "$" + (i+1)).join(", ");

        const result = await pool.query(
            "INSERT INTO courses (" + columns.join(", ") + ") VALUES (" + placeholders + ") RETURNING *",
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
// ======================== READ ALL - With Pagination ========================
export const getcoursesAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM courses");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            "SELECT * FROM courses ORDER BY id DESC LIMIT $1 OFFSET $2",
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
// ======================== READ ALL - Simple ========================
export const getcoursesAllSimple = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM courses ORDER BY id DESC");
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ======================== READ BY ID ========================
export const getcoursesById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ======================== UPDATE ========================
export const coursesUpdate = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => col + " = $" + (i+1)).join(", ");

    try {
        const result = await pool.query(
            "UPDATE courses SET " + setClause + ", updated_at = CURRENT_TIMESTAMP WHERE id = $" + (values.length + 1) + " RETURNING *",
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
// ======================== SOFT DELETE ========================
export const coursesDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE courses SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
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
