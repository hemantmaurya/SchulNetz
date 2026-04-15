import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses.controller.js';
import { validateCourse } from '../middlewares/courseValidation.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', validateCourse, createCourse);
router.put('/:id', validateCourse, updateCourse);
router.delete('/:id', deleteCourse);

export default router;