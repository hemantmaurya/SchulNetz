import express from "express";
import {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent
} from "../controllers/student.controller.js";

import { validateStudent } from "../middlewares/validate.js";

const router = express.Router();

// CREATE (with validation)
router.post("/", validateStudent, createStudent);

// READ (list with pagination)
router.get("/", getAllStudents);

// UPDATE (with validation)
router.put("/:id", validateStudent, updateStudent);

// DELETE
router.delete("/:id", deleteStudent);

export default router;