import Joi from "joi";

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  password: Joi.string(),
  email: Joi.string().email(),
  //   password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const validateSignUp = (user) => {
  return schema.validate(user);
};
