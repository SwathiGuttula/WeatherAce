import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { getWeatherInfo } from '../services/weatherApi';
import { formatTime, getWindDirection, isFavorite, saveFavorite, removeFavorite } from '../utils/helpers';

export default function WeatherCard() {
  const { weather, convertTemp, tempLabel } = useWeather();
  const [fav, setFav] = React.useState(false);

  React.useEffect(() => {
    if (weather) setFav(isFavorite(weather.city));
  }, [weather]);

  if (!weather) return null;
  const { current, city } = weather;
  const info = getWeatherInfo(current.weatherCode, current.isDay);

  const toggleFav = () => {
    if (fav) {
      removeFavorite(city);
      setFav(false);
    } else {
      saveFavorite({ name: city, lat: weather.lat, lon: weather.lon });
      setFav(true);
    }
  };

  return (
    <div className="glass card-shine animate-slide-up">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-white/60 text-sm font-mono mb-1">
              <span>📍</span>
              <span>{city || 'Unknown Location'}</span>
            </div>
            <div className="text-white/40 text-xs">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <button
            onClick={toggleFav}
            className={`text-2xl transition-all duration-300 hover:scale-125 ${fav ? 'animate-pulse-slow' : 'opacity-50 hover:opacity-100'}`}
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Main temp */}
        <div className="flex items-center gap-6 mb-8">
          <div
            className="text-8xl md:text-9xl animate-float inline-block"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))' }}
          >
            {info.emoji}
          </div>
          <div>
            <div
              className="font-display font-bold leading-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(4rem, 10vw, 6rem)',
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {convertTemp(current.temp)}{tempLabel}
            </div>
            <div className="text-white/60 text-lg font-body mt-1">{info.label}</div>
            <div className="text-white/40 text-sm mt-1">
              Feels like {convertTemp(current.feelsLike)}{tempLabel}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatItem icon="💧" label="Humidity" value={`${current.humidity}%`} />
          <StatItem icon="💨" label="Wind" value={`${current.windSpeed} km/h ${getWindDirection(current.windDir)}`} />
          <StatItem icon="👁️" label="Visibility" value={`${current.visibility} km`} />
          <StatItem icon="🌡️" label="Pressure" value={`${current.pressure} hPa`} />
          <StatItem icon="🌅" label="Sunrise" value={formatTime(current.sunrise)} />
          <StatItem icon="🌇" label="Sunset" value={formatTime(current.sunset)} />
          <StatItem icon="☀️" label="UV Index" value={current.uvIndex?.toFixed(1) ?? '--'} />
          <StatItem icon="🌂" label="Rain Prob" value={`${current.rainProb}%`} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="glass-hover glass p-3 rounded-xl text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-white/40 text-xs font-mono uppercase tracking-wide">{label}</div>
      <div className="text-white font-medium text-sm mt-1">{value}</div>
    </div>
  );
}
