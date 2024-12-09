const db = require('../models');
const { Sensor, Unit } = require('../models');
const {
  errorThrowHandler,
  errorCatchHandler,
} = require('../utils/errorHandler');

const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({});
    console.log(sensors);
    if (sensors.length === 0) {
      return errorThrowHandler('No sensors found', 404);
    }
    res.status(200).json({
      status: 'success',
      sensorCount: sensors.length,
      data: sensors,
    });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};
const createSensor = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  createSensor,
  getAllSensors,
};
