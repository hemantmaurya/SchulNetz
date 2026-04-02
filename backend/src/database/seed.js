import pool from "../config/db.js";
import { hashPassword } from "../utils/auth.js";

const runSeeders = async () => {
  console.log("🌱 Running database seeders...");

  try {
    // Check if default admin already exists
    const existing = await pool.query(
      "SELECT 1 FROM users WHERE email = $1", 
      ["admin@schulnetz.com"]
    );

    if (existing.rows.length > 0) {
      console.log("✓ Default admin user already exists");
      return;
    }

    const hashedPassword = await hashPassword("admin123");

    await pool.query(`
      INSERT INTO users (username, email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
    `, [
      "admin",
      "admin@schulnetz.com",
      hashedPassword,
      "School Administrator",
      "admin"
    ]);

    console.log("✅ Default admin user created!");
    console.log("   Email    : admin@schulnetz.com");
    console.log("   Password : admin123");
    console.log("   Role     : admin");

  } catch (error) {
    console.error("❌ Seeder error:", error.message);
  }
};

export default runSeeders;
