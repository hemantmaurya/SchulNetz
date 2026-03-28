import pool from "../config/db.js";

// CREATE
export const testingSave = async (req, res) => {
    const { name, middleName, lastName } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO testing (name, middle_name, last_name) 
             VALUES ($1, $2, $3) RETURNING *`,
            [name, middleName, lastName]
        );
        res.status(201).json({
            success: true,
            message: "Record added successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// READ (with pagination)
export const getTestingAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM testing");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT * FROM testing 
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
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
export const testingUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, middleName, lastName } = req.body;

    try {
        const result = await pool.query(
            `UPDATE testing 
             SET name = $1, middle_name = $2, last_name = $3 
             WHERE id = $4 
             RETURNING *`,
            [name, middleName, lastName, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.json({
            success: true,
            message: "Record updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
export const testingDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM testing WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.json({
            success: true,
            message: "Record deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
