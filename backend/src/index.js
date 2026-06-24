import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import testingRoutes from './routes/testing.routes.js';
// import coursesRoutes from './routes/courses.routes.js';
import coursesRoutes from "./routes/courses.routes.js";
import initDatabase from "./config/initDb.js";
import testingRoutes from './routes/testing.routes.js'
import academicRoutes from './routes/academicCalendar.routes.js';
import attendanceMasterRouter from "./routes/attendance_master.routes.js";
import attendanceDetailsRouter from "./routes/attendanceDetails.routes.js";
import studentRoutes from "./routes/student.routes.js";
import academicRouter from "./routes/academic.routes.js";
import examRoutes from './routes/exam.routes.js';
import courseRoutes from './routes/courseRoutes.js';
import semesterRoutes from './routes/semesterRoutes.js';
import examSubjectRoutes from './routes/examSubjectRoutes.js';
import resultRoutes from './routes/resultRoutes.js';



const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database (migrations + testing table)
initDatabase().catch(err => {
    console.error("Failed to initialize database:", err);
});

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/testing', testingRoutes);

// app.use('/api/courses', coursesRoutes);
app.use("/api/courses", coursesRoutes);

app.use('/api/academic-calendar', academicRoutes);

app.use("/api/attendance-master", attendanceMasterRouter);

app.use("/api/attendance-details", attendanceDetailsRouter);

app.use("/api/students", studentRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/academic", academicRouter);

app.use('/api/courses', courseRoutes);

app.use('/api/exams', examRoutes);

app.use('/api/semesters', semesterRoutes);

app.use('/api/exam-subjects', examSubjectRoutes);

app.use('/api/results', resultRoutes);






// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', app: 'SchulNetz Backend' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});