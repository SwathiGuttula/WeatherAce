export function generateRecommendations(weatherData) {
  if (!weatherData) return [];

  const { current, aqi } = weatherData;
  const {
    temp, rainProb, uvIndex, windSpeed, humidity, weatherCode,
  } = current;

  const recs = [];

  // Rain
  if (rainProb > 60) {
    recs.push({
      id: 'rain',
      icon: '☂️',
      title: 'Carry an Umbrella',
      desc: `${rainProb}% chance of rain. Don't get caught without cover.`,
      color: 'from-blue-500/30 to-blue-600/20',
      border: 'border-blue-400/30',
      priority: 1,
    });
  } else if (rainProb > 30) {
    recs.push({
      id: 'light-rain',
      icon: '🌂',
      title: 'Light Rain Possible',
      desc: `${rainProb}% chance of rain. Consider bringing a light jacket.`,
      color: 'from-sky-500/20 to-sky-600/10',
      border: 'border-sky-400/20',
      priority: 3,
    });
  }

  // UV
  if (uvIndex > 7) {
    recs.push({
      id: 'uv-high',
      icon: '🧴',
      title: 'Apply Sunscreen',
      desc: `UV Index is ${uvIndex.toFixed(1)} (very high). Use SPF 30+ and seek shade.`,
      color: 'from-orange-500/30 to-yellow-500/20',
      border: 'border-orange-400/30',
      priority: 1,
    });
  } else if (uvIndex > 3) {
    recs.push({
      id: 'uv-moderate',
      icon: '😎',
      title: 'Wear Sunglasses',
      desc: `UV Index ${uvIndex.toFixed(1)} (moderate). Sunglasses recommended outdoors.`,
      color: 'from-yellow-500/20 to-amber-500/10',
      border: 'border-yellow-400/20',
      priority: 4,
    });
  }

  // Heat
  if (temp > 38) {
    recs.push({
      id: 'extreme-heat',
      icon: '🌡️',
      title: 'Extreme Heat Warning',
      desc: `${temp}°C is dangerously hot. Stay indoors and stay hydrated.`,
      color: 'from-red-600/40 to-orange-600/20',
      border: 'border-red-400/40',
      priority: 0,
    });
  } else if (temp > 35) {
    recs.push({
      id: 'heat',
      icon: '💧',
      title: 'Stay Hydrated',
      desc: `It's ${temp}°C outside. Drink water regularly and avoid prolonged sun exposure.`,
      color: 'from-red-500/30 to-orange-500/20',
      border: 'border-red-400/30',
      priority: 1,
    });
  }

  // Cold
  if (temp < 5) {
    recs.push({
      id: 'very-cold',
      icon: '🧥',
      title: 'Bundle Up Well',
      desc: `${temp}°C feels freezing. Wear a heavy coat, gloves, and scarf.`,
      color: 'from-cyan-600/30 to-blue-600/20',
      border: 'border-cyan-400/30',
      priority: 1,
    });
  } else if (temp < 18) {
    recs.push({
      id: 'cold',
      icon: '🧣',
      title: 'Wear a Jacket',
      desc: `${temp}°C is cool outside. A light sweater or jacket recommended.`,
      color: 'from-teal-500/20 to-cyan-500/10',
      border: 'border-teal-400/20',
      priority: 3,
    });
  }

  // Wind
  if (windSpeed > 60) {
    recs.push({
      id: 'strong-wind',
      icon: '🌬️',
      title: 'Strong Wind Alert',
      desc: `Wind at ${windSpeed} km/h. Avoid cycling and secure loose objects.`,
      color: 'from-violet-500/30 to-purple-600/20',
      border: 'border-violet-400/30',
      priority: 1,
    });
  } else if (windSpeed > 30) {
    recs.push({
      id: 'wind',
      icon: '💨',
      title: 'Windy Conditions',
      desc: `Wind at ${windSpeed} km/h. Secure loose belongings outside.`,
      color: 'from-purple-500/20 to-violet-500/10',
      border: 'border-purple-400/20',
      priority: 3,
    });
  }

  // AQI
  if (aqi?.value !== null) {
    if (aqi.value > 150) {
      recs.push({
        id: 'aqi-unhealthy',
        icon: '😷',
        title: 'Wear a Mask Outdoors',
        desc: `Air quality is unhealthy (AQI ${aqi.value}). Limit outdoor activity.`,
        color: 'from-rose-600/40 to-red-600/20',
        border: 'border-rose-400/40',
        priority: 0,
      });
    } else if (aqi.value > 100) {
      recs.push({
        id: 'aqi-moderate',
        icon: '🏠',
        title: 'Air Quality Warning',
        desc: `AQI is ${aqi.value} — sensitive groups should reduce outdoor time.`,
        color: 'from-orange-500/25 to-amber-500/15',
        border: 'border-orange-400/25',
        priority: 2,
      });
    }
  }

  // Pollen
  if (aqi?.pollen !== null && aqi?.pollen > 50) {
    recs.push({
      id: 'pollen',
      icon: '🌿',
      title: 'High Allergy Risk',
      desc: `Pollen levels are elevated. Take antihistamines if prone to allergies.`,
      color: 'from-green-500/25 to-emerald-500/15',
      border: 'border-green-400/25',
      priority: 2,
    });
  }

  // Lifestyle suggestions
  const lifestyle = getLifestyleSuggestion(temp, rainProb, windSpeed, uvIndex, aqi?.value);
  if (lifestyle) recs.push(lifestyle);

  // Mosquito
  if (temp > 25 && humidity > 70 && rainProb > 40) {
    recs.push({
      id: 'mosquito',
      icon: '🦟',
      title: 'High Mosquito Activity',
      desc: 'Warm, humid, and rainy — ideal for mosquitoes. Use repellent outdoors.',
      color: 'from-lime-500/20 to-green-600/10',
      border: 'border-lime-400/20',
      priority: 3,
    });
  }

  return recs.sort((a, b) => a.priority - b.priority);
}

function getLifestyleSuggestion(temp, rainProb, windSpeed, uvIndex, aqiValue) {
  const goodAqi = aqiValue === null || aqiValue <= 100;
  const goodWind = windSpeed <= 30;
  const noRain = rainProb <= 30;

  if (temp >= 20 && temp <= 28 && noRain && goodWind && goodAqi) {
    return {
      id: 'lifestyle-great',
      icon: '🚴',
      title: 'Great Day for Cycling',
      desc: 'Perfect weather conditions for outdoor cycling or a morning jog.',
      color: 'from-emerald-500/25 to-green-500/15',
      border: 'border-emerald-400/25',
      priority: 5,
    };
  }
  if (temp >= 15 && temp <= 25 && noRain && goodWind) {
    return {
      id: 'lifestyle-jog',
      icon: '🏃',
      title: 'Ideal for Jogging',
      desc: 'Cool and comfortable — a great time for your outdoor workout.',
      color: 'from-teal-500/20 to-cyan-500/10',
      border: 'border-teal-400/20',
      priority: 5,
    };
  }
  if (temp >= 22 && temp <= 30 && noRain && uvIndex <= 7 && goodWind) {
    return {
      id: 'lifestyle-picnic',
      icon: '🧺',
      title: 'Ideal Picnic Conditions',
      desc: 'Lovely weather to enjoy a picnic in the park!',
      color: 'from-yellow-500/20 to-lime-500/10',
      border: 'border-yellow-400/20',
      priority: 5,
    };
  }
  if (rainProb > 60 || temp < 10) {
    return {
      id: 'lifestyle-indoor',
      icon: '🏠',
      title: 'Stay Cozy Indoors',
      desc: 'Weather not great for outdoors — perfect day for a good book or movie.',
      color: 'from-indigo-500/20 to-blue-500/10',
      border: 'border-indigo-400/20',
      priority: 5,
    };
  }
  return null;
}
