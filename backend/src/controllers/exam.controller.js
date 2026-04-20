import pool from "../config/db.js";

// CREATE Exam
export const createExam = async (req, res) => {
    const {
        course_id,
        semester_id,
        exam_name,
        academic_year,
        start_date,
        end_date,
        exam_type = "Theory"
    } = req.body;

    try {
        const safeStartDate = start_date && start_date.trim() !== "" ? start_date : null;
        const safeEndDate = end_date && end_date.trim() !== "" ? end_date : null;

        const result = await pool.query(
            `INSERT INTO exams 
             (course_id, semester_id, exam_name, academic_year, start_date, end_date, exam_type, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'Upcoming')
             RETURNING *`,
            [course_id, semester_id, exam_name, academic_year, safeStartDate, safeEndDate, exam_type]
        );

        res.status(201).json({
            success: true,
            message: "Exam created successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Create Exam Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ALL EXAMS - Fixed (New exam on top + proper joins)
export const getAllExams = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM exams WHERE deleted_at IS NULL");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT e.*, 
                    c.course_name, 
                    s.semester_name
             FROM exams e
             LEFT JOIN courses c ON e.course_id = c.course_id
             LEFT JOIN semesters s ON e.semester_id = s.semester_id
             WHERE e.deleted_at IS NULL
             ORDER BY e.id DESC          -- Newest exam on top
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

// ==================== GET SUBJECTS OF ONE EXAM (New - Important) ====================
export const getSubjectsByExam = async (req, res) => {
    const { exam_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                es.id,
                es.exam_date,
                es.exam_time,
                es.room_no,
                s.subject_id,
                s.subject_name,
                s.subject_code
            FROM exam_subjects es
                     JOIN subjects s ON es.subject_id = s.subject_id
            WHERE es.exam_id = $1
            ORDER BY es.exam_date, es.exam_time
        `, [exam_id]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error("Get Exam Subjects Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== OTHER FUNCTIONS (No major change) ====================
export const getExamById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT e.*, c.course_name, s.semester_name
             FROM exams e
             LEFT JOIN courses c ON e.course_id = c.course_id
             LEFT JOIN semesters s ON e.semester_id = s.semester_id
             WHERE e.id = $1 AND e.deleted_at IS NULL`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateExam = async (req, res) => {
    const { id } = req.params;
    const {
        exam_name,
        start_date,
        end_date,
        exam_type,
        status
    } = req.body;

    try {
        const safeStartDate = start_date && start_date.trim() !== "" ? start_date : null;
        const safeEndDate = end_date && end_date.trim() !== "" ? end_date : null;

        const result = await pool.query(
            `UPDATE exams
             SET exam_name = $1,
                 start_date = $2,
                 end_date = $3,
                 exam_type = $4,
                 status = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [exam_name, safeStartDate, safeEndDate, exam_type, status || 'Upcoming', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        res.json({
            success: true,
            message: "Exam updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteExam = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE exams
             SET deleted_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        res.json({
            success: true,
            message: "Exam soft deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};