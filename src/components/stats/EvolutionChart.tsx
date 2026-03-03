import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Historial } from '../../types/stats'

interface Props {
  historial: Historial
}

type Range = 7 | 30

function aggregateByDay(historial: Historial, days: number) {
  const today = new Date()
  const result: { data: string; label: string; encerts: number; total: number; percentatge: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const label = `${d.getDate()}/${d.getMonth() + 1}`

    const dayEntries = historial.filter((h) => h.data.startsWith(dateStr))
    const encerts = dayEntries.reduce((sum, h) => sum + h.encerts, 0)
    const total = dayEntries.reduce((sum, h) => sum + h.encerts + h.errors, 0)

    result.push({
      data: dateStr,
      label,
      encerts,
      total,
      percentatge: total > 0 ? Math.round((encerts / total) * 100) : 0,
    })
  }

  return result
}

export default function EvolutionChart({ historial }: Props) {
  const [range, setRange] = useState<Range>(7)
  const data = aggregateByDay(historial, range)

  const hasData = data.some((d) => d.total > 0)

  if (!hasData) {
    return <p className="text-gray-400 text-sm">Encara no hi ha dades d'evolució.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setRange(7)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            range === 7
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          7 dies
        </button>
        <button
          onClick={() => setRange(30)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            range === 30
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          30 dies
        </button>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            interval={range === 30 ? 4 : 0}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
          <Tooltip
            formatter={(value) => [`${value ?? 0}%`, 'Encerts']}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Line
            type="monotone"
            dataKey="percentatge"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
