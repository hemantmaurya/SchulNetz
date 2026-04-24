import pool from "../config/db.js";

// ========================
// CREATE
// ========================
export const usersSave = async (req, res) => {
  const { username, email, passwordHash, fullName, role, isActive } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [username, email, passwordHash, fullName, role, isActive]
    );

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// READ ALL
// ========================
export const getUsersAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Read Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// READ BY ID
// ========================
export const getUsersById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Read By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// UPDATE
// ========================
export const usersUpdate = async (req, res) => {
  const { id } = req.params;
  const { username, email, passwordHash, fullName, role, isActive } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1, email = $2, password_hash = $3, full_name = $4, role = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [username, email, passwordHash, fullName, role, isActive, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      message: "Updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// DELETE (SOFT)
// ========================
export const usersDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully"
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
