const roundToInterval = (
  date,
  unixTimestamp = false,
  interval = 15
) => {
  const rounded = new Date(date); // Create a new Date object from the input date
  const minutes = rounded.getMinutes();
  const roundedMinutes = Math.round(minutes / interval) * interval;
  if (roundedMinutes >= 60) {
    rounded.setHours(rounded.getHours() + 1); // Increment hour if minutes exceed 59
    rounded.setMinutes(roundedMinutes - 60); // Set minutes to the overflow amount
  } else {
    rounded.setMinutes(roundedMinutes);
  }
  rounded.setSeconds(0); // Set seconds to 0
  if (unixTimestamp) return Math.floor(rounded.getTime() / 1000);
  return rounded.toISOString(); // Return the rounded date in ISO format
};

// const formatRechartData = (inputReadings) => {
//   const readings = inputReadings[0].dataValues
//     ? inputReadings.map((reading) => reading.dataValues)
//     : inputReadings;
//   const result = {};
//   readings.forEach((reading) => {
//     const roundedTime = roundToInterval(reading.readingTime, 15); // Replace with your rounding logic
//     const sensorId = reading.sensorId;
//     const temperature = reading.temperature;

//     if (!result[roundedTime]) {
//       result[roundedTime] = {};
//     }
//     result[roundedTime][sensorId] = temperature;
//   });

//   // Mapping to include readingTime in the final results
//   const finalResults = Object.entries(result).map(
//     ([readingTime, readings]) => ({
//       readingTime,
//       ...readings,
//     })
//   );
//   return finalResults;
// };

const formatRechartData = (inputReadings) => {
  const readings = inputReadings[0].dataValues
    ? inputReadings.map((reading) => reading.dataValues)
    : inputReadings;

  const result = {}; // This will hold all the readings, grouped by time

  readings.forEach((reading) => {
    const roundedTime = roundToInterval(reading.readingTime, 15); // Round time to nearest interval
    const sensorId = reading.sensorId;
    const temperature = reading.temperature;

    // Initialize the timestamp key if it doesn't exist
    if (!result[roundedTime]) {
      result[roundedTime] = {};
    }

    // Add the sensor's temperature for this timestamp
    result[roundedTime][sensorId] = temperature;
  });

  // Convert the result object into an array of objects with time as the key
  const finalResults = Object.entries(result).map(
    ([readingTime, readings]) => ({
      readingTime,
      ...readings,
    })
  );

  return finalResults;
};

const formatNivoData = (inputReadings) => {
  const readings = inputReadings[0].dataValues
    ? inputReadings.map((reading) => reading.dataValues)
    : inputReadings;
  const result = {};
  readings.forEach((reading) => {
    const sensorId = reading.sensorId;
    const roundedTime = roundToInterval(reading.readingTime, 15);
    const temperature = reading.temperature;

    // Initialize the sensor data if it doesn't exist
    if (!result[sensorId]) {
      result[sensorId] = { id: sensorId, data: [] };
    }

    // Add the data point to the sensor's data array
    result[sensorId].data.push({
      x: roundedTime, // Time rounded to the nearest interval
      y: parseFloat(temperature), // Ensure the temperature is a number
    });
  });

  // Return an array of the results
  return Object.values(result);
};

module.exports = {
  roundToInterval,
  formatRechartData,
  formatNivoData,
};
