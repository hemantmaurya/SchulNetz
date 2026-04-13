import express from "express";
import { viewAttendance } from "../controllers/View_Attendance.controller.js";
import { getAttendanceAll } from "../controllers/View_Attendance.controller.js";
import { validateAttendanceQuery } from "../middlewares/validateView.js";

const router = express.Router();

// View Attendance Route
router.get("/view", viewAttendance);
router.get("/", validateAttendanceQuery, getAttendanceAll);

export default router;