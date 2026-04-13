import express from "express";
import { viewAttendance } from "../controllers/View_Attendance.controller.js";  

const router = express.Router();

// View Attendance Route
router.get("/view", viewAttendance);

export default router;