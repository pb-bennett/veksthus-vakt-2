const Joi = require('joi');

const userValidationSchema = Joi.object({
  username: Joi.string().min(5).max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$')) // Require uppercase, lowercase, and digit
    .message(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    )
    .required(),
  roleId: Joi.number().integer().required(),
});

module.exports = { userValidationSchema };
