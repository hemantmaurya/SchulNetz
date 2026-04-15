import pool from '../config/db.js';

export const getCourses = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM courses WHERE deleted_at IS NULL ORDER BY course_id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM courses WHERE course_id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { course_code, course_name, description, duration, total_semesters, credits, course_type } = req.body;

    const result = await pool.query(
      `INSERT INTO courses
      (course_code, course_name, description, duration, total_semesters, credits, course_type, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
      RETURNING *`,
      [course_code, course_name, description, duration, total_semesters, credits, course_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_code, course_name, description, duration, total_semesters, credits, course_type } = req.body;

    const result = await pool.query(
      `UPDATE courses SET
        course_code=$1,
        course_name=$2,
        description=$3,
        duration=$4,
        total_semesters=$5,
        credits=$6,
        course_type=$7,
        updated_at=NOW()
      WHERE course_id=$8 AND deleted_at IS NULL
      RETURNING *`,
      [course_code, course_name, description, duration, total_semesters, credits, course_type, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE courses SET deleted_at = NOW() WHERE course_id = $1',
      [id]
    );

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};