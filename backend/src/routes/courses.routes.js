import express from "express";
import {
    coursesSave,
    getcoursesAll,
    getcoursesAllSimple,
    getcoursesById,
    coursesUpdate
} from "../controllers/CoursesController.js";

const router = express.Router();

// ======================== ROUTES ========================

router.post("/", coursesSave);                    // Create new course
router.get("/", getcoursesAll);                   // Get all courses with pagination
router.get("/simple", getcoursesAllSimple);       // Get all courses without pagination
router.get("/:id", getcoursesById);               // Get single course by ID
router.put("/:id", coursesUpdate);                // Update course

export default router;
