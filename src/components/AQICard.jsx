import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { useWeather } from '../contexts/WeatherContext';
import { getAQIColor, getPollenLabel, getUVLabel } from '../utils/helpers';

export default function AQICard() {
  const { weather } = useWeather();
  if (!weather) return null;

  const { aqi, current } = weather;
  const aqiVal = aqi?.value ?? null;
  const aqiPct = aqiVal !== null ? Math.min((aqiVal / 300) * 100, 100) : 0;
  const aqiColorClass = getAQIColor(aqiVal);
  const uvInfo = getUVLabel(current.uvIndex ?? 0);
  const pollenLabel = getPollenLabel(aqi?.pollen);

  const radialData = [{ value: aqiPct, fill: aqiVal <= 50 ? '#4ade80' : aqiVal <= 100 ? '#facc15' : aqiVal <= 150 ? '#fb923c' : '#f87171' }];

  return (
    <div className="glass card-shine animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <div className="p-5 md:p-6">
        <h2 className="font-display font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          🌬️ Health Indicators
        </h2>
        <p className="text-white/40 text-xs font-mono mb-5">Air quality & environmental alerts</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* AQI radial */}
          <div className="glass rounded-xl p-4 flex flex-col items-center">
            <div className="text-white/50 text-xs font-mono uppercase tracking-wider mb-2">Air Quality Index</div>
            <div className="relative w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%" innerRadius="65%" outerRadius="90%"
                  startAngle={90} endAngle={-270}
                  data={[{ value: 100, fill: 'rgba(255,255,255,0.08)' }, ...radialData]}
                >
                  <RadialBar dataKey="value" cornerRadius={8} background={false} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-2xl font-bold font-mono ${aqiColorClass}`}>
                  {aqiVal ?? '--'}
                </div>
                <div className="text-white/40 text-xs">AQI</div>
              </div>
            </div>
            <div className={`text-xs mt-2 font-medium ${aqiColorClass}`}>
              {aqi?.category ?? 'Unknown'}
            </div>
            {aqi?.pm25 !== null && aqi?.pm25 !== undefined && (
              <div className="text-white/40 text-xs mt-1">PM2.5: {aqi.pm25.toFixed(1)} µg/m³</div>
            )}
          </div>

          {/* UV Index */}
          <div className="glass rounded-xl p-4 flex flex-col items-center justify-center gap-3">
            <div className="text-white/50 text-xs font-mono uppercase tracking-wider">UV Index</div>
            <div className="text-5xl">☀️</div>
            <div className="text-center">
              <div className={`text-3xl font-bold font-mono ${uvInfo.color}`}>
                {current.uvIndex?.toFixed(1) ?? '--'}
              </div>
              <div className={`text-sm font-medium mt-1 ${uvInfo.color}`}>{uvInfo.label}</div>
            </div>
            <UVBar value={current.uvIndex ?? 0} />
          </div>

          {/* Pollen + Allergy */}
          <div className="glass rounded-xl p-4 flex flex-col gap-3">
            <div className="text-white/50 text-xs font-mono uppercase tracking-wider">Pollen & Allergy</div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <div className="text-white/50 text-xs">Birch Pollen</div>
                <div className={`font-medium text-sm ${
                  pollenLabel === 'High' ? 'text-red-400' :
                  pollenLabel === 'Moderate' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {pollenLabel}
                  {aqi?.pollen !== null && aqi?.pollen !== undefined && ` (${Math.round(aqi.pollen)})`}
                </div>
              </div>
            </div>

            <AllergyRisk aqi={aqi} windSpeed={current.windSpeed} />

            <MosquitoRisk temp={current.temp} humidity={current.humidity} rainProb={current.rainProb} />
          </div>
        </div>
      </div>
    </div>
  );
}

function UVBar({ value }) {
  const pct = Math.min((value / 12) * 100, 100);
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: value <= 2 ? '#4ade80' : value <= 5 ? '#facc15' : value <= 7 ? '#fb923c' : '#f87171',
        }}
      />
    </div>
  );
}

function AllergyRisk({ aqi, windSpeed }) {
  const aqiVal = aqi?.value ?? 0;
  const pollen = aqi?.pollen ?? 0;
  let risk = 'Low';
  let color = 'text-green-400';
  if (aqiVal > 100 || pollen > 50 || windSpeed > 30) { risk = 'High'; color = 'text-red-400'; }
  else if (aqiVal > 50 || pollen > 10 || windSpeed > 20) { risk = 'Moderate'; color = 'text-yellow-400'; }

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">🤧</span>
      <div>
        <div className="text-white/50 text-xs">Allergy Risk</div>
        <div className={`font-medium text-sm ${color}`}>{risk}</div>
      </div>
    </div>
  );
}

function MosquitoRisk({ temp, humidity, rainProb }) {
  let risk = 'Low';
  let color = 'text-green-400';
  if (temp > 25 && humidity > 70 && rainProb > 40) { risk = 'High'; color = 'text-red-400'; }
  else if (temp > 22 && humidity > 60) { risk = 'Moderate'; color = 'text-yellow-400'; }

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">🦟</span>
      <div>
        <div className="text-white/50 text-xs">Mosquito Activity</div>
        <div className={`font-medium text-sm ${color}`}>{risk}</div>
      </div>
    </div>
  );
}
