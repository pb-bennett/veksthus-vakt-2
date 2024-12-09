const Sequelize = require('sequelize');
const NodeCache = require('node-cache');
const { Op } = require('sequelize');

const { Unit, Sensor, TemperatureReading } = require('../models');
const { fetchWeatherWithCache } = require('../utils/weatherUtils');

const {
  roundToInterval,
  formatNivoData,
  formatRechartData,
} = require('../utils/readingsFormatter');
const {
  errorCatchHandler,
  errorThrowHandler,
} = require('../utils/errorHandler');

const { formatSensorData } = require('../utils/sensorsFormatter');

const makeHandshake = async (req, res) => {
  try {
    // const format = req.query.format;
    const unitId = req.params.id;

    const nDaysBack = nDaysAgo(30);

    const unit = await Unit.findByPk(unitId, {
      include: [
        {
          model: Sensor,
          include: [
            {
              model: TemperatureReading,
              where: {
                createdAt: {
                  [Op.gte]: nDaysBack,
                },
              },
              attributes: [
                'reading_id',
                'temperature',
                'createdAt',
                'sensor_id',
              ],
              order: [['createdAt', 'DESC']],
            },
          ],
        },
      ],
    });
    // console.dir(unit.Sensors[0].TemperatureReadings[0], {
    //   depth: null,
    // });
    if (!unit) {
      errorThrowHandler('Unit not found', 404);
    }

    const unitCoords = { lat: unit.latitude, lon: unit.longitude };
    const weatherData = await fetchWeatherWithCache(unitCoords);

    // const location = await getTownOrArea(
    //   unit.latitude,
    //   unit.longitude
    // );

    const sensors = formatSensorData(unit.Sensors);

    const unitData = {
      unitId: unit.unit_id,
      unitName: unit.unit_name,
      unitLocation: unit.location,
      location: weatherData.city.name,
      unitCreatedAt: unit.createdAt,
      unitUpdatedAt: unit.updatedAt,
      weatherData,
      sensors,
    };

    res.status(200).json({ status: 'success', data: unitData });
  } catch (error) {
    console.error(error.message, error.stack);
    errorCatchHandler(res, error);
  }
};

const nDaysAgo = (n = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - n); // Subtract 30 days
  return date;
};

// const getTownOrArea = async function (latitude, longitude) {
//   const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&addressdetails=1`;
//   const response = await fetch(url);
//   const data = await response.json();
//   const { city, town, village, county } = data.address;
//   return city || town || village || county || 'Unknown area';
// };

module.exports = { makeHandshake };
