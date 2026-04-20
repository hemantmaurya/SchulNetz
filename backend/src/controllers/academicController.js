import pool from "../config/db.js";
import multer from "multer";
import path from "path";

// ==================== MULTER SETUP ====================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/academic/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Only JPG, PNG, PDF, DOC, DOCX files are allowed!'));
    }
}).single("attachment");

// ==================== CREATE ====================
export const createAcademicPost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message || "File upload error" });
        }

        const {
            type, title, description, start_date, end_date, expiry_date,
            target_all, target_course_id, target_semester, event_details
        } = req.body;

        if (!type || !title || !expiry_date) {
            return res.status(400).json({
                success: false,
                message: "Type, Title and Expiry Date are required!"
            });
        }

        const attachment_url = req.file ? `/uploads/academic/${req.file.filename}` : null;

        try {
            const result = await pool.query(
                `INSERT INTO academic_posts 
                (type, title, description, start_date, end_date, expiry_date, attachment_url, 
                 event_details, target_all, target_course_id, target_semester, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *`,
                [
                    type.toLowerCase().trim(),
                    title.trim(),
                    description || null,
                    start_date || null,
                    end_date || null,
                    expiry_date,
                    attachment_url,
                    event_details || null,
                    target_all === "true" || target_all === true,
                    target_course_id || null,
                    target_semester || null,
                    req.user?.id || null
                ]
            );

            res.status(201).json({
                success: true,
                message: "Academic post created successfully!",
                data: result.rows[0]
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    });
};

// ==================== READ (with pagination) ====================
export const getAcademicPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { type, search } = req.query;

    let query = `
        SELECT * FROM academic_posts 
        WHERE is_deleted = false 
          AND expiry_date > NOW()
          AND (start_date IS NULL OR start_date <= NOW())
          AND (end_date IS NULL OR end_date >= NOW())
    `;

    const values = [];
    let paramCount = 1;

    if (req.user?.role === 'student') {
        query += ` AND (target_all = true OR 
                  (target_course_id = $${paramCount} AND target_semester = $${paramCount + 1}))`;
        values.push(req.user.course_id, req.user.semester);
        paramCount += 2;
    }

    if (type) {
        query += ` AND type = $${paramCount}`;
        values.push(type);
        paramCount++;
    }

    if (search) {
        query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
        values.push(`%${search}%`);
        paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM academic_posts WHERE is_deleted = false");
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(query, values);

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
// ==================== UPDATE ACADEMIC POST - FINAL FIXED ====================
export const updateAcademicPost = async (req, res) => {
    const { id } = req.params;

    let {
        type, title, description, start_date, end_date, expiry_date,
        target_all, target_course_id, target_semester, event_details
    } = req.body;

    // Clean Type
    type = type ? type.toString().trim().toLowerCase() : '';

    console.log("Update - Received Type from Frontend:", type);

    // Strong Validation
    if (!type || !['announcement', 'notice', 'news', 'event', 'other'].includes(type)) {
        return res.status(400).json({
            success: false,
            message: "Type, Title and Expiry Date are required!"
        });
    }

    if (!title || title.toString().trim() === '') {
        return res.status(400).json({ success: false, message: "Title is required!" });
    }

    if (!expiry_date) {
        return res.status(400).json({ success: false, message: "Expiry Date is required!" });
    }

    try {
        const result = await pool.query(
            `UPDATE academic_posts 
             SET type = $1,
                 title = $2,
                 description = $3,
                 start_date = $4,
                 end_date = $5,
                 expiry_date = $6,
                 event_details = $7,
                 target_all = $8,
                 target_course_id = $9,
                 target_semester = $10,
                 updated_at = NOW()
             WHERE id = $11 RETURNING *`,
            [
                type,
                title.trim(),
                description ? description.trim() : null,
                start_date || null,
                end_date || null,
                expiry_date,
                event_details ? event_details.trim() : null,
                target_all === "true" || target_all === true,
                target_course_id || null,
                target_semester || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.json({
            success: true,
            message: "Academic post updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ==================== SOFT DELETE ====================
export const softDeleteAcademicPost = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE academic_posts SET is_deleted = true WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.json({
            success: true,
            message: "Post soft deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};