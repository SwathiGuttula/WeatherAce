import { format, parseISO, isToday, isTomorrow } from 'date-fns';

export function formatTime(isoString) {
  try {
    return format(parseISO(isoString), 'h:mm a');
  } catch {
    return '--';
  }
}

export function formatHour(isoString) {
  try {
    return format(parseISO(isoString), 'ha');
  } catch {
    return '--';
  }
}

export function formatDay(isoString) {
  try {
    const date = parseISO(isoString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE');
  } catch {
    return '--';
  }
}

export function formatDate(isoString) {
  try {
    return format(parseISO(isoString), 'MMM d');
  } catch {
    return '--';
  }
}

export function getWindDirection(degrees) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

export function getUVLabel(uv) {
  if (uv <= 2) return { label: 'Low', color: 'text-green-400' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-400' };
  return { label: 'Extreme', color: 'text-rose-400' };
}

export function getPollenLabel(value) {
  if (value === null || value === undefined) return 'N/A';
  if (value < 10) return 'Low';
  if (value < 50) return 'Moderate';
  return 'High';
}

export function getAQIColor(value) {
  if (value === null) return 'text-white/60';
  if (value <= 50) return 'text-green-400';
  if (value <= 100) return 'text-yellow-400';
  if (value <= 150) return 'text-orange-400';
  if (value <= 200) return 'text-red-400';
  return 'text-rose-400';
}

export function saveRecentSearch(city) {
  try {
    const key = 'weatherace_searches';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter(s => s.name !== city.name);
    const updated = [{ ...city, timestamp: Date.now() }, ...filtered].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem('weatherace_searches') || '[]');
  } catch {
    return [];
  }
}

export function saveFavorite(city) {
  try {
    const key = 'weatherace_favorites';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    if (!existing.find(f => f.name === city.name)) {
      localStorage.setItem(key, JSON.stringify([...existing, city]));
    }
  } catch {}
}

export function removeFavorite(cityName) {
  try {
    const key = 'weatherace_favorites';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify(existing.filter(f => f.name !== cityName)));
  } catch {}
}

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('weatherace_favorites') || '[]');
  } catch {
    return [];
  }
}

export function isFavorite(cityName) {
  return getFavorites().some(f => f.name === cityName);
}
