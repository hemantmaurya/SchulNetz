
import express from "express";
import {
    createAttendanceMaster,
    getAllAttendanceMasters,
    getAttendanceMasterById,
    updateAttendanceMaster,
    deleteAttendanceMaster
} from "../controllers/attendance_master.controller.js";

const router = express.Router();

router.post("/", createAttendanceMaster);                    // Create Master
router.get("/", getAllAttendanceMasters);                    // List all
router.get("/:id", getAttendanceMasterById);                 // Get one
router.put("/:id", updateAttendanceMaster);                  // Update
router.delete("/:id", deleteAttendanceMaster);               // Soft Delete

export default router;