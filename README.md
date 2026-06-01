# ⛅ WeatherAce – Smart Weather Advisory Platform

A modern weather intelligence platform that converts weather data into actionable lifestyle recommendations.

**Live Demo:** https://SwathiGuttula.github.io/WeatherAce/

---

## 🚀 Features

- 🌡️ **Real-time weather** – Temperature, humidity, wind, visibility, pressure
- ⏱️ **Hourly forecast** – Next 24 hours with interactive charts
- 📅 **7-day forecast** – Daily high/low with condition icons
- 🎯 **Smart recommendations** – Umbrella alerts, UV warnings, heat advisories, outfit tips
- 🌬️ **Health indicators** – AQI, UV Index, Pollen, Allergy risk, Mosquito activity
- 🗺️ **Interactive map** – Rain radar, temperature, wind, cloud layers
- ❤️ **Favorites** – Save cities locally (no login needed)
- 🔍 **Smart search** – City autocomplete with recent searches
- 📍 **GPS location** – One-tap current location weather
- 🌓 **Dynamic themes** – Background changes with weather conditions
- 📱 **Fully responsive** – Desktop, tablet, mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Glassmorphism |
| Charts | Recharts |
| Maps | Leaflet + React-Leaflet |
| Weather API | Open-Meteo (free, no key needed) |
| AQI API | Open-Meteo Air Quality |
| Deployment | GitHub Pages |

---

## 📦 Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it exactly: `WeatherAce`
3. Set to **Public**
4. Click **Create repository**

### Step 2: Push code

```bash
cd weatherace
git init
git add .
git commit -m "Initial commit – WeatherAce v1.0"
git branch -M main
git remote add origin https://github.com/SwathiGuttula/WeatherAce.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will auto-run and deploy your site

### Step 4: Visit your site

After ~2 minutes:
```
https://SwathiGuttula.github.io/WeatherAce/
```

---

## 💻 Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/WeatherAce/

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation + unit toggle
│   ├── SearchBar.jsx       # City search with autocomplete
│   ├── WeatherCard.jsx     # Main weather display
│   ├── ForecastCard.jsx    # 24-hour hourly forecast
│   ├── SevenDayForecast.jsx # 7-day outlook
│   ├── RecommendationCard.jsx # Smart lifestyle tips
│   ├── AQICard.jsx         # Health indicators
│   ├── WeatherMap.jsx      # Interactive Leaflet map
│   ├── LoadingSkeleton.jsx # Loading state UI
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx            # Main dashboard
│   └── Favorites.jsx       # Saved + recent cities
├── services/
│   └── weatherApi.js       # Open-Meteo API calls
├── utils/
│   ├── recommendationEngine.js # Weather → advice logic
│   └── helpers.js          # Formatting + localStorage
└── contexts/
    └── WeatherContext.jsx  # Global weather state
```

---

Built with ❤️ by Swathi Guttula
