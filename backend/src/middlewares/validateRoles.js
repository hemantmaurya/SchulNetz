import Joi from "joi";

// Roles Schema
const roleSchema = Joi.object({
  role_name: Joi.string()
    .min(3)
    .max(50)
    .required()
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

// Export middleware
export const validateRole = validate(roleSchema);
