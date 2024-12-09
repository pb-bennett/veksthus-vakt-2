const argon2 = require('argon2');
const Sequelize = require('sequelize');

const { Unit, Sensor, TemperatureReading } = require('../models');
const {
  roundToInterval,
  formatNivoData,
  formatRechartData,
} = require('../utils/readingsFormatter');
const {
  errorCatchHandler,
  errorThrowHandler,
} = require('../utils/errorHandler');

const getTemperatureReadings = async (req, res) => {
  try {
    const { start, end, sensors } = req.query;
    let whereObj = {};

    if (start) {
      whereObj.reading_time = {
        [Sequelize.Op.gte]: new Date(parseInt(start, 10) * 1000),
      };
    }
    if (end) {
      whereObj.reading_time = {
        ...whereObj.reading_time, // Preserve the previous condition
        [Sequelize.Op.lte]: new Date(parseInt(end, 10) * 1000),
      };
    }
    if (sensors) {
      const sensorsArr = sensors.split(',');
      whereObj.sensor_id = {
        [Sequelize.Op.in]: sensorsArr,
      };
    }

    const readings = await TemperatureReading.findAll({
      where: whereObj,
      order: [
        ['createdAt', 'DESC'], // Order by 'createdAt' in ascending order
      ],
    });
    if (readings.length === 0)
      errorThrowHandler('No readings found', 404);
    const cleanReadings = readings.map((reading) => ({
      readingId: reading.reading_id,
      temperature: reading.temperature,
      readingTime: roundToInterval(reading.reading_time, true),
      sensorId: reading.sensor_id,
    }));
    const groupedData = {}; // or new Map() if you prefer

    cleanReadings.forEach((item) => {
      const { sensorId, readingTime, temperature } = item;

      if (!groupedData[sensorId]) {
        groupedData[sensorId] = []; // Initialize an array if not already present
      }

      groupedData[sensorId].push({
        time: readingTime,
        temp: temperature,
      });
    });
    res.status(200).json({ status: 'success', data: groupedData });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

const getTemperatureReadingsFormatted = async (req, res) => {
  try {
    const { start, end, sensors, format } = req.query;
    let whereObj = {};

    if (start) {
      whereObj.reading_time = {
        [Sequelize.Op.gte]: new Date(parseInt(start, 10) * 1000),
      };
    }
    if (end) {
      whereObj.reading_time = {
        ...whereObj.reading_time, // Preserve the previous condition
        [Sequelize.Op.lte]: new Date(parseInt(end, 10) * 1000),
      };
    }
    if (sensors) {
      const sensorsArr = sensors.split(',');
      whereObj.sensor_id = {
        [Sequelize.Op.in]: sensorsArr,
      };
    }
    const sensorData = await Sensor.findAll({
      attributes: [
        ['location', 'location'],
        ['sensor_id', 'sensorId'],
      ],
      where: {
        sensor_id: {
          [Sequelize.Op.in]: sensors.split(','),
        },
      },
    });
    const sensorsArr = sensorData.map((sensor) => {
      return {
        sensorId: sensor.dataValues.sensorId,
        location: sensor.dataValues.location,
      };
    });
    const readings = await TemperatureReading.findAll({
      attributes: [
        ['reading_id', 'readingId'],
        ['temperature', 'temperature'],
        ['createdAt', 'readingTime'],
        ['sensor_id', 'sensorId'],
      ],

      where: whereObj,
    });
    let finalResults;

    if (format === 'rechart' || !format)
      finalResults = formatRechartData(readings);

    if (format === 'nivo') finalResults = formatNivoData(readings);
    if (finalResults.length === 0) {
      return res.status(404).json({
        status: 'success',
        message: 'No readings found for the specified parameters.',
      });
    }
    res.status(200).json({
      status: 'success',
      sensors: sensorsArr,
      data: finalResults,
    });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

const createTemperatureReading = async (req, res) => {
  try {
    const { readings, unitId, apiKey } = req.body;
    console.log(readings, unitId, apiKey);
    const unit = await Unit.findByPk(unitId);
    if (!unit) {
      throw errorThrowHandler('Unit not found', 404);
    }
    const apiKeyCheck = await argon2.verify(
      unit.api_key_hashed,
      apiKey
    );
    if (!apiKeyCheck) {
      throw errorThrowHandler('Invalid API key', 401);
    }
    for (const reading of readings) {
      const { temperature, timestamp, sensorId } = reading;
      const time = new Date(timestamp);
      const sensor = await Sensor.findByPk(sensorId);
      console.log(timestamp, sensorId, temperature);
      if (!sensor) {
        const newSensor = await Sensor.create({
          sensor_id: sensorId,
          unit_id: unitId,
        });
      }

      const newTemperatureReading = await TemperatureReading.create({
        temperature,
        reading_time: time,
        sensor_id: sensorId,
      });
    }
    console.log(
      'Readings created successfully',
      new Date().toISOString()
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    errorCatchHandler(res, error);
  }
};

const createHumidityReading = async (req, res) => {
  const { humidity, reading_time, sensor_id } = req.body;
  try {
    const newHumidityReading =
      await humidityReadingService.createHumidityReading({
        humidity,
        reading_time,
        sensor_id,
      });
    res.status(201).json(newHumidityReading);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTemperatureReading,
  createHumidityReading,
  getTemperatureReadingsFormatted,
  getTemperatureReadings,
};
