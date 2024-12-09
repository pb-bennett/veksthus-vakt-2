const Joi = require('joi');

// Schema for a single reading
const readingSchema = Joi.object({
  sensorId: Joi.string().max(50).required(), // Matches the sensor_id field
  temperature: Joi.number()
    .precision(2)
    .min(-99.99)
    .max(999.99)
    .required(), // Matches DECIMAL(5, 2)
  timestamp: Joi.date().iso().required(), // ISO 8601 timestamp
});

// Schema for the entire request body
const temperatureReadingValidation = Joi.object({
  unitId: Joi.string().guid({ version: 'uuidv4' }).required(), // Ensure unitId is a valid UUIDv4
  apiKey: Joi.string()
    .min(50) // Minimum length for the API key; adjust based on your constraints
    .max(255)
    .required(), // Matches api_key_hashed length constraints
  readings: Joi.array()
    .items(readingSchema) // Validates each element of the array against readingSchema
    .min(1) // Ensures at least one reading is provided
    .required(), // Readings array is required
});

module.exports = temperatureReadingValidation;
