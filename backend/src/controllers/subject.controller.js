// subject.controller.js
import pool from "../config/db.js";

// ====================== CREATE ======================
export const createSubject = async (req, res) => {
    const { 
        subject_code, 
        subject_name, 
        description, 
        credits, 
        subject_type 
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO subjects 
             (subject_code, subject_name, description, credits, subject_type) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [subject_code, subject_name, description, credits, subject_type]
        );

        res.status(201).json({
            success: true,
            message: "Subject created successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ====================== READ ALL (with Pagination) ======================
export const getAllSubjects = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query(
            "SELECT COUNT(*) FROM subjects WHERE deleted_at IS NULL"
        );
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT * FROM subjects 
             WHERE deleted_at IS NULL 
             ORDER BY subject_id DESC 
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
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ====================== UPDATE ======================
export const updateSubject = async (req, res) => {
    const { id } = req.params;
    const { 
        subject_code, 
        subject_name, 
        description, 
        credits, 
        subject_type 
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE subjects 
             SET subject_code = $1,
                 subject_name = $2,
                 description = $3,
                 credits = $4,
                 subject_type = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE subject_id = $6 AND deleted_at IS NULL
             RETURNING *`,
            [subject_code, subject_name, description, credits, subject_type, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Subject not found" 
            });
        }

        res.json({
            success: true,
            message: "Subject updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ====================== SOFT DELETE ======================
export const deleteSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE subjects 
             SET deleted_at = CURRENT_TIMESTAMP 
             WHERE subject_id = $1 AND deleted_at IS NULL 
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Subject not found or already deleted" 
            });
        }

        res.json({
            success: true,
            message: "Subject deleted successfully (soft delete)!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Optional: Get Single Subject by ID
export const getSubjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM subjects 
             WHERE subject_id = $1 AND deleted_at IS NULL`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Subject not found" 
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};