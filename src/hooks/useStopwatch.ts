import { useEffect, useState } from "react"

/**
 * A custom React hook that implements a stopwatch functionality.
 *
 * @param {number} [startTime=0] - The initial time for the stopwatch in seconds
 * @returns {Object} An object containing the stopwatch's time, isRunning state, and toggleTime and resetTime functions
 */
export const useStopwatch = (startTime = 0) => {
  const [time, setTime] = useState(Math.floor(startTime * 100))
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let intervalId: number

    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10)
    }

    return () => clearInterval(intervalId)
  }, [isRunning, time])

  return {
    hours: Math.floor(time / 360000),
    minutes: Math.floor((time % 360000) / 6000),
    seconds: Math.floor((time % 6000) / 100),
    milliseconds: time % 100,
    isRunning,
    toggleTime: () => setIsRunning(!isRunning),
    resetTime: (full = false) =>
      setTime(full ? 0 : Math.floor(startTime * 100)),
  }
}
