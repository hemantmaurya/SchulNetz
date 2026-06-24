import express from 'express';
import {
    addExamSubject,
    getSubjectsByExam,
    getSubjectsBySemester,
    deleteExamSubject
} from '../controllers/examSubjectController.js';

const router = express.Router();

// Exam Subject Routes
router.post('/', addExamSubject);                    // Add subject to exam
router.get('/exam/:exam_id', getSubjectsByExam);     // Get all subjects of one exam ← Important
router.get('/semester/:semester_id', getSubjectsBySemester);  // For cascading dropdown
router.delete('/:id', deleteExamSubject);            // Delete subject

export default router;