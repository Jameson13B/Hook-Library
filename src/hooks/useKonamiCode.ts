import { useCallback, useEffect, useState } from "react"

type UseKonamiCodeProps = {
  customPattern?: string[] | null
}

/**
 * A custom React hook that implements the Konami Code functionality for touch devices.
 *
 * The Konami Code is a sequence of touch gestures: up, up, down, down, left, right, left, right, tap, tap.
 * This hook tracks touch events and determines if the Konami Code has been entered.
 *
 * Features:
 * - Supports custom patterns through the `customPattern` prop
 * - Automatically resets the key sequence every 5 seconds
 *
 * @param {Object} props - The hook's configuration options
 * @param {string[]} [props.customPattern] - An optional custom pattern to replace the default Konami Code
 * @returns {Object} An object containing the active state, reset function, and current swipe sequence
 */
export const useKonamiCode = ({
  customPattern = null,
}: UseKonamiCodeProps = {}): {
  active: boolean
  reset: () => void
  swipeKey: string[]
} => {
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const [swipeKey, setSwipeKey] = useState<string[]>([])
  const [active, setActive] = useState(false)

  const minSwipeDistance = 50

  const onTouchStart = useCallback((e: TouchEvent) => {
    setTouchEndX(0) // otherwise the swipe is fired even with usual touch events
    setTouchEndY(0) // otherwise the swipe is fired even with usual touch events
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
    setTouchEndY(e.targetTouches[0].clientY)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (
      touchStartX === null ||
      touchStartY === null ||
      touchEndX === null ||
      touchEndY === null
    ) {
      return
    }

    const distanceX = touchStartX - touchEndX
    const distanceY = touchStartY - touchEndY
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance

    // If touch end didn't happen, it's a tap
    if (touchEndX === 0 && touchEndY === 0)
      return setSwipeKey((prev) => [...prev, "tap"])
    if (isLeftSwipe) return setSwipeKey((prev) => [...prev, "left"])
    if (isRightSwipe) return setSwipeKey((prev) => [...prev, "right"])
    if (isDownSwipe) return setSwipeKey((prev) => [...prev, "down"])
    if (isUpSwipe) return setSwipeKey((prev) => [...prev, "up"])
  }, [touchEndX, touchEndY, touchStartX, touchStartY])

  // Add event listeners and reset the swipe key every 5 seconds
  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart)
    window.addEventListener("touchmove", onTouchMove)
    window.addEventListener("touchend", onTouchEnd)
    const timeout = setTimeout(() => {
      setSwipeKey([])
    }, 5000)

    return () => {
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      clearTimeout(timeout)
    }
  }, [onTouchEnd, onTouchMove, onTouchStart])

  // Check if the swipe key matches the custom pattern or the default Konami Code
  useEffect(() => {
    if (customPattern) {
      if (swipeKey.join(",").includes(customPattern.join(","))) {
        setActive(true)
        setSwipeKey([])
      }
    } else if (
      swipeKey
        .join(",")
        .includes("up,up,down,down,left,right,left,right,tap,tap")
    ) {
      setActive(true)
      setSwipeKey([])
    }
  }, [swipeKey, customPattern])

  return {
    active,
    reset: () => {
      setSwipeKey([])
      setActive(false)
    },
    swipeKey,
  }
}
