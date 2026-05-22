import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather, CITIES } from "./api";
import WeatherCard from "./components/WeatherCard";
import HistoricalCard from "./components/HistoricalCard";

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState("Atlanta");

  const {
    data: cities = [],
    isLoading,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: getCurrentWeather,
  });

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const activeCity = CITIES.find((city) => city.name === selectedCity) ?? null;

  const handleSelectedCity = (cityName) =>  {
    setSelectedCity((prev) => (prev === cityName ? null : cityName));
  }

  return (
    <div className="min-h-screen bg-[#0b1437] text-white">
      <div className="max-w-screen-2xl mx-auto p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">⛅</span>
          <div>
            <h1 className="text-2xl font-bold">Weather Dashboard</h1>
            <p className="text-sm text-slate-400">
              Real-time Overview of Major Cities
            </p>
          </div>
        </div>
        <div className="bg-[#0f1f4a] rounded-3xl p-6 mb-6 border border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {isLoading
              ? CITIES.map((city) => (
                  <div
                    key={city.name}
                    className="h-52 rounded-2xl animate-pulse bg-slate-700"
                  />
                ))
              : cities.map((city) => (
                  <WeatherCard
                    key={city.name}
                    city={city}
                    isSelected={selectedCity === city.name}
                    onClick={() => handleSelectedCity(city.name)}
                  />
                ))}
          </div>
        </div>
        <HistoricalCard city={activeCity} />
        <div className="flex flex-wrap justify-between items-center mt-8 text-xs text-slate-500 gap-2">
          {lastUpdated && (
            <button onClick={refetch} className="hover:text-slate-300">
              🔄 Last updated: {lastUpdated}
            </button>
          )}
          <span>All times are local time for each city</span>
        </div>
      </div>
    </div>
  );
}
