import express from 'express';
import {
    submitResult,
    getResultsByExam,
    getStudentResults,
    updateResult
} from '../controllers/resultController.js';

const router = express.Router();

router.post('/', submitResult);
router.get('/exam/:exam_id', getResultsByExam);
router.get('/student/:student_id', getStudentResults);
router.put('/:id', updateResult);

export default router;