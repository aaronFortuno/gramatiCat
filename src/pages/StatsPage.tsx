import { getStats, getStreaks, getHistorial } from '../services/storageService'
import CategoryBarChart from '../components/stats/CategoryBarChart'
import EvolutionChart from '../components/stats/EvolutionChart'
import ActivityHeatmap from '../components/stats/ActivityHeatmap'

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  return `${hours}h ${mins % 60}m`
}

export default function StatsPage() {
  const stats = getStats()
  const streaks = getStreaks()
  const historial = getHistorial()

  const totalEncerts = Object.values(stats.categories).reduce((s, c) => s + c.encerts, 0)
  const totalErrors = Object.values(stats.categories).reduce((s, c) => s + c.errors, 0)
  const totalTemps = Object.values(stats.categories).reduce((s, c) => s + c.tempsTotal, 0)
  const totalRespostes = totalEncerts + totalErrors
  const percentatgeGlobal = totalRespostes > 0 ? Math.round((totalEncerts / totalRespostes) * 100) : 0

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Estadístiques</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{historial.length}</p>
          <p className="text-sm text-gray-500">Exercicis fets</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{percentatgeGlobal}%</p>
          <p className="text-sm text-gray-500">Encerts globals</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{streaks.ratxaMaxima}</p>
          <p className="text-sm text-gray-500">Millor ratxa</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{formatTime(totalTemps)}</p>
          <p className="text-sm text-gray-500">Temps total</p>
        </div>
      </div>

      {/* Category bar chart */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Encerts per categoria</h2>
        <CategoryBarChart stats={stats} />
      </section>

      {/* Evolution chart */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Evolució</h2>
        <EvolutionChart historial={historial} />
      </section>

      {/* Activity heatmap */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Activitat</h2>
        <ActivityHeatmap historial={historial} />
      </section>
    </div>
  )
}
