import Joi from "joi";

const schema = Joi.object({
    eventName: Joi.string().min(3).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    description: Joi.string().allow("", null)
});

export const validateAcademic = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};