import Joi from "joi";

const schema = Joi.object({
  userName: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string.",
    "string.empty": "Username cannot be empty.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username must not exceed 30 characters.",
    "any.required": "Username is required.",
  }),
  firstName: Joi.string().messages({
    "string.base": "First name must be a string.",
    "string.empty": "First name cannot be empty.",
  }),
  lastName: Joi.string().messages({
    "string.base": "Last name must be a string.",
    "string.empty": "Last name cannot be empty.",
  }),
  password: Joi.string().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password cannot be empty.",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),
});

export const validateSignUp = (user) => {
  return schema.validate(user);
};
