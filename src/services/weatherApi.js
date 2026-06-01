import axios from 'axios';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_URL = 'https://api.open-meteo.com/v1';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1';

export async function searchCity(query) {
  const res = await axios.get(`${GEO_URL}/search`, {
    params: { name: query, count: 8, language: 'en', format: 'json' },
  });
  return res.data.results || [];
}

export async function getWeatherByCoords(lat, lon, cityName = '') {
  const [weatherRes, aqiRes] = await Promise.allSettled([
    axios.get(`${WEATHER_URL}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: [
          'temperature_2m','relative_humidity_2m','apparent_temperature',
          'weather_code','wind_speed_10m','wind_direction_10m',
          'surface_pressure','visibility','uv_index','precipitation_probability',
          'is_day',
        ].join(','),
        hourly: [
          'temperature_2m','precipitation_probability','wind_speed_10m',
          'weather_code','relative_humidity_2m',
        ].join(','),
        daily: [
          'weather_code','temperature_2m_max','temperature_2m_min',
          'precipitation_probability_max','uv_index_max','sunrise','sunset',
          'wind_speed_10m_max',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
      },
    }),
    axios.get(`${AQI_URL}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: ['pm2_5','pm10','european_aqi','us_aqi','dust','pollen_birch'].join(','),
        hourly: ['pm2_5','european_aqi'].join(','),
        forecast_days: 1,
      },
    }),
  ]);

  const weather = weatherRes.status === 'fulfilled' ? weatherRes.value.data : null;
  const aqi = aqiRes.status === 'fulfilled' ? aqiRes.value.data : null;

  if (!weather) throw new Error('Failed to fetch weather data');

  return normalizeWeatherData(weather, aqi, cityName, lat, lon);
}

function normalizeWeatherData(w, aqi, cityName, lat, lon) {
  const c = w.current;
  const d = w.daily;
  const h = w.hourly;

  const now = new Date();
  const currentHourIdx = h.time.findIndex(t => new Date(t) >= now);
  const startIdx = currentHourIdx >= 0 ? currentHourIdx : 0;

  // Hourly: next 24 hours
  const hourly = [];
  for (let i = startIdx; i < Math.min(startIdx + 24, h.time.length); i++) {
    hourly.push({
      time: h.time[i],
      temp: Math.round(h.temperature_2m[i]),
      rainProb: h.precipitation_probability[i] ?? 0,
      windSpeed: Math.round((h.wind_speed_10m[i] ?? 0)),
      weatherCode: h.weather_code[i],
      humidity: h.relative_humidity_2m[i],
    });
  }

  // Daily
  const daily = d.time.map((t, i) => ({
    date: t,
    high: Math.round(d.temperature_2m_max[i]),
    low: Math.round(d.temperature_2m_min[i]),
    weatherCode: d.weather_code[i],
    rainProb: d.precipitation_probability_max[i] ?? 0,
    uvMax: d.uv_index_max[i] ?? 0,
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    windMax: Math.round(d.wind_speed_10m_max[i] ?? 0),
  }));

  // AQI
  const aqiCurrent = aqi?.current ?? {};
  const aqiValue = aqiCurrent.european_aqi ?? aqiCurrent.us_aqi ?? null;
  const pm25 = aqiCurrent.pm2_5 ?? null;
  const pollen = aqiCurrent.pollen_birch ?? null;

  return {
    city: cityName,
    lat,
    lon,
    timezone: w.timezone,
    current: {
      temp: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      windSpeed: Math.round(c.wind_speed_10m),
      windDir: c.wind_direction_10m,
      pressure: Math.round(c.surface_pressure),
      visibility: Math.round((c.visibility ?? 10000) / 1000),
      uvIndex: c.uv_index ?? 0,
      rainProb: c.precipitation_probability ?? 0,
      weatherCode: c.weather_code,
      isDay: c.is_day,
      sunrise: daily[0]?.sunrise,
      sunset: daily[0]?.sunset,
    },
    hourly,
    daily,
    aqi: {
      value: aqiValue,
      pm25,
      pollen,
      category: getAQICategory(aqiValue),
    },
  };
}

function getAQICategory(value) {
  if (value === null) return 'Unknown';
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  if (value <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getWeatherInfo(code, isDay = 1) {
  const map = {
    0:  { label: 'Clear Sky',        emoji: isDay ? '☀️' : '🌙', bg: isDay ? 'sunny' : 'night' },
    1:  { label: 'Mainly Clear',     emoji: isDay ? '🌤️' : '🌙', bg: isDay ? 'sunny' : 'night' },
    2:  { label: 'Partly Cloudy',    emoji: '⛅',                 bg: 'cloudy' },
    3:  { label: 'Overcast',         emoji: '☁️',                 bg: 'cloudy' },
    45: { label: 'Foggy',            emoji: '🌫️',                bg: 'cloudy' },
    48: { label: 'Icy Fog',          emoji: '🌫️',                bg: 'cloudy' },
    51: { label: 'Light Drizzle',    emoji: '🌦️',                bg: 'rainy' },
    53: { label: 'Drizzle',          emoji: '🌦️',                bg: 'rainy' },
    55: { label: 'Heavy Drizzle',    emoji: '🌧️',                bg: 'rainy' },
    61: { label: 'Slight Rain',      emoji: '🌧️',                bg: 'rainy' },
    63: { label: 'Moderate Rain',    emoji: '🌧️',                bg: 'rainy' },
    65: { label: 'Heavy Rain',       emoji: '🌧️',                bg: 'rainy' },
    71: { label: 'Light Snow',       emoji: '🌨️',                bg: 'snow' },
    73: { label: 'Moderate Snow',    emoji: '❄️',                 bg: 'snow' },
    75: { label: 'Heavy Snow',       emoji: '❄️',                 bg: 'snow' },
    77: { label: 'Snow Grains',      emoji: '🌨️',                bg: 'snow' },
    80: { label: 'Rain Showers',     emoji: '🌦️',                bg: 'rainy' },
    81: { label: 'Rain Showers',     emoji: '🌧️',                bg: 'rainy' },
    82: { label: 'Violent Showers',  emoji: '⛈️',                bg: 'stormy' },
    85: { label: 'Snow Showers',     emoji: '🌨️',                bg: 'snow' },
    86: { label: 'Heavy Snow Showers',emoji:'❄️',                bg: 'snow' },
    95: { label: 'Thunderstorm',     emoji: '⛈️',                bg: 'stormy' },
    96: { label: 'Thunderstorm + Hail',emoji:'🌩️',              bg: 'stormy' },
    99: { label: 'Thunderstorm + Heavy Hail',emoji:'⛈️',        bg: 'stormy' },
  };
  return map[code] ?? { label: 'Unknown', emoji: '🌡️', bg: 'cloudy' };
}

export function getBgConfig(bgType) {
  const configs = {
    sunny:  { from: '#f59e0b', via: '#f97316', to: '#ef4444', orb1: '#fbbf24', orb2: '#fb923c' },
    night:  { from: '#0f172a', via: '#1e1b4b', to: '#312e81', orb1: '#4338ca', orb2: '#6d28d9' },
    cloudy: { from: '#374151', via: '#4b5563', to: '#6b7280', orb1: '#9ca3af', orb2: '#6b7280' },
    rainy:  { from: '#1e3a5f', via: '#1d4ed8', to: '#1e40af', orb1: '#3b82f6', orb2: '#60a5fa' },
    stormy: { from: '#111827', via: '#1f2937', to: '#374151', orb1: '#6366f1', orb2: '#8b5cf6' },
    snow:   { from: '#bfdbfe', via: '#dbeafe', to: '#eff6ff', orb1: '#93c5fd', orb2: '#bfdbfe' },
  };
  return configs[bgType] ?? configs.cloudy;
}
