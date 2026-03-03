import { getMedalles, getStreaks } from '../services/storageService'
import { MEDAL_CATALOG } from '../services/gamificationService'
import MedalGrid from '../components/gamification/MedalGrid'

export default function MedalsPage() {
  const earnedMedals = getMedalles()
  const streaks = getStreaks()
  const totalMedals = MEDAL_CATALOG.length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medalles</h1>

      {/* Summary banner */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[140px] bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{earnedMedals.length}</p>
          <p className="text-sm text-gray-500">de {totalMedals} medalles</p>
        </div>
        <div className="flex-1 min-w-[140px] bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">
            {streaks.ratxaDiaria > 0 ? `${streaks.ratxaDiaria} 🔥` : '—'}
          </p>
          <p className="text-sm text-gray-500">Ratxa diària</p>
        </div>
        <div className="flex-1 min-w-[140px] bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{streaks.ratxaMaxima}</p>
          <p className="text-sm text-gray-500">Millor ratxa</p>
        </div>
      </div>

      <MedalGrid earnedMedals={earnedMedals} />
    </div>
  )
}
