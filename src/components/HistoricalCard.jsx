import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";
import { getHistoricalData } from "../api";

const RANGES = [7, 14, 30];

export default function HistoricalCard({ city }) {
  const [days, setDays] = useState(7);

  const { data, isLoading } = useQuery({
    queryKey: ["history", city, days],
    queryFn: getHistoricalData,
    enabled: !!city,
  });

  const option = data
    ? {
        backgroundColor: "transparent",
        legend: {
          data: ["High", "Low"],
          textStyle: { color: "#94a3b8", fontSize: 12 },
          top: 0,
        },
        grid: { top: 30, bottom: 30, left: 50, right: 30 },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#1e2d6b",
          borderColor: "#334155",
          textStyle: { color: "#fff", fontSize: 12 },
        },
        xAxis: {
          type: "category",
          data: data.map((d) =>
            new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          ),
          axisLabel: { color: "#94a3b8", fontSize: 12 },
          axisLine: { lineStyle: { color: "#334155" } },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#94a3b8",
            fontSize: 12,
            formatter: (temp) => `${temp}°F`,
          },
          splitLine: { lineStyle: { color: "#1e2d6b" } },
        },
        series: [
          {
            name: "High",
            type: "line",
            data: data.map((temp) => temp.max),
            color: "#f59e0b",
            symbol: "none",
          },
          {
            name: "Low",
            type: "line",
            data: data.map((temp) => temp.min),
            color: "#60a5fa",
            symbol: "none",
          },
        ],
      }
    : null;

  return (
    <div className="bg-[#0f1f4a] rounded-2xl p-5 border border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-white">
          {city.name} — Temperature History
        </h2>
        <div className="flex gap-2">
          {RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setDays(range)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors
                ${
                  days === range
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-slate-600 text-slate-400 hover:border-blue-400"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-xl animate-pulse bg-slate-700" />
      ) : (
        <ReactECharts
          option={option}
          style={{ height: 260 }}
          opts={{ renderer: "svg" }}
        />
      )}
    </div>
  );
}