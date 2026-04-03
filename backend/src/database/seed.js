import pool from "../config/db.js";
import { hashPassword } from "../utils/auth.js";
import fs from "fs";
import path from "path";

const runSeeders = async () => {
  console.log("🌱 Running database seeders...");

  try {
    // 1. Default Admin User (only once)
    const existingAdmin = await pool.query(
      "SELECT 1 FROM users WHERE email = $1", 
      ["admin@schulnetz.com"]
    );

    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await hashPassword("admin123");

      await pool.query(`
        INSERT INTO users (username, email, password_hash, full_name, role, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
      `, ["admin", "admin@schulnetz.com", hashedPassword, "School Administrator", "admin"]);

      console.log("✅ Default admin user created!");
      console.log("   Email    : admin@schulnetz.com");
      console.log("   Password : admin123");
    } else {
      console.log("✓ Default admin user already exists");
    }

    // 2. Run all seeder files from seeders/ folder
    const seedersDir = path.join(process.cwd(), "src/database/seeders");
    if (fs.existsSync(seedersDir)) {
      const files = fs.readdirSync(seedersDir)
                      .filter(file => file.endsWith(".sql"))
                      .sort();

      if (files.length === 0) {
        console.log("No seeder files found.");
        return;
      }

      for (const file of files) {
        console.log(`Running seeder: ${file}`);
        const sql = fs.readFileSync(path.join(seedersDir, file), "utf8");
        await pool.query(sql);
        console.log(`✅ Seeder executed: ${file}`);
      }
    } else {
      console.log("No seeders directory found.");
    }

  } catch (error) {
    console.error("❌ Seeder error:", error.message);
  }
};

export default runSeeders;
