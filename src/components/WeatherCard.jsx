import { getWmo } from "../utils/wmo";
import { useLocalTime } from "../utils/useLocalTime";

export default function WeatherCard({ city, isSelected, onClick }) {
  const wmo = getWmo(city.weatherCode);
  const localTime = useLocalTime(city.timezone);

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full text-center p-5 rounded-2xl bg-[#0f1f4a] border transition-all
        ${isSelected ? "border-blue-400" : "border-slate-700 hover:border-slate-500"}`}
      style={{ minHeight: 220 }}
    >
      <p className="text-xl font-semibold text-slate-300">{city.name}</p>

      <div>
        <div className="flex gap-2 mb-1">
          <span className="text-4xl">{wmo.icon}</span>
          <span className="text-5xl font-bold">{city.temp}°F</span>
        </div>
        <p className="text-sm text-slate-400">{wmo.label}</p>
      </div>

      <p className="text-xs text-slate-200">{localTime}</p>
    </button>
  );
}
