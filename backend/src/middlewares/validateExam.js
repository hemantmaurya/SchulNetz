import Joi from "joi";

const examSchema = Joi.object({
    course_id: Joi.number().integer().required(),
    semester_id: Joi.number().integer().required(),
    exam_name: Joi.string().min(3).max(100).required(),
    academic_year: Joi.string().pattern(/^\d{4}-\d{2}$/).required().messages({
        "string.pattern.base": "Academic year must be in format YYYY-YY (e.g. 2025-26)"
    }),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    exam_type: Joi.string().valid('Theory', 'Practical', 'Viva', 'Online').required()
});

export const validateExam = (req, res, next) => {
    const { error } = examSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};