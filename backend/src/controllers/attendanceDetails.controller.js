import pool from "../config/db.js";

export const bulkSaveAttendance = async (req, res) => {
    const { attendanceDetails } = req.body;

    if (!attendanceDetails || !Array.isArray(attendanceDetails)) {
        return res.status(400).json({
            success: false,
            message: "Invalid attendance data"
        });
    }

    let successCount = 0;

    try {
        for (const item of attendanceDetails) {
            try {
                await pool.query(
                    `INSERT INTO attendance_details 
                     (attendance_id, student_id, status, remark)
                     VALUES ($1, $2, $3, $4)`,
                    [
                        item.attendance_id,
                        item.student_id,
                        item.status,
                        item.remark || null
                    ]
                );
                successCount++;
            } catch (err) {
                // Agar duplicate entry hai toh ignore kar do
                if (err.code === '23505') {
                    // Update existing record
                    await pool.query(
                        `UPDATE attendance_details 
                         SET status = $1, remark = $2, updated_at = CURRENT_TIMESTAMP
                         WHERE attendance_id = $3 AND student_id = $4`,
                        [item.status, item.remark || null, item.attendance_id, item.student_id]
                    );
                    successCount++;
                } else {
                    console.error("Error for student", item.student_id, err);
                }
            }
        }

        res.json({
            success: true,
            message: `Attendance saved successfully! (${successCount} records)`,
        });

    } catch (error) {
        console.error("Bulk Save Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save attendance",
            error: error.message
        });
    }
};

