import pool from "../config/db.js";

export const testingSave = async (req, res) => {
    const { name, middleName, lastName } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO testing (name, middle_name, last_name) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [name, middleName, lastName]
        );

        res.status(201).json({
            success: true,
            message: "Record added successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error saving record:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTestingAll = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM testing ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).json({ success: false, message: "Error fetching records" });
    }
};

// New: Update Record
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
        console.error("Error updating record:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// New: Delete Record
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
        console.error("Error deleting record:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
