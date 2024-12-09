const express = require('express');
const router = express.Router();
const { authMiddleWare } = require('../middleware/authMiddleWare');
const {
  validateTemperatureReading,
} = require('../middleware/validationMiddleware');

const {
  createTemperatureReading,
  getTemperatureReadings,
} = require('../controllers/readingsController');

router
  .get('/', authMiddleWare, getTemperatureReadings)
  .post('/', validateTemperatureReading, createTemperatureReading);

module.exports = router;
