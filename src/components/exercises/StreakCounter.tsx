import { useEffect, useState } from 'react'

interface Props {
  streak: number
}

export default function StreakCounter({ streak }: Props) {
  const [pop, setPop] = useState(false)

  useEffect(() => {
    if (streak > 0) {
      setPop(true)
      const timer = setTimeout(() => setPop(false), 300)
      return () => clearTimeout(timer)
    }
  }, [streak])

  if (streak <= 0) return null

  return (
    <div className={`inline-flex items-center gap-1 ${pop ? 'animate-streak-pop' : ''}`}>
      <span className="text-xl animate-flame-flicker">🔥</span>
      <span className="text-sm font-bold text-orange-600">{streak}</span>
    </div>
  )
}
