import pool from "./db.js";
import runMigrations from "../database/migrate.js";

const initDatabase = async () => {
  try {
    console.log("🌱 Starting database initialization...");

    // IMPORTANT: Run migrations first
    await runMigrations();

    // Keep your testing table
    console.log("🔧 Ensuring testing table exists...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testing (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countResult = await pool.query("SELECT COUNT(*) FROM testing");
    if (parseInt(countResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO testing (name, middle_name, last_name) 
        VALUES 
          (Rahul, Kumar, Sharma),
          (Priya, Singh, Rathore),
          (Amit, Kumar, Verma)
      `);
      console.log("✅ Dummy data inserted into testing table");
    }

    console.log("✅ Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  }
};

export default initDatabase;
