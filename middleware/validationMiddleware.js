const {
  userValidationSchema,
} = require('../validations/userValidation');
const {
  userUnitValidation,
} = require('../validations/userUnitValidation');
const {
  unitValidationSchema,
} = require('../validations/unitValidation');

const temperatureReadingValidation = require('../validations/temperatureReadingValidation');

const {
  errorThrowHandler,
  errorCatchHandler,
} = require('../utils/errorHandler');

const validateUser = (req, res, next) => {
  try {
    const { error } = userValidationSchema.validate(req.body);

    if (error) return errorThrowHandler(error.message, 400);

    next();
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

const validateUserUnit = (req, res, next) => {
  try {
    const { error } = userUnitValidation.validate(req.body);

    if (error) return errorThrowHandler(error.message, 400);

    next();
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

const validateUnit = (req, res, next) => {
  try {
    const { error } = unitValidationSchema.validate(req.body);

    if (error) return errorThrowHandler(error.message, 400);

    next();
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

const validateTemperatureReading = async (req, res, next) => {
  // console.log(req.body); // Debugging log for request body

  try {
    // Validate the request body using Joi schema
    const error = await temperatureReadingValidation.validateAsync(
      req.body,
      {
        abortEarly: false, // Collect all errors instead of stopping at the first one
      }
    );

    next(); // Proceed to the next middleware if validation passes
  } catch (error) {
    try {
      if (error.details) {
        const validationErrors = error.details.map(
          (detail) => detail.message
        );
        return errorThrowHandler(validationErrors, 400);
      } else {
        return errorThrowHandler(error.message, 400);
      }
    } catch (error) {
      errorCatchHandler(res, error);
    }
  }
};

module.exports = {
  validateUser,
  validateUserUnit,
  validateTemperatureReading,
  validateUnit,
};
