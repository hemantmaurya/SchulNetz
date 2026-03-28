import Joi from "joi";

const testingSaveSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters"
    }),
    middleName: Joi.string().min(3).max(50).allow(null, "").optional(),
    lastName: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 3 characters"
    }),
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

export const validateSaveTesting = validate(testingSaveSchema);
