const NodeCache = require('node-cache');
const myCache = new NodeCache();

const fetchWeatherData = async (coords) => {
  const { lat, lon } = coords;
  const baseUrl = process.env.OPEN_WEATHER_API_URL;
  const apiKey = process.env.OPEN_WEATHER_API_KEY;
  const url = `${baseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  // const url =
  //   'https://api.openweathermap.org/data/2.5/forecast?lat=59.1459&lon=10.2116&appid=14288dd3fce1a09cac6f40438918618c&units=metric';
  // console.log(url);
  try {
    const response = await fetch(url);
    // console.log('response OK?', response.ok);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${coords}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const fetchWeatherWithCache = async (coords) => {
  const cacheKey = JSON.stringify(coords);
  const cachedData = myCache.get(cacheKey);
  // console.log('Checking cache for', cacheKey);
  // console.log('Cached data:', cachedData);

  if (cachedData) {
    // console.log('Using cached weather data for', cacheKey);
    return cachedData;
  }

  // console.log('Fetching new weather data from API for', cacheKey);

  const weatherData = await fetchWeatherData(coords);
  const formattedWeatherData = groupDataByDayAndPeriod(weatherData);

  const setSuccess = myCache.set(
    cacheKey,
    formattedWeatherData,
    3600
  );
  // console.log('Cache set success:', setSuccess);

  return formattedWeatherData;
};

function getMostFrequentIcon(icons) {
  const frequency = {};

  icons.forEach((icon) => {
    const iconWithoutSuffix = icon.slice(0, -1) + 'd'; // Normalize icon
    frequency[iconWithoutSuffix] =
      (frequency[iconWithoutSuffix] || 0) + 1;
  });

  return Object.entries(frequency).reduce(
    (mostFrequent, [icon, count]) =>
      count > mostFrequent.count ? { icon, count } : mostFrequent,
    { icon: null, count: 0 }
  ).icon;
}

function getMostFrequentDescription(descriptions) {
  const frequency = {};

  descriptions.forEach((description) => {
    frequency[description] = (frequency[description] || 0) + 1;
  });

  return Object.entries(frequency).reduce(
    (mostFrequent, [description, count]) =>
      count > mostFrequent.count
        ? { description, count }
        : mostFrequent,
    { description: null, count: 0 }
  ).description;
}

function groupDataByDayAndPeriod(inputData) {
  const forecastData = inputData.list;
  const cityInfo = inputData.city;
  const currentTime = Date.now() / 1000; // Current timestamp in seconds
  const next24Hours = currentTime + 24 * 60 * 60; // 24 hours from now

  const groupedByDay = {};
  const hourlyForecast = [];

  forecastData.forEach((entry) => {
    const timestamp = entry.dt;
    const day = new Date(timestamp * 1000)
      .toISOString()
      .split('T')[0];
    const period = new Date(timestamp * 1000).getHours();

    // Include only the data within the next 24 hours
    if (timestamp > currentTime && timestamp <= next24Hours) {
      hourlyForecast.push({
        time: new Date(timestamp * 1000).toISOString(),
        period,
        temp: entry.main.temp,
        description: entry.weather[0].description,
        icon: entry.weather[0].icon,
        windSpeed: entry.wind.speed,
        windDeg: entry.wind.deg,
        humidity: entry.main.humidity,
        pressure: entry.main.pressure,
      });
    }

    // Group data by day for the summary
    if (!groupedByDay[day]) {
      groupedByDay[day] = {
        minTemp: entry.main.temp,
        maxTemp: entry.main.temp,
        totalTemp: entry.main.temp,
        count: 1,
        weather: entry.weather[0].description,
        icons: [entry.weather[0].icon],
        descriptions: [entry.weather[0].description],
      };
    } else {
      groupedByDay[day].minTemp = Math.min(
        groupedByDay[day].minTemp,
        entry.main.temp
      );
      groupedByDay[day].maxTemp = Math.max(
        groupedByDay[day].maxTemp,
        entry.main.temp
      );
      groupedByDay[day].totalTemp += entry.main.temp;
      groupedByDay[day].count += 1;
      groupedByDay[day].icons.push(entry.weather[0].icon);
      groupedByDay[day].descriptions.push(
        entry.weather[0].description
      );
    }
  });

  // Calculate the average temperature and most frequent weather data for each day
  for (const day in groupedByDay) {
    const { icons, descriptions, totalTemp, count } =
      groupedByDay[day];
    groupedByDay[day].icon = getMostFrequentIcon(icons);
    groupedByDay[day].weather =
      getMostFrequentDescription(descriptions);
    groupedByDay[day].avgTemp = totalTemp / count;
  }

  // Clean up the extra fields
  for (const day in groupedByDay) {
    delete groupedByDay[day].icons;
    delete groupedByDay[day].descriptions;
  }

  // Return the full result with the city info and grouped data
  const result = {
    city: {
      id: cityInfo.id,
      name: cityInfo.name,
      country: cityInfo.country,
      timezone: cityInfo.timezone,
      sunrise: cityInfo.sunrise,
      sunset: cityInfo.sunset,
    },
    groupedByDay,
    hourlyForecast, // Includes only data for the next 24 hours
  };

  return result;
}

module.exports = { fetchWeatherWithCache };
