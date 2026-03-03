import type { Historial } from '../../types/stats'

interface Props {
  historial: Historial
}

const DAYS = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg']

function getIntensity(count: number): string {
  if (count === 0) return 'bg-gray-100'
  if (count <= 2) return 'bg-green-200'
  if (count <= 5) return 'bg-green-400'
  return 'bg-green-600'
}

export default function ActivityHeatmap({ historial }: Props) {
  // Build a map of date -> exercise count for last 12 weeks (84 days)
  const today = new Date()
  const counts = new Map<string, number>()

  for (const entry of historial) {
    const date = entry.data.split('T')[0]
    counts.set(date, (counts.get(date) ?? 0) + 1)
  }

  // Generate 12 weeks of days, ending today
  // Align to Monday start: go back to fill the current week, then 11 more weeks
  const dayOfWeek = (today.getDay() + 6) % 7 // 0=Mon, 6=Sun
  const totalDays = 7 * 11 + dayOfWeek + 1 // 11 full weeks + current partial week
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - totalDays + 1)

  const weeks: { date: string; count: number; dayIndex: number }[][] = []
  let currentWeek: { date: string; count: number; dayIndex: number }[] = []

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const di = (d.getDay() + 6) % 7

    currentWeek.push({
      date: dateStr,
      count: counts.get(dateStr) ?? 0,
      dayIndex: di,
    })

    if (di === 6 || i === totalDays - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAYS.map((day, i) => (
            <div key={i} className="w-4 h-4 text-[10px] text-gray-400 flex items-center">
              {i % 2 === 0 ? day : ''}
            </div>
          ))}
        </div>
        {/* Weeks grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {/* Pad first week if it doesn't start on Monday */}
            {wi === 0 &&
              Array.from({ length: week[0]?.dayIndex ?? 0 }).map((_, pi) => (
                <div key={`pad-${pi}`} className="w-4 h-4" />
              ))}
            {week.map((day) => (
              <div
                key={day.date}
                className={`w-4 h-4 rounded-sm ${getIntensity(day.count)}`}
                title={`${day.date}: ${day.count} exercici${day.count !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[10px] text-gray-400">
        <span>Menys</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100" />
        <div className="w-3 h-3 rounded-sm bg-green-200" />
        <div className="w-3 h-3 rounded-sm bg-green-400" />
        <div className="w-3 h-3 rounded-sm bg-green-600" />
        <span>Més</span>
      </div>
    </div>
  )
}
