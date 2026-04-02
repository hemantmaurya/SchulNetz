import pool from "./db.js";
import runMigrations from "../database/migrate.js";
import runSeeders from "../database/seed.js";

const initDatabase = async () => {
  try {
    console.log("🌱 Starting database initialization...");

    // Step 1: Always run migrations (safe and fast)
    await runMigrations();

    // Step 2: Run seeders only if needed (smart check)
    await runSeeders();

    console.log("✅ Database initialization completed successfully!");

  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  }
};

export default initDatabase;
