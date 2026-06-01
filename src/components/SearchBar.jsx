import React, { useState, useRef, useEffect, useCallback } from 'react';
import { searchCity } from '../services/weatherApi';
import { useWeather } from '../contexts/WeatherContext';
import { getRecentSearches } from '../utils/helpers';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const { fetchWeather, loading } = useWeather();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  const recent = getRecentSearches();

  const handleSearch = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await searchCity(q);
      setResults(res);
      setShowDropdown(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => handleSearch(val), 350);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const selectCity = (city) => {
    const name = [city.name, city.admin1, city.country].filter(Boolean).join(', ');
    setQuery(name);
    setShowDropdown(false);
    setShowRecent(false);
    fetchWeather(city.latitude, city.longitude, name);
  };

  const selectRecent = (item) => {
    setQuery(item.name);
    setShowDropdown(false);
    setShowRecent(false);
    fetchWeather(item.lat, item.lon, item.name);
  };

  const handleFocus = () => {
    if (query.length >= 2) setShowDropdown(true);
    else if (recent.length > 0) setShowRecent(true);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && results.length > 0) selectCity(results[0]);
    if (e.key === 'Escape') { setShowDropdown(false); setShowRecent(false); }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude, 'My Location');
        setQuery('My Location');
      },
      () => alert('Location access denied'),
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="glass flex items-center gap-3 px-4 py-3">
        <span className="text-white/50 text-lg flex-shrink-0">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search city, state or country..."
          className="flex-1 bg-transparent text-white placeholder-white/40 outline-none font-body text-base"
          disabled={loading}
        />
        {searching && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
        )}
        <button
          onClick={handleLocate}
          title="Use my location"
          className="text-white/60 hover:text-white transition-colors text-lg flex-shrink-0"
        >
          📍
        </button>
      </div>

      {/* Search Results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass shadow-2xl z-50 overflow-hidden animate-fade-in">
          {results.map((city, i) => (
            <button
              key={city.id ?? i}
              onClick={() => selectCity(city)}
              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
            >
              <span className="text-lg">📍</span>
              <div>
                <div className="text-white font-medium text-sm">{city.name}</div>
                <div className="text-white/50 text-xs">
                  {[city.admin1, city.country].filter(Boolean).join(', ')}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {showRecent && recent.length > 0 && !showDropdown && (
        <div className="absolute top-full mt-2 w-full glass shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="px-4 py-2 text-white/40 text-xs font-mono uppercase tracking-wider border-b border-white/10">
            Recent Searches
          </div>
          {recent.slice(0, 6).map((item, i) => (
            <button
              key={i}
              onClick={() => selectRecent(item)}
              className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
            >
              <span className="text-white/40">🕐</span>
              <span className="text-white/80 text-sm">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
