import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import testingRoutes from './routes/testing.routes.js';
import initDatabase from "./config/initDb.js";
import rolesRoutes from "./routes/roles.routes.js";
import studentRoutes from "./routes/student.routes.js";
import attendanceMasterRouter from "./routes/attendance_master.routes.js";
import attendanceDetailsRouter from "./routes/attendanceDetails.routes.js";
import academicRoutes from './routes/academicCalender.routes.js';
import attendanceRouter from "./routes/View_Attendance.routes.js";
import semesterRouter from './routes/semester.routes.js';


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

app.use("/api/roles", rolesRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance-master", attendanceMasterRouter);
app.use("/api/attendance-details", attendanceDetailsRouter);

app.use('/api/academic-calender', academicRoutes);

app.use("/api/attendance", attendanceRouter);

app.use('/api/semesters', semesterRouter);








// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', app: 'SchulNetz Backend' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});