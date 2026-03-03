import { useState, useEffect, useCallback, useRef } from 'react'

export type Urgency = 'normal' | 'warning' | 'critical'

interface UseTimerReturn {
  secondsLeft: number
  totalSeconds: number
  urgency: Urgency
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

export function useTimer(
  totalSeconds: number,
  onExpire: () => void,
): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          setIsRunning(false)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning, secondsLeft])

  const urgency: Urgency =
    secondsLeft <= totalSeconds * 0.15
      ? 'critical'
      : secondsLeft <= totalSeconds * 0.33
        ? 'warning'
        : 'normal'

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setSecondsLeft(totalSeconds)
    setIsRunning(false)
  }, [totalSeconds])

  return { secondsLeft, totalSeconds, urgency, isRunning, start, pause, reset }
}
