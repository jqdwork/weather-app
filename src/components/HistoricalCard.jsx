import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";
import { getHistoricalData } from "../api";

const RANGES = [7, 14, 30];

export default function HistoricalCard({ city }) {
  const [days, setDays] = useState(7);
  const [containerWidth, setContainerWidth] = useState(null);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
      chartRef.current?.getEchartsInstance().resize();
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isMobile = containerWidth !== null && containerWidth < 480;

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
          textStyle: { color: "#94a3b8", fontSize: isMobile ? 10 : 12 },
          top: 0,
        },
        grid: {
          top: 30,
          bottom: isMobile ? 50 : 30,
          left: isMobile ? 10 : 50,
          right: isMobile ? 10 : 30,
          containLabel: true,
        },
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
          axisLabel: {
            color: "#94a3b8",
            fontSize: isMobile ? 10 : 12,
            rotate: isMobile ? 45 : 0,
            interval: isMobile && days === 30 ? 4 : 0,
          },
          axisLine: { lineStyle: { color: "#334155" } },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#94a3b8",
            fontSize: isMobile ? 10 : 12,
            formatter: (temp) => (isMobile ? `${temp}°` : `${temp}°F`),
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
    <div
      ref={containerRef}
      className="bg-[#0f1f4a] rounded-2xl p-5 border border-slate-800"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="font-semibold text-white text-sm sm:text-base">
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
        <div className="h-48 sm:h-64 rounded-xl animate-pulse bg-slate-700" />
      ) : (
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ height: isMobile ? 220 : 260 }}
          opts={{ renderer: "svg" }}
        />
      )}
    </div>
  );
}