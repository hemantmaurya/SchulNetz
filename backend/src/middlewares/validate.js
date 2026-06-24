import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    full_name: Joi.string().max(100),
    role: Joi.string().valid('admin', 'teacher', 'student', 'parent').default('user')
});

const studentSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    course_id: Joi.number().integer().required(),
    branch_id: Joi.number().integer().required()
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    };
};

export const validateLogin = validate(loginSchema);
export const validateRegister = validate(registerSchema)
export const validateStudent = validate(studentSchema);