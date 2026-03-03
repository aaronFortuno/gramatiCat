import type { Urgency } from '../../hooks/useTimer'

interface Props {
  secondsLeft: number
  totalSeconds: number
  urgency: Urgency
}

const URGENCY_COLORS: Record<Urgency, string> = {
  normal: '#2563eb',
  warning: '#f59e0b',
  critical: '#dc2626',
}

export default function ExerciseTimer({ secondsLeft, totalSeconds, urgency }: Props) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0
  const offset = circumference * (1 - progress)

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const color = URGENCY_COLORS[urgency]
  const pulseClass = urgency === 'critical' ? 'animate-timer-pulse' : ''

  return (
    <div className={`inline-flex items-center gap-2 ${pulseClass}`}>
      <svg width="64" height="64" viewBox="0 0 64 64" className="transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span
        className="text-sm font-mono font-semibold"
        style={{ color }}
      >
        {display}
      </span>
    </div>
  )
}
