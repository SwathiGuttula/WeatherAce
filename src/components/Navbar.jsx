import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeather } from '../contexts/WeatherContext';

export default function Navbar() {
  const location = useLocation();
  const { unit, setUnit } = useWeather();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto glass flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl animate-float inline-block">⛅</span>
          <span
            className="font-display font-bold text-xl tracking-tight text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Weather<span className="text-sky-300">Ace</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" active={location.pathname === '/'}>🏠 Home</NavLink>
          <NavLink to="/favorites" active={location.pathname === '/favorites'}>❤️ Favorites</NavLink>

          {/* Unit Toggle */}
          <div className="flex items-center ml-4 glass rounded-xl overflow-hidden">
            <button
              onClick={() => setUnit('C')}
              className={`px-3 py-1.5 text-sm font-mono font-medium transition-all duration-200 ${
                unit === 'C'
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >°C</button>
            <button
              onClick={() => setUnit('F')}
              className={`px-3 py-1.5 text-sm font-mono font-medium transition-all duration-200 ${
                unit === 'F'
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >°F</button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden btn-glass px-3 py-2 text-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 glass px-5 py-4 flex flex-col gap-3 animate-fade-in">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition-colors py-1">🏠 Home</Link>
          <Link to="/favorites" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition-colors py-1">❤️ Favorites</Link>
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-white/50 text-sm">Unit:</span>
            <button onClick={() => setUnit('C')} className={`text-sm px-2 py-1 rounded ${unit==='C'?'bg-white/20 text-white':'text-white/50'}`}>°C</button>
            <button onClick={() => setUnit('F')} className={`text-sm px-2 py-1 rounded ${unit==='F'?'bg-white/20 text-white':'text-white/50'}`}>°F</button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-white/20 text-white shadow-lg'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  );
}
