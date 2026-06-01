import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useWeather } from '../contexts/WeatherContext';
import { getWeatherInfo } from '../services/weatherApi';
import { formatHour } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-3 py-2 text-sm">
      <div className="text-white/60 text-xs mb-1">{label}</div>
      <div className="text-white font-medium">{payload[0]?.value}°</div>
      <div className="text-sky-300 text-xs">💧 {payload[1]?.value}%</div>
    </div>
  );
};

export default function ForecastCard() {
  const { weather, convertTemp, tempLabel } = useWeather();
  if (!weather) return null;

  const { hourly } = weather;
  const chartData = hourly.slice(0, 24).map(h => ({
    time: formatHour(h.time),
    temp: convertTemp(h.temp),
    rain: h.rainProb,
    code: h.weatherCode,
  }));

  return (
    <div className="glass card-shine animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="p-5 md:p-6">
        <h2 className="font-display font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          ⏱️ Hourly Forecast
        </h2>
        <p className="text-white/40 text-xs font-mono mb-5">Next 24 hours</p>

        {/* Emoji scroll row */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          {hourly.slice(0, 24).map((h, i) => {
            const info = getWeatherInfo(h.weatherCode, 1);
            return (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 glass px-3 py-2 rounded-xl min-w-[60px]">
                <span className="text-white/50 text-xs font-mono">{formatHour(h.time)}</span>
                <span className="text-xl">{info.emoji}</span>
                <span className="text-white text-sm font-medium">{convertTemp(h.temp)}{tempLabel}</span>
                <span className="text-sky-300 text-xs">💧{h.rainProb}%</span>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} fill="url(#tempGrad)" name="Temp" dot={false} />
              <Area type="monotone" dataKey="rain" stroke="#818cf8" strokeWidth={1.5} fill="url(#rainGrad)" name="Rain" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <div className="w-3 h-0.5 bg-sky-400 rounded" />
            <span>Temperature ({tempLabel})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <div className="w-3 h-0.5 bg-indigo-400 rounded" />
            <span>Rain Probability (%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
