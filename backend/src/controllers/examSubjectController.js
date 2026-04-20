import pool from "../config/db.js";

// Add Subject to Exam
export const addExamSubject = async (req, res) => {
    const { exam_id, subject_id, max_marks = 100, passing_marks = 40, exam_date, exam_time, room_no } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO exam_subjects (exam_id, subject_id, max_marks, passing_marks, exam_date, exam_time, room_no)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [exam_id, subject_id, max_marks, passing_marks, exam_date, exam_time, room_no]
        );

        res.status(201).json({
            success: true,
            message: "Subject added to exam with schedule!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Add Exam Subject Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Subjects of One Exam (Fixed & Clean)
export const getSubjectsByExam = async (req, res) => {
    const { exam_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                es.exam_date,
                es.exam_time,
                es.room_no,
                s.subject_name,
                s.subject_code
            FROM exam_subjects es
            JOIN subjects s ON es.subject_id = s.subject_id
            WHERE es.exam_id = $1
            ORDER BY es.exam_date ASC, es.exam_time ASC
        `, [exam_id]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error("Get Subjects By Exam Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get Subjects by Semester (for cascading dropdown)
export const getSubjectsBySemester = async (req, res) => {
    const { semester_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                subject_id,
                subject_code,
                subject_name,
                credits,
                subject_type
            FROM subjects
            WHERE semester_id = $1
            ORDER BY subject_name
        `, [semester_id]);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Subject from Exam
export const deleteExamSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM exam_subjects WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.json({
            success: true,
            message: "Subject removed from exam successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};