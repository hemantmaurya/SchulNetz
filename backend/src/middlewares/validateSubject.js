// subject.middleware.js
import Joi from 'joi';

const subjectSchema = Joi.object({
    subject_code: Joi.string().trim().max(20).required()
        .messages({ 'string.empty': 'Subject code is required' }),

    subject_name: Joi.string().trim().max(100).required()
        .messages({ 'string.empty': 'Subject name is required' }),

    description: Joi.string().trim().allow('').max(500),

    credits: Joi.number().integer().min(0).max(10).required()
        .messages({ 'number.base': 'Credits must be a number' }),

    subject_type: Joi.string().valid('Theory', 'Practical', 'Both', 'Elective')
        .required()
        .messages({ 'any.only': 'Subject type must be Theory, Practical, Both or Elective' })
});

// Create & Update validation
export const validateSubject = (req, res, next) => {
    const { error } = subjectSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: error.details.map(err => err.message)
        });
    }
    next();
};

// Check ID is valid (for update/delete)
export const validateSubjectId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Subject ID"
        });
    }
    next();
};