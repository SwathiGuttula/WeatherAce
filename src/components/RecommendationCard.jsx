import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { generateRecommendations } from '../utils/recommendationEngine';

export default function RecommendationCard() {
  const { weather } = useWeather();
  if (!weather) return null;

  const recs = generateRecommendations(weather);
  if (!recs.length) return null;

  return (
    <div className="glass card-shine animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="p-5 md:p-6">
        <h2 className="font-display font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          🎯 Smart Recommendations
        </h2>
        <p className="text-white/40 text-xs font-mono mb-5">Personalized lifestyle advice</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-stagger">
          {recs.map(rec => (
            <div
              key={rec.id}
              className={`bg-gradient-to-br ${rec.color} ${rec.border} border rounded-xl p-4 card-shine glass-hover`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">{rec.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{rec.title}</div>
                  <div className="text-white/65 text-xs leading-relaxed">{rec.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
