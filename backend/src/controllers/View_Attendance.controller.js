import pool from "../config/db.js";
export const viewAttendance = async (req, res) => {
    const { semester, subject } = req.query;

    try {
        const result = await pool.query(`
            SELECT 
                am.attendance_date,
                am.start_time,
                am.end_time,
                s.student_id,
                s.name AS student_name,
                ad.status,
                ad.remark,
                am.topic
            FROM attendance_master am
            JOIN attendance_details ad ON am.id = ad.attendance_id
            JOIN students s ON ad.student_id = s.student_id
            WHERE 1=1
              ${semester ? `AND am.semester = $1` : ''}
              ${subject ? `AND am.faculty_subject_id = $2` : ''}
            ORDER BY am.attendance_date DESC, s.name ASC
        `, [semester, subject].filter(Boolean));

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};