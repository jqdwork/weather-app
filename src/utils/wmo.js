export const WMO = {
  0:  { label: 'Clear sky',     icon: '☀️' },
  1:  { label: 'Mainly clear',  icon: '🌤️' },
  2:  { label: 'Partly cloudy', icon: '⛅'  },
  3:  { label: 'Cloudy',        icon: '☁️' },
  45: { label: 'Foggy',         icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  61: { label: 'Light rain',    icon: '🌧️' },
  63: { label: 'Rain',          icon: '🌧️' },
  71: { label: 'Light snow',    icon: '🌨️' },
  80: { label: 'Rain showers',  icon: '🌦️' },
  95: { label: 'Thunderstorm',  icon: '⛈️' },
};

export const getWmo = (code) => WMO[code] ?? { label: 'Unknown', icon: '🌡️' };