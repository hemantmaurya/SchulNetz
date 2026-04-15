// subject.routes.js
import express from 'express';
import {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
} from '../controllers/subject.controller.js';

import {
    validateSubject,
    validateSubjectId
} from '../middlewares/validateSubject.js';

const router = express.Router();

// Routes
router.post('/', validateSubject, createSubject);                    // Create
router.get('/', getAllSubjects);                                     // Get All (with pagination)
router.get('/:id', validateSubjectId, getSubjectById);              // Get One
router.put('/:id', validateSubjectId, validateSubject, updateSubject); // Update
router.delete('/:id', validateSubjectId, deleteSubject);            // Soft Delete

export default router;