const Joi = require('joi');

const userUnitValidation = Joi.object({
  unitId: Joi.string().uuid().required(),
  userId: Joi.number().integer().positive().required(),
  role: Joi.string()
    .valid('admin', 'read', 'write') // or other roles you want to support
    .default('read'),
});

module.exports = { userUnitValidation };
