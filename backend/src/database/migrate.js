import pool from "../config/db.js";
import fs from "fs";
import path from "path";

const runMigrations = async () => {
  console.log("🚀 Running database migrations...");

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsDir = path.join(process.cwd(), "src/database/migrations");
    const files = fs.readdirSync(migrationsDir)
                    .filter(file => file.endsWith(".sql"))
                    .sort();

    for (const file of files) {
      const alreadyRun = await pool.query(
        "SELECT 1 FROM migrations WHERE name = $1", 
        [file]
      );

      if (alreadyRun.rows.length > 0) {
        console.log(`✓ ${file} already executed`);
        continue;
      }

      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      
      await pool.query(sql);

      await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      console.log(`✅ Migration executed: ${file}`);
    }

    console.log("🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error.message);
  }
};

export default runMigrations;
