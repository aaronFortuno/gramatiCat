import { useState } from 'react'
import { getStats, getStreaks, getHistorial, clearAllData } from '../services/storageService'
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
  const [resetKey, setResetKey] = useState(0)

  // Re-read on every render triggered by resetKey
  const stats = getStats()
  const streaks = getStreaks()
  const historial = getHistorial()

  const totalEncerts = Object.values(stats.categories).reduce((s, c) => s + c.encerts, 0)
  const totalErrors = Object.values(stats.categories).reduce((s, c) => s + c.errors, 0)
  const totalTemps = Object.values(stats.categories).reduce((s, c) => s + c.tempsTotal, 0)
  const totalRespostes = totalEncerts + totalErrors
  const percentatgeGlobal = totalRespostes > 0 ? Math.round((totalEncerts / totalRespostes) * 100) : 0

  const [showConfirm, setShowConfirm] = useState(false)

  function handleReset() {
    clearAllData()
    setShowConfirm(false)
    setResetKey((k) => k + 1)
  }

  return (
    <div className="space-y-6" key={resetKey}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Estadístiques</h1>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Reiniciar dades
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600">Segur? Es perdran totes les dades.</span>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel·lar
            </button>
          </div>
        )}
      </div>

      {/* Summary + Category chart side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Summary cards stacked */}
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <p className="text-3xl font-bold text-blue-600">{historial.length}</p>
            <p className="text-sm text-gray-500">Exercicis fets</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <p className="text-3xl font-bold text-green-600">{percentatgeGlobal}%</p>
            <p className="text-sm text-gray-500">Encerts globals</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <p className="text-3xl font-bold text-orange-600">{streaks.ratxaMaxima}</p>
            <p className="text-sm text-gray-500">Millor ratxa</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <p className="text-3xl font-bold text-purple-600">{formatTime(totalTemps)}</p>
            <p className="text-sm text-gray-500">Temps total</p>
          </div>
        </div>

        {/* Category bar chart */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Encerts per categoria</h2>
          <div className="flex-1 min-h-[200px]">
            <CategoryBarChart stats={stats} />
          </div>
        </section>
      </div>

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
