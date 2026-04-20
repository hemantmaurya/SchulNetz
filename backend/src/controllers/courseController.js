import pool from "../config/db.js";

// CREATE Course
export const createCourse = async (req, res) => {
    const { course_code, course_name, description, duration, total_semesters, credits, course_type } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO courses (course_code, course_name, description, duration, total_semesters, credits, course_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [course_code, course_name, description, duration, total_semesters, credits, course_type]
        );

        res.status(201).json({
            success: true,
            message: "Course created successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ALL Courses (with pagination)
export const getAllCourses = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM courses");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT * FROM courses 
             ORDER BY course_id DESC 
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

// GET Single Course
export const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM courses WHERE course_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE Course
export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { course_code, course_name, description, duration, total_semesters, credits, course_type } = req.body;

    try {
        const result = await pool.query(
            `UPDATE courses 
             SET course_code = $1, 
                 course_name = $2, 
                 description = $3, 
                 duration = $4, 
                 total_semesters = $5, 
                 credits = $6, 
                 course_type = $7
             WHERE course_id = $8 
             RETURNING *`,
            [course_code, course_name, description, duration, total_semesters, credits, course_type, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.json({
            success: true,
            message: "Course updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE Course (Hard Delete - careful use karna)
export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM courses WHERE course_id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.json({
            success: true,
            message: "Course deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};