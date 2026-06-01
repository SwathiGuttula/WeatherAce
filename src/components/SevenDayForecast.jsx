import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { getWeatherInfo } from '../services/weatherApi';
import { formatDay, formatDate } from '../utils/helpers';

export default function SevenDayForecast() {
  const { weather, convertTemp, tempLabel } = useWeather();
  if (!weather) return null;

  const { daily } = weather;
  const maxTemp = Math.max(...daily.map(d => d.high));
  const minTemp = Math.min(...daily.map(d => d.low));
  const range = maxTemp - minTemp || 1;

  return (
    <div className="glass card-shine animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="p-5 md:p-6">
        <h2 className="font-display font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          📅 7-Day Forecast
        </h2>
        <p className="text-white/40 text-xs font-mono mb-5">Weekly outlook</p>

        <div className="space-y-2">
          {daily.map((day, i) => {
            const info = getWeatherInfo(day.weatherCode, 1);
            const highPct = ((convertTemp(day.high) - convertTemp(minTemp)) / (convertTemp(maxTemp) - convertTemp(minTemp) || 1)) * 100;
            const lowPct = ((convertTemp(day.low) - convertTemp(minTemp)) / (convertTemp(maxTemp) - convertTemp(minTemp) || 1)) * 100;

            return (
              <div
                key={i}
                className="glass-hover flex items-center gap-3 px-4 py-3 rounded-xl cursor-default"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Day */}
                <div className="w-20 flex-shrink-0">
                  <div className="text-white font-medium text-sm">{formatDay(day.date)}</div>
                  <div className="text-white/40 text-xs">{formatDate(day.date)}</div>
                </div>

                {/* Emoji + condition */}
                <div className="flex items-center gap-2 w-28 flex-shrink-0">
                  <span className="text-xl">{info.emoji}</span>
                  <span className="text-white/60 text-xs leading-tight">{info.label}</span>
                </div>

                {/* Rain */}
                <div className="w-14 flex-shrink-0 text-sky-300 text-xs text-center">
                  💧 {day.rainProb}%
                </div>

                {/* Temp bar */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-white/50 text-xs w-10 text-right font-mono">
                    {convertTemp(day.low)}{tempLabel}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
                      style={{
                        marginLeft: `${lowPct}%`,
                        width: `${Math.max(highPct - lowPct, 10)}%`,
                      }}
                    />
                  </div>
                  <span className="text-white font-medium text-xs w-10 font-mono">
                    {convertTemp(day.high)}{tempLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
