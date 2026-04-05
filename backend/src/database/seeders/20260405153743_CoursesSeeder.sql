-- 20260405153743_CoursesSeeder.sql
-- Seeder: CoursesSeeder for table courses

INSERT INTO courses (name)
VALUES 
    ('B.Tech')
ON CONFLICT DO NOTHING;

