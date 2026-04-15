import Joi from 'joi';

const courseSaveSchema = Joi.object({
  course_code: Joi.string().max(20).required().messages({
    'string.empty': 'Course code is required'
  }),

  course_name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Course name is required',
    'string.min': 'Course name must be at least 3 characters'
  }),

  description: Joi.string().allow('', null).optional(),

  duration: Joi.number().integer().min(0).required().messages({
    'number.base': 'Duration must be a number',
    'number.min': 'Duration cannot be negative'
  }),

  total_semesters: Joi.number().integer().min(0).required().messages({
    'number.base': 'Total semesters must be a number',
    'number.min': 'Total semesters cannot be negative'
  }),

  credits: Joi.number().integer().min(0).required().messages({
    'number.base': 'Credits must be a number',
    'number.min': 'Credits cannot be negative'
  }),

  course_type: Joi.string().max(20).required().messages({
    'string.empty': 'Course type is required'
  })
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    next();
  };
};

export const validateCourse = validate(courseSaveSchema);