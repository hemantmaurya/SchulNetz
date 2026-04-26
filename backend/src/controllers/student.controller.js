import pool from "../config/db.js";


// CREATE
export const createStudent = async (req, res) => {
    const { name, course_id, branch_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO students (name, course_id, branch_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, course_id, branch_id]
        );

        res.status(201).json({
            success: true,
            message: "Student added successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// READ (with pagination)
export const getAllStudents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM students");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT * FROM students
             ORDER BY student_id DESC
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
export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, course_id, branch_id } = req.body;

    try {
        const result = await pool.query(
            `UPDATE students
             SET name = $1, course_id = $2, branch_id = $3
             WHERE student_id = $4
             RETURNING *`,
            [name, course_id, branch_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// DELETE
export const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM students WHERE student_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};