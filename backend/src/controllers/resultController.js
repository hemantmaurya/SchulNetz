import pool from "../config/db.js";

// CREATE - Submit Student Result
export const submitResult = async (req, res) => {
    const {
        student_id,
        exam_id,
        subject_id,
        obtained_marks,
        grade,
        remarks
    } = req.body;

    try {
        // Auto calculate is_passed
        const is_passed = obtained_marks >= 40;   // Tum passing_marks ke hisaab se change kar sakte ho

        const result = await pool.query(
            `INSERT INTO student_exam_results 
             (student_id, exam_id, subject_id, obtained_marks, grade, remarks, is_passed)
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [student_id, exam_id, subject_id, obtained_marks, grade, remarks, is_passed]
        );

        res.status(201).json({
            success: true,
            message: "Student result submitted successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET - All Results of One Exam (All Students)
export const getResultsByExam = async (req, res) => {
    const { exam_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                ser.*,
                s.name AS student_name,
                s.roll_number,
                sub.subject_name,
                e.exam_name
            FROM student_exam_results ser
            JOIN students s ON ser.student_id = s.student_id
            JOIN subjects sub ON ser.subject_id = sub.subject_id
            JOIN exams e ON ser.exam_id = e.id
            WHERE ser.exam_id = $1
            ORDER BY s.roll_number`,
            [exam_id]
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

// GET - All Results of One Student
export const getStudentResults = async (req, res) => {
    const { student_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                ser.*,
                e.exam_name,
                e.academic_year,
                sub.subject_name,
                sub.subject_code
            FROM student_exam_results ser
            JOIN exams e ON ser.exam_id = e.id
            JOIN subjects sub ON ser.subject_id = sub.subject_id
            WHERE ser.student_id = $1
            ORDER BY e.start_date DESC`,
            [student_id]
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

// UPDATE Result
export const updateResult = async (req, res) => {
    const { id } = req.params;
    const { obtained_marks, grade, remarks } = req.body;

    try {
        const is_passed = obtained_marks >= 40;

        const result = await pool.query(
            `UPDATE student_exam_results 
             SET obtained_marks = $1, 
                 grade = $2, 
                 remarks = $3,
                 is_passed = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 
             RETURNING *`,
            [obtained_marks, grade, remarks, is_passed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Result not found" });
        }

        res.json({
            success: true,
            message: "Result updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};