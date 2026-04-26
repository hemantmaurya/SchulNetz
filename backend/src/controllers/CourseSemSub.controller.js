import pool from "../config/db.js";


// ====================== GET ALL COURSES ======================
export const getCourses = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                course_id AS id,
                course_name
            FROM courses
            ORDER BY course_name ASC
        `);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ====================== GET SEMESTERS BY COURSE ======================
export const getSemestersByCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                s.semester_id AS id,
                s.semester_name,
                csa.id AS course_sem_assign_id
            FROM course_sem_assign csa
            JOIN semesters s 
                ON s.semester_id = csa.semester_id
            WHERE csa.course_id = $1
            ORDER BY s.semester_id ASC
        `, [parseInt(courseId)]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ====================== GET SUBJECTS BY COURSE+SEMESTER ======================
export const getSubjectsByCourseSemester = async (req, res) => {
    const { courseSemAssignId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                sub.subject_id AS id,
                sub.subject_name
            FROM sem_subject_assign ssa
            JOIN subjects sub 
                ON sub.subject_id = ssa.subject_id
            WHERE ssa.course_sem_assign_id = $1
            ORDER BY sub.subject_name ASC
        `, [parseInt(courseSemAssignId)]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};