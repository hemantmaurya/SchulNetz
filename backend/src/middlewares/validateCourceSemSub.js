import Joi from "joi";


// ================= VALIDATION SCHEMAS =================

const courseIdSchema = Joi.object({
    courseId: Joi.number().integer().positive().required().messages({
        "number.base": "Course ID must be a number",
        "number.integer": "Course ID must be an integer",
        "number.positive": "Course ID must be positive",
        "any.required": "Course ID is required"
    })
});

const courseSemAssignIdSchema = Joi.object({
    courseSemAssignId: Joi.number().integer().positive().required().messages({
        "number.base": "Course Semester Assign ID must be a number",
        "number.integer": "Course Semester Assign ID must be an integer",
        "number.positive": "Course Semester Assign ID must be positive",
        "any.required": "Course Semester Assign ID is required"
    })
});


// ================= GENERIC VALIDATOR =================

const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
    };
};


// ================= EXPORT MIDDLEWARES =================

export const validateCourseId = validateParams(courseIdSchema);

export const validateCourseSemAssignId = validateParams(courseSemAssignIdSchema);