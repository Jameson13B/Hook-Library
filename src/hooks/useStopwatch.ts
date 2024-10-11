import { useEffect, useState } from "react";

export const useStopwatch = (startTime = 0) => {
  const [time, setTime] = useState(Math.floor(startTime * 100));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  return {
    hours: Math.floor(time / 360000),
    minutes: Math.floor((time % 360000) / 6000),
    seconds: Math.floor((time % 6000) / 100),
    milliseconds: time % 100,
    isRunning,
    toggleTime: () => setIsRunning(!isRunning),
    resetTime: (full = false) =>
      setTime(full ? 0 : Math.floor(startTime * 100)),
  };
};
