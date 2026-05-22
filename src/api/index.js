import axios from "axios";

const FORECAST_API = "https://api.open-meteo.com/v1/forecast";
const HISTORICAL_API = "https://archive-api.open-meteo.com/v1/archive";

export const CITIES = [
  { name: "Atlanta", timezone: "America/New_York", lat: 33.749, lon: -84.388 },
  { name: "Lucerne", timezone: "Europe/Zurich", lat: 47.05, lon: 8.309 },
  {
    name: "Ho Chi Minh",
    timezone: "Asia/Ho_Chi_Minh",
    lat: 10.823,
    lon: 106.63,
  },
  { name: "Tokyo", timezone: "Asia/Tokyo", lat: 35.676, lon: 139.65 },
];

export async function getCurrentWeather() {
  const { data } = await axios.get(FORECAST_API, {
    params: {
      latitude: CITIES.map((city) => city.lat).join(","),
      longitude: CITIES.map((city) => city.lon).join(","),
      timezone: CITIES.map((city) => city.timezone).join(","),
      current: "temperature_2m,weathercode",
      temperature_unit: "fahrenheit",
      forecast_days: 1,
    },
  });

  return data.map((cityWeather, index) => ({
    ...CITIES[index],
    temp: Math.round(cityWeather.current.temperature_2m),
    weatherCode: cityWeather.current.weathercode,
  }));
}

export async function getHistoricalData({ queryKey }) {
  const [, city, days] = queryKey;

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const { data } = await axios.get(HISTORICAL_API, {
    params: {
      latitude: city.lat,
      longitude: city.lon,
      timezone: city.timezone,
      daily: "temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      start_date: start.toLocaleDateString("en-CA"),
      end_date: end.toLocaleDateString("en-CA"),
    },
  });

  return data.daily.time.map((date, index) => ({
    date,
    min: Math.round(data.daily.temperature_2m_min[index]),
    max: Math.round(data.daily.temperature_2m_max[index]),
  }));
}
