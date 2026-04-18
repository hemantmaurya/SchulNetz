import express from "express";
import { getAttendanceAll } from "../controllers/View_Attendance.controller.js";
import { validateAttendanceQuery } from "../middlewares/validateView.js";

const router = express.Router();

router.get("/", validateAttendanceQuery, getAttendanceAll);

export default router;