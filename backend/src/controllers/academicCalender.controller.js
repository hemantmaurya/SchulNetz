import pool from "../config/db.js";

// CREATE
export const saveAcademic = async (req, res) => {
    const { eventName, startDate, endDate, description } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO academic_calendar (event_name, start_date, end_date, description)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [eventName, startDate, endDate, description]
        );

        res.status(201).json({
            success: true,
            message: "Event added successfully",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// READ (pagination)
export const getAcademicAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM academic_calendar");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT * FROM academic_calendar
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
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
export const updateAcademic = async (req, res) => {
    const { id } = req.params;
    const { eventName, startDate, endDate, description } = req.body;

    try {
        const result = await pool.query(
            `UPDATE academic_calendar
             SET event_name=$1, start_date=$2, end_date=$3, description=$4
             WHERE id=$5 RETURNING *`,
            [eventName, startDate, endDate, description, id]
        );

        res.json({
            success: true,
            message: "Updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
export const deleteAcademic = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM academic_calendar WHERE id=$1", [id]);

        res.json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};