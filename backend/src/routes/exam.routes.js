import express from 'express';
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    getSubjectsByExam          // ← Yeh naya import kiya
} from '../controllers/exam.controller.js';

const router = express.Router();

// Exam Routes
router.post('/', createExam);                    // Create new exam
router.get('/', getAllExams);                    // Get all exams with pagination
router.get('/:id', getExamById);                 // Get single exam
router.put('/:id', updateExam);                  // Update exam
router.delete('/:id', deleteExam);               // Soft delete exam

// New Route for fetching subjects of a specific exam
router.get('/:exam_id/subjects', getSubjectsByExam);   // ← Yeh line add ki

export default router;