# WeatherAce 🌤️

A modern weather dashboard with interactive maps, 7-day forecasts, hourly charts, and location-based weather data. Built with React 18, Vite, and free open-source APIs — no API key required.

---

## Live Demo

> **Live:** https://swathiguttula.github.io/WeatherAce/

---

## Features

- **Current Weather** — temperature, humidity, wind speed, feels like, UV index
- **7-Day Forecast** — daily high/low with weather condition icons
- **Hourly Charts** — temperature and precipitation trends using Recharts
- **Interactive Map** — location picker using Leaflet.js
- **Auto Location** — detects user's location via browser Geolocation API
- **Search by City** — search any city worldwide
- **Responsive UI** — works on desktop and mobile

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Maps | Leaflet.js |
| Weather API | Open-Meteo (free, no API key) |
| Geocoding | OpenStreetMap Nominatim |
| Deployment | GitHub Pages + GitHub Actions |

---

## Why Open-Meteo?

Most weather apps require paid API keys (OpenWeatherMap, WeatherAPI). Open-Meteo is a free, open-source weather API with no key needed — making this project fully deployable without any account setup.

---

## Project Structure

```
WeatherAce/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       ← City search with autocomplete
│   │   ├── WeatherCard.jsx     ← Current conditions display
│   │   ├── ForecastChart.jsx   ← Hourly trend charts (Recharts)
│   │   ├── WeeklyForecast.jsx  ← 7-day forecast cards
│   │   └── MapView.jsx         ← Interactive map (Leaflet)
│   ├── hooks/
│   │   └── useWeather.js       ← Custom hook for weather data fetching
│   ├── utils/
│   │   └── weatherHelpers.js   ← WMO weather code mapping
│   └── App.jsx
├── .github/workflows/
│   └── deploy.yml              ← GitHub Actions CI/CD for Pages
└── vite.config.js
```

---

## Local Setup

```bash
git clone https://github.com/SwathiGuttula/WeatherAce.git
cd WeatherAce
npm install
npm run dev
```

Open `http://localhost:5173` — no environment variables needed.

---

## Deployment

Deployed automatically via **GitHub Actions** on every push to `gh-pages` branch using `peaceiris/actions-gh-pages`.

---

## Author

**Swathi Guttula**  
B.Tech Computer Science, KL University  
[GitHub](https://github.com/SwathiGuttula) · [LinkedIn](https://linkedin.com/in/swathiguttula)
