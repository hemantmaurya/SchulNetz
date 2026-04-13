import pool from "../config/db.js";
export const viewAttendance = async (req, res) => {
    const { semester, subject } = req.query;

// VIEW ATTENDANCE (with pagination)
export const getAttendanceAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

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
        const countResult = await pool.query(
            "SELECT COUNT(*) FROM attendance_details WHERE deleted_at IS NULL"
        );

        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT 
                id,
                attendance_id,
                student_id,
                status,
                remark,
                created_at,
                updated_at
             FROM attendance_details
             WHERE deleted_at IS NULL
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
            },
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
        res.status(500).json({ success: false, message: error.message });
    }
}
};