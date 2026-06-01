import React, { useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import SevenDayForecast from '../components/SevenDayForecast';
import RecommendationCard from '../components/RecommendationCard';
import AQICard from '../components/AQICard';
import WeatherMap from '../components/WeatherMap';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Footer from '../components/Footer';
import { useWeather } from '../contexts/WeatherContext';

export default function Home() {
  const { weather, loading, error, fetchWeather } = useWeather();

  // Default load: Hyderabad
  useEffect(() => {
    if (!weather && !loading) {
      fetchWeather(17.3850, 78.4867, 'Hyderabad, India');
    }
  }, []);

  return (
    <main className="min-h-screen px-4 pb-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero Header */}
        <div className="text-center py-10 animate-fade-in">
          <h1
            className="font-display font-extrabold text-white mb-2"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            WeatherAce
          </h1>
          <p className="text-white/50 text-sm font-mono tracking-wide">
            Smart Weather · Smarter Decisions
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Error */}
        {error && (
          <div className="glass border border-red-400/30 bg-red-500/10 px-5 py-4 rounded-xl mb-6 text-red-300 text-sm flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Content */}
        {!loading && weather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-stagger">
            {/* Left column: main card + recommendations */}
            <div className="lg:col-span-2 space-y-4">
              <WeatherCard />
              <RecommendationCard />
              <ForecastCard />
              <AQICard />
            </div>

            {/* Right column: 7-day + map */}
            <div className="space-y-4">
              <SevenDayForecast />
              <WeatherMap />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !weather && !error && (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-7xl mb-4 animate-float inline-block">🌍</div>
            <div className="text-white/50 text-lg">Search for any city to get started</div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
