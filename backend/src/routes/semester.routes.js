import express from "express";
import { 
    createSemester, 
    getAllSemesters, 
    getSemesterById, 
    updateSemester, 
    deleteSemester 
} from "../controllers/semester.controller.js";

import { 
    validateCreateSemester, 
    validateUpdateSemester 
} from "../middlewares/validateSemester.js";

const router = express.Router();

// Semester Routes
router.post("/", validateCreateSemester, createSemester);        // Create Semester
router.get("/", getAllSemesters);                                // Get All Semesters
router.get("/:id", getSemesterById);                             // Get Semester by ID
router.put("/:id", validateUpdateSemester, updateSemester);      // Update Semester
router.delete("/:id", deleteSemester);                           // Soft Delete Semester

export default router;