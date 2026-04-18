import pool from "../config/db.js";

// ========================
// CREATE - Add new record
// ========================
export const testingSave = async (req, res) => {
    const { name, middleName, lastName, email, phone, age, isActive, notes } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO testing 
             (name, middle_name, last_name, email, phone, age, is_active, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [name, middleName, lastName, email, phone, age, isActive, notes]
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

// ========================
// READ ALL - With Pagination
// ========================
export const getTestingAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM testing");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT * FROM testing 
             ORDER BY id DESC 
             LIMIT $1 OFFSET $2`,
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
        console.error("Read Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========================
// READ ONE - Get single record by ID
// ========================
export const getTestingById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM testing WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========================
// UPDATE
// ========================
export const testingUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, middleName, lastName, email, phone, age, isActive, notes } = req.body;

    try {
        const result = await pool.query(
            `UPDATE testing 
             SET name = $1, 
                 middle_name = $2, 
                 last_name = $3,
                 email = $4, 
                 phone = $5, 
                 age = $6, 
                 is_active = $7, 
                 notes = $8,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9 
             RETURNING *`,
            [name, middleName, lastName, email, phone, age, isActive, notes, id]
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

// ========================
// DELETE (Soft Delete)
// ========================
export const testingDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE testing 
             SET deleted_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING *`,
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
