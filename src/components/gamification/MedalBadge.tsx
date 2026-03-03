import type { Medal } from '../../types/gamification'

interface Props {
  medal: Medal
  earned: boolean
  earnedDate?: string
}

export default function MedalBadge({ medal, earned, earnedDate }: Props) {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
        earned
          ? 'bg-white border-gray-200 shadow-sm'
          : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
      }`}
    >
      <span className="text-3xl">{earned ? medal.icona : '🔒'}</span>
      <p className="text-sm font-medium text-gray-800">{medal.nom}</p>
      <p className="text-xs text-gray-500">{medal.descripcio}</p>
      {earned && earnedDate && (
        <p className="text-xs text-gray-400">
          {new Date(earnedDate).toLocaleDateString('ca-ES')}
        </p>
      )}
    </div>
  )
}
