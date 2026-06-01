import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WeatherProvider } from './contexts/WeatherContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { useWeather } from './contexts/WeatherContext';
import { getBgConfig, getWeatherInfo } from './services/weatherApi';

function AppBackground({ children }) {
  const { weather } = useWeather();
  const bgType = weather
    ? getWeatherInfo(weather.current.weatherCode, weather.current.isDay).bg
    : 'night';
  const cfg = getBgConfig(bgType);

  return (
    <div
      className="min-h-screen relative transition-all duration-1000"
      style={{
        background: `linear-gradient(135deg, ${cfg.from} 0%, ${cfg.via} 50%, ${cfg.to} 100%)`,
      }}
    >
      {/* Ambient orbs */}
      <div
        className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none animate-pulse-slow"
        style={{ background: cfg.orb1 }}
      />
      <div
        className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none animate-float"
        style={{ background: cfg.orb2 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <WeatherProvider>
        <AppBackground>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </AppBackground>
      </WeatherProvider>
    </Router>
  );
}
