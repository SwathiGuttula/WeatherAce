import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto glass px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⛅</span>
          <span className="font-display font-bold text-white/80" style={{ fontFamily: "'Syne', sans-serif" }}>
            Weather<span className="text-sky-300">Ace</span>
          </span>
          <span className="text-white/30 text-sm ml-2">v1.0</span>
        </div>
        <div className="text-white/40 text-xs text-center">
          Powered by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">
            Open-Meteo
          </a>
          {' '}· Built by{' '}
          <span className="text-white/60">Swathi Guttula</span>
        </div>
        <div className="text-white/30 text-xs">
          Data updates every 15 min
        </div>
      </div>
    </footer>
  );
}
