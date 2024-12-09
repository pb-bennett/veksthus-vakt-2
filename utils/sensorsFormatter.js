const formatSensorData = (sensors) => {
  const combinedReadings = sensors
    .filter((sensor) => sensor.is_active)
    .flatMap((sensor) => {
      return sensor.TemperatureReadings.map((reading) => ({
        readingId: reading.reading_id,
        temperature: parseFloat(reading.temperature),
        readingTime: roundToInterval(reading.createdAt),
        sensorId: sensor.sensor_id,
        sensorName: sensor.sensor_name,
        sensorLocation: sensor.location,
      }));
    });

  const sortedReadings = combinedReadings.sort(
    (a, b) => new Date(b.readingTime) - new Date(a.readingTime)
  );

  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  twentyFourHoursAgo.setMilliseconds(0);

  const readingsForLast24Hours = sortedReadings.filter(
    (reading) => new Date(reading.readingTime) >= twentyFourHoursAgo
  );

  const sensorDetails = sensors.map((sensor) => {
    const sensorReadings = readingsForLast24Hours.filter(
      (reading) => reading.sensorId === sensor.sensor_id
    );
    if (sensor.location === 'soil') console.log(sensorReadings);

    const latestReading = sensor.TemperatureReadings[
      sensor.TemperatureReadings.length - 1
    ]
      ? {
          temperature: parseFloat(
            sensor.TemperatureReadings[
              sensor.TemperatureReadings.length - 1
            ].temperature
          ),
          readingTime:
            sensor.TemperatureReadings[
              sensor.TemperatureReadings.length - 1
            ].createdAt,
        }
      : null;

    const maxTemp = sensorReadings.reduce(
      (max, reading) => Math.max(max, reading.temperature),
      -Infinity
    );
    const minTemp = sensorReadings.reduce(
      (min, reading) => Math.min(min, reading.temperature),
      Infinity
    );
    const avgTemp =
      sensorReadings.length > 0
        ? parseFloat(
            (
              sensorReadings.reduce(
                (total, reading) => total + reading.temperature,
                0
              ) / sensorReadings.length
            ).toFixed(2)
          )
        : null;

    return {
      sensorId: sensor.sensor_id,
      sensorName: sensor.sensor_name,
      sensorLocation: sensor.location,
      sensorLatestTemperature: latestReading,
      sensorMaxTemperatureLast24Hours: maxTemp,
      sensorMinTemperatureLast24Hours: minTemp,
      sensorAvgTemperatureLast24Hours: avgTemp,
    };
  });

  const timeSeriesData = [];

  sortedReadings.forEach((reading) => {
    const existingTimeData = timeSeriesData.find(
      (item) => item.time === reading.readingTime
    );
    if (existingTimeData) {
      existingTimeData[reading.sensorId] = reading.temperature;
    } else {
      timeSeriesData.push({
        time: reading.readingTime,
        [reading.sensorId]: reading.temperature,
      });
    }
  });

  return {
    sensorDetails,
    timeSeriesData,
  };
};

const roundToInterval = (date, interval = 15) => {
  const rounded = new Date(date);
  const minutes = rounded.getMinutes();
  const roundedMinutes = Math.round(minutes / interval) * interval;
  if (roundedMinutes >= 60) {
    rounded.setHours(rounded.getHours() + 1);
    rounded.setMinutes(roundedMinutes - 60);
  } else {
    rounded.setMinutes(roundedMinutes);
  }
  rounded.setSeconds(0);
  rounded.setMilliseconds(0);

  return rounded.toISOString().slice(0, -5) + 'Z';
};

module.exports = { formatSensorData };
