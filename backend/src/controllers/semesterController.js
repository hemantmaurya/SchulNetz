import pool from "../config/db.js";

// CREATE Semester
export const createSemester = async (req, res) => {
    const {
        semester_number,
        semester_name,
        start_date,
        end_date,
        course_id
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO semesters (semester_number, semester_name, start_date, end_date, course_id)
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [semester_number, semester_name, start_date, end_date, course_id]
        );

        res.status(201).json({
            success: true,
            message: "Semester created successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ALL Semesters (with pagination + course name join)
export const getAllSemesters = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM semesters");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT s.*, c.course_name, c.course_code 
             FROM semesters s
             LEFT JOIN courses c ON s.course_id = c.course_id
             ORDER BY s.course_id, s.semester_number 
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
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET Semesters by Course ID (Important for dropdown)
export const getSemestersByCourse = async (req, res) => {
    const { course_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT s.*, c.course_name 
             FROM semesters s
             LEFT JOIN courses c ON s.course_id = c.course_id
             WHERE s.course_id = $1 AND s.deleted_at IS NULL
             ORDER BY s.semester_number`,
            [course_id]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE Semester
export const updateSemester = async (req, res) => {
    const { id } = req.params;
    const { semester_number, semester_name, start_date, end_date, course_id } = req.body;

    try {
        const result = await pool.query(
            `UPDATE semesters 
             SET semester_number = $1, 
                 semester_name = $2, 
                 start_date = $3, 
                 end_date = $4, 
                 course_id = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE semester_id = $6 
             RETURNING *`,
            [semester_number, semester_name, start_date, end_date, course_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Semester not found" });
        }

        res.json({
            success: true,
            message: "Semester updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// SOFT DELETE Semester
export const deleteSemester = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE semesters 
             SET deleted_at = CURRENT_TIMESTAMP 
             WHERE semester_id = $1 
             RETURNING semester_id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Semester not found" });
        }

        res.json({
            success: true,
            message: "Semester soft deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};