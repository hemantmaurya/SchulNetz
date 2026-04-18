import pool from "../config/db.js";

// VIEW ATTENDANCE (with pagination)
export const getAttendanceAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
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