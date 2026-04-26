import pool from "../config/db.js";

// CREATE ROLE
export const createRole = async (req, res) => {
  const { role_name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO roles (role_name)
       VALUES ($1)
       RETURNING *`,
      [role_name]
    );

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL ROLES
export const getAllRoles = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM roles 
       WHERE deleted_at IS NULL 
       ORDER BY id DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching roles"
    });
  }
};

// UPDATE ROLE
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role_name } = req.body;

  try {
    const result = await pool.query(
      `UPDATE roles 
       SET role_name = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`,
      [role_name, id]
    );

    res.json({
      success: true,
      message: "Role updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// SOFT DELETE ROLE
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE roles 
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: "Role deleted (soft delete) successfully"
    });

  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
