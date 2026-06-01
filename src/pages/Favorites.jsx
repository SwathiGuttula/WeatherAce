import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite, getRecentSearches } from '../utils/helpers';
import { useWeather } from '../contexts/WeatherContext';
import Footer from '../components/Footer';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const { fetchWeather } = useWeather();
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getFavorites());
    setRecent(getRecentSearches());
  }, []);

  const handleSelect = (item) => {
    fetchWeather(item.lat, item.lon, item.name);
    navigate('/');
  };

  const handleRemoveFav = (e, name) => {
    e.stopPropagation();
    removeFavorite(name);
    setFavorites(getFavorites());
  };

  return (
    <main className="min-h-screen px-4 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="py-10 animate-fade-in">
          <h1
            className="font-display font-bold text-white text-3xl mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            ❤️ Saved Cities
          </h1>
          <p className="text-white/40 text-sm font-mono">Your favorite locations & recent searches</p>
        </div>

        {/* Favorites */}
        <section className="mb-8">
          <h2 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-3">Favorites</h2>
          {favorites.length === 0 ? (
            <div className="glass p-8 text-center animate-fade-in">
              <div className="text-4xl mb-3">🤍</div>
              <div className="text-white/50 text-sm">No favorites yet.</div>
              <div className="text-white/30 text-xs mt-1">
                Search for a city and tap ❤️ to save it here.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-stagger">
              {favorites.map((fav, i) => (
                <CityCard
                  key={i}
                  item={fav}
                  onSelect={handleSelect}
                  onRemove={(e) => handleRemoveFav(e, fav.name)}
                  isFav
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent */}
        <section>
          <h2 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-3">Recent Searches</h2>
          {recent.length === 0 ? (
            <div className="glass p-8 text-center animate-fade-in">
              <div className="text-4xl mb-3">🕐</div>
              <div className="text-white/50 text-sm">No recent searches yet.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-stagger">
              {recent.map((item, i) => (
                <CityCard key={i} item={item} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}

function CityCard({ item, onSelect, onRemove, isFav }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="glass card-shine glass-hover cursor-pointer p-4 flex items-center gap-4"
    >
      <div className="text-3xl">📍</div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold truncate">{item.name}</div>
        {item.timestamp && (
          <div className="text-white/40 text-xs mt-0.5">
            {new Date(item.timestamp).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isFav && (
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 transition-colors text-lg p-1"
            title="Remove from favorites"
          >
            🗑️
          </button>
        )}
        <span className="text-white/30 text-sm">→</span>
      </div>
    </div>
  );
}
