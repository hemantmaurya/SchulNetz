import pool from "../config/db.js";

export const createAttendanceMaster = async (req, res) => {
    const {
        faculty_subject_id,
        lecture_no,
        attendance_date,
        start_time,
        end_time,
        topic,
        comment,
        status = 'active'
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO attendance_master 
             (faculty_subject_id, lecture_no, attendance_date, start_time, end_time, 
              topic, comment, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [faculty_subject_id, lecture_no, attendance_date, start_time, end_time, topic, comment, status]
        );

        res.status(201).json({
            success: true,
            message: "Lecture created successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllAttendanceMasters = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM attendance_master WHERE deleted_at IS NULL");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT 
                attendance_master_id as id,
                faculty_subject_id,
                lecture_no,
                attendance_date,
                start_time,
                end_time,
                topic,
                status,
                created_at
             FROM attendance_master 
             WHERE deleted_at IS NULL 
             ORDER BY attendance_master_id DESC 
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

export const getAttendanceMasterById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM attendance_master 
             WHERE attendance_master_id = $1 AND deleted_at IS NULL`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAttendanceMaster = async (req, res) => {
    const { id } = req.params;
    const {
        faculty_subject_id,
        lecture_no,
        attendance_date,
        start_time,
        end_time,
        topic,
        comment,
        status
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE attendance_master 
             SET faculty_subject_id = $1,
                 lecture_no = $2,
                 attendance_date = $3,
                 start_time = $4,
                 end_time = $5,
                 topic = $6,
                 comment = $7,
                 status = $8,
                 updated_at = CURRENT_TIMESTAMP
             WHERE attendance_master_id = $9 AND deleted_at IS NULL 
             RETURNING *`,
            [faculty_subject_id, lecture_no, attendance_date, start_time, end_time, topic, comment, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.json({
            success: true,
            message: "Updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAttendanceMaster = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE attendance_master 
             SET deleted_at = CURRENT_TIMESTAMP 
             WHERE attendance_master_id = $1 AND deleted_at IS NULL 
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.json({ success: true, message: "Deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};