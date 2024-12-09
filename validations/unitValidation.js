const Joi = require('joi');

const unitValidationSchema = Joi.object({
  unitId: Joi.string()
    .guid({ version: 'uuidv4' }) // Ensures the unitId is a valid UUID v4
    .required(), // unitId is required
  unitName: Joi.string()
    .max(100) // Max length of 100 characters for the unit name
    .required(), // unitName is required
  location: Joi.string()
    .max(100) // Max length of 100 characters for the location
    .optional(), // location is optional
  apiKey: Joi.string()
    .max(255) // Max length of 255 characters for the apiKey
    .required(), // apiKey is required
  latitude: Joi.number().precision(6).optional(),
  longitude: Joi.number().precision(6).optional(),
});

module.exports = { unitValidationSchema };
