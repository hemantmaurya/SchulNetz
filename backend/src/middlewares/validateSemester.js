import Joi from 'joi';

// Create Semester Schema
const createSemesterSchema = Joi.object({
    semester_number: Joi.number().integer().min(1).max(12).required()
        .messages({
            'number.base': 'Semester number must be a number',
            'number.min': 'Semester number must be at least 1',
            'number.max': 'Semester number cannot be more than 12'
        }),

    semester_name: Joi.string().min(3).max(100).required()
        .messages({
            'string.empty': 'Semester name is required',
            'string.min': 'Semester name must be at least 3 characters',
            'string.max': 'Semester name cannot exceed 100 characters'
        }),

    start_date: Joi.date().iso().required()
        .messages({
            'date.base': 'Start date must be a valid date',
            'any.required': 'Start date is required'
        }),

    end_date: Joi.date().iso().min(Joi.ref('start_date')).required()
        .messages({
            'date.base': 'End date must be a valid date',
            'date.min': 'End date must be after or equal to start date',
            'any.required': 'End date is required'
        })
});

// Update Semester Schema (All fields optional except at least one)
const updateSemesterSchema = Joi.object({
    semester_number: Joi.number().integer().min(1).max(12),
    semester_name: Joi.string().min(3).max(100),
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().min(Joi.ref('start_date'))
})
    .min(1) // At least one field must be provided
    .messages({
        'object.min': 'At least one field is required for update'
    });

// Get by ID - No body validation needed, but we can keep for params if needed later

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(detail => detail.message).join(', ')
            });
        }
        next();
    };
};

// Exports
export const validateCreateSemester = validate(createSemesterSchema);
export const validateUpdateSemester = validate(updateSemesterSchema);

export default {
    validateCreateSemester,
    validateUpdateSemester
};