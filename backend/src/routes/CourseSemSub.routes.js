import express from "express";
import {
    getCourses,
    getSemestersByCourse,
    getSubjectsByCourseSemester
} from "../controllers/CourseSemSub.controller.js";

import {
    validateCourseId,
    validateCourseSemAssignId
} from "../middlewares/validateCourceSemSub.js";

const router = express.Router();

router.get("/courses", getCourses);

router.get(
    "/semesters/:courseId",
    validateCourseId,
    getSemestersByCourse
);

router.get(
    "/subjects/:courseSemAssignId",
    validateCourseSemAssignId,
    getSubjectsByCourseSemester
);

export default router;