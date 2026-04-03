-- 20260403182620_TestingSeeder.sql
-- Seeder: TestingSeeder
-- Table : testing
-- Created: Fri Apr  3 18:26:20 IST 2026

-- =============================================
-- TODO: Add your INSERT statements here
-- =============================================

-- Example (you can delete or modify this):
INSERT INTO testing (name, middle_name, last_name)
VALUES
    ('Rahul', 'Kumar', 'Sharma'),
    ('Aditya', 'Kumar', 'Verma')
ON CONFLICT DO NOTHING;

