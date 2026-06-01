import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../contexts/WeatherContext';

const LAYERS = [
  { id: 'clouds_new', label: '☁️ Clouds', key: 'clouds' },
  { id: 'precipitation_new', label: '🌧️ Rain', key: 'rain' },
  { id: 'temp_new', label: '🌡️ Temperature', key: 'temp' },
  { id: 'wind_new', label: '💨 Wind', key: 'wind' },
];

const OWM_KEY = 'bd5e378503941ddeba3bafcad0287e27'; // demo key from OWM docs

export default function WeatherMap() {
  const { weather } = useWeather();
  const [activeLayer, setActiveLayer] = useState('clouds');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);

  useEffect(() => {
    if (!weather || mapInstanceRef.current) return;

    // Dynamically import leaflet
    import('leaflet').then(L => {
      const map = L.map(mapRef.current, {
        center: [weather.lat, weather.lon],
        zoom: 7,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Weather layer
      const layer = L.tileLayer(
        `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        { opacity: 0.6, maxZoom: 19 }
      );
      layer.addTo(map);
      tileLayerRef.current = layer;

      // Marker
      const icon = L.divIcon({
        html: `<div style="background:rgba(56,189,248,0.9);width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(56,189,248,0.8)"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker([weather.lat, weather.lon], { icon })
        .addTo(map)
        .bindPopup(`<b>${weather.city}</b><br>${weather.current.temp}°C`)
        .openPopup();

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [weather]);

  // Update layer when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    import('leaflet').then(L => {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const layerConfig = LAYERS.find(l => l.key === activeLayer);
      const newLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/${layerConfig.id}/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        { opacity: 0.6, maxZoom: 19 }
      );
      newLayer.addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    });
  }, [activeLayer]);

  if (!weather) return null;

  return (
    <div className="glass card-shine animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="p-5 md:p-6">
        <h2 className="font-display font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          🗺️ Interactive Weather Map
        </h2>
        <p className="text-white/40 text-xs font-mono mb-4">Live radar & overlays</p>

        {/* Layer selector */}
        <div className="flex gap-2 flex-wrap mb-4">
          {LAYERS.map(layer => (
            <button
              key={layer.key}
              onClick={() => setActiveLayer(layer.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeLayer === layer.key
                  ? 'bg-white/25 text-white shadow-lg'
                  : 'glass text-white/60 hover:text-white hover:bg-white/15'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        <div
          ref={mapRef}
          className="w-full rounded-2xl overflow-hidden"
          style={{ height: '380px' }}
        />
      </div>
    </div>
  );
}
