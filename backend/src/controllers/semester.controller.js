import pool from '../config/db.js';

// Create New Semester
const createSemester = async (req, res) => {
    const { semester_number, semester_name, start_date, end_date } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO semesters 
            (semester_number, semester_name, start_date, end_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [semester_number, semester_name, start_date, end_date]
        );

        const newSemester = result.rows[0];

        res.status(201).json({
            success: true,
            message: 'Semester created successfully',
            data: newSemester
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Semester with this number or name already exists'
            });
        }
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get All Semesters with Pagination
const getAllSemesters = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // Total records count
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM semesters WHERE deleted_at IS NULL`
        );
        const totalRecords = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalRecords / limit);

        // Fetch data with pagination
        const result = await pool.query(
            `SELECT * FROM semesters 
             WHERE deleted_at IS NULL 
             ORDER BY semester_number ASC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        res.json({
            success: true,
            message: 'Semesters fetched successfully',
            data: result.rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: limit
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get Semester by ID
const getSemesterById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM semesters 
             WHERE semester_id = $1 AND deleted_at IS NULL`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Semester not found'
            });
        }

        res.json({
            success: true,
            message: 'Semester fetched successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update Semester
const updateSemester = async (req, res) => {
    const { id } = req.params;
    const { semester_number, semester_name, start_date, end_date } = req.body;

    try {
        const result = await pool.query(
            `UPDATE semesters 
             SET semester_number = $1,
                 semester_name = $2,
                 start_date = $3,
                 end_date = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE semester_id = $5 AND deleted_at IS NULL
             RETURNING *`,
            [semester_number, semester_name, start_date, end_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Semester not found or already deleted'
            });
        }

        res.json({
            success: true,
            message: 'Semester updated successfully',
            data: result.rows[0]
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Duplicate semester number or name'
            });
        }
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Soft Delete Semester
const deleteSemester = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE semesters 
             SET deleted_at = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE semester_id = $1 AND deleted_at IS NULL
             RETURNING semester_id, semester_name`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Semester not found or already deleted'
            });
        }

        res.json({
            success: true,
            message: 'Semester deleted successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export {
    createSemester,
    getAllSemesters,
    getSemesterById,
    updateSemester,
    deleteSemester
};