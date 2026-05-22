import { useState, useEffect } from "react";

const getLocalDateTime = (timezone) => {
  return new Date().toLocaleString("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function useLocalTime(timezone) {
  const [time, setTime] = useState(getLocalDateTime(timezone));

  useEffect(() => {
    const timer = setInterval(() => setTime(getLocalDateTime(timezone)), 60000);
    return () => clearInterval(timer);
  }, [timezone]);

  return time;
}
