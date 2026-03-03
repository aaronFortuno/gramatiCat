import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { UserStats } from '../../types/stats'

interface Props {
  stats: UserStats
}

const CATEGORY_COLORS: Record<string, string> = {
  gramatica: '#2563eb',
  ortografia: '#16a34a',
  lexic: '#f59e0b',
  sintaxi: '#dc2626',
}

const CATEGORY_NAMES: Record<string, string> = {
  gramatica: 'Gramàtica',
  ortografia: 'Ortografia',
  lexic: 'Lèxic',
  sintaxi: 'Sintaxi',
}

export default function CategoryBarChart({ stats }: Props) {
  const data = Object.entries(stats.categories).map(([id, cat]) => {
    const total = cat.encerts + cat.errors
    return {
      id,
      nom: CATEGORY_NAMES[id] ?? id,
      percentatge: total > 0 ? Math.round((cat.encerts / total) * 100) : 0,
      encerts: cat.encerts,
      errors: cat.errors,
    }
  })

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm">Encara no hi ha dades per categoria.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
        <Tooltip
          formatter={(value) => [`${value ?? 0}%`, 'Encerts']}
          contentStyle={{ borderRadius: 8, fontSize: 13 }}
        />
        <Bar dataKey="percentatge" radius={[6, 6, 0, 0]} maxBarSize={60}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={CATEGORY_COLORS[entry.id] ?? '#6b7280'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
