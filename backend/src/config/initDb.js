import pool from "./db.js";
import runMigrations from "../database/migrate.js";
import runSeeders from "../database/seed.js";

const initDatabase = async () => {
  try {
    console.log("🌱 Starting database initialization...");

    // Step 1: Run Migrations first (create tables)
    await runMigrations();

    // Step 2: Run Seeders (insert default admin user)
    await runSeeders();

    console.log("✅ Database initialization completed successfully!");
    console.log("   Default Admin Login:");
    console.log("   Email    : admin@schulnetz.com");
    console.log("   Password : admin123");

  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  }
};

export default initDatabase;
