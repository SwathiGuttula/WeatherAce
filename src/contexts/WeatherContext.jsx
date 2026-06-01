import React, { createContext, useContext, useState, useCallback } from 'react';
import { getWeatherByCoords, searchCity } from '../services/weatherApi';
import { saveRecentSearch } from '../utils/helpers';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // C or F

  const fetchWeather = useCallback(async (lat, lon, cityName) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCoords(lat, lon, cityName);
      setWeather(data);
      saveRecentSearch({ name: cityName, lat, lon });
    } catch (e) {
      setError(e.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchCity(query);
      if (!results.length) throw new Error('City not found');
      const city = results[0];
      const name = [city.name, city.country].filter(Boolean).join(', ');
      await fetchWeather(city.latitude, city.longitude, name);
    } catch (e) {
      setError(e.message || 'City not found');
      setLoading(false);
    }
  }, [fetchWeather]);

  const convertTemp = useCallback((celsius) => {
    if (unit === 'F') return Math.round(celsius * 9 / 5 + 32);
    return celsius;
  }, [unit]);

  const tempLabel = unit === 'F' ? '°F' : '°C';

  return (
    <WeatherContext.Provider value={{
      weather, loading, error,
      fetchWeather, fetchByCity,
      unit, setUnit, convertTemp, tempLabel,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be inside WeatherProvider');
  return ctx;
}
