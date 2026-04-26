import express from "express";
import { bulkSaveAttendance } from "../controllers/attendanceDetails.controller.js";

const router = express.Router();

// Bulk save attendance
router.post("/bulk", bulkSaveAttendance);

export default router;