import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with the correct total seconds', () => {
    const { result } = renderHook(() => useTimer(120, () => {}))
    expect(result.current.secondsLeft).toBe(120)
    expect(result.current.totalSeconds).toBe(120)
    expect(result.current.isRunning).toBe(false)
  })

  it('starts counting down when start() is called', () => {
    const { result } = renderHook(() => useTimer(60, () => {}))
    act(() => result.current.start())
    expect(result.current.isRunning).toBe(true)

    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.secondsLeft).toBe(57)
  })

  it('pauses when pause() is called', () => {
    const { result } = renderHook(() => useTimer(60, () => {}))
    act(() => result.current.start())
    act(() => { vi.advanceTimersByTime(5000) })
    act(() => result.current.pause())
    const paused = result.current.secondsLeft
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current.secondsLeft).toBe(paused)
  })

  it('resets to total seconds', () => {
    const { result } = renderHook(() => useTimer(60, () => {}))
    act(() => result.current.start())
    act(() => { vi.advanceTimersByTime(10000) })
    act(() => result.current.reset())
    expect(result.current.secondsLeft).toBe(60)
    expect(result.current.isRunning).toBe(false)
  })

  it('calls onExpire when timer reaches 0', () => {
    const onExpire = vi.fn()
    const { result } = renderHook(() => useTimer(3, onExpire))
    act(() => result.current.start())
    act(() => { vi.advanceTimersByTime(3000) })
    expect(onExpire).toHaveBeenCalledTimes(1)
    expect(result.current.secondsLeft).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('returns "normal" urgency when plenty of time', () => {
    const { result } = renderHook(() => useTimer(100, () => {}))
    expect(result.current.urgency).toBe('normal')
  })

  it('returns "warning" urgency below 33%', () => {
    const { result } = renderHook(() => useTimer(100, () => {}))
    act(() => result.current.start())
    act(() => { vi.advanceTimersByTime(70000) }) // 30 left of 100
    expect(result.current.urgency).toBe('warning')
  })

  it('returns "critical" urgency below 15%', () => {
    const { result } = renderHook(() => useTimer(100, () => {}))
    act(() => result.current.start())
    act(() => { vi.advanceTimersByTime(90000) }) // 10 left of 100
    expect(result.current.urgency).toBe('critical')
  })
})
