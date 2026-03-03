import type { EarnedMedal } from '../../types/gamification'
import { MEDAL_CATALOG } from '../../services/gamificationService'
import MedalBadge from './MedalBadge'

interface Props {
  earnedMedals: EarnedMedal[]
}

export default function MedalGrid({ earnedMedals }: Props) {
  const earnedMap = new Map(earnedMedals.map((m) => [m.id, m.data]))

  const categoryMedals = MEDAL_CATALOG.filter(
    (m) => m.id.startsWith('bronze-') || m.id.startsWith('plata-') || m.id.startsWith('or-')
  )
  const specialMedals = MEDAL_CATALOG.filter(
    (m) => !m.id.startsWith('bronze-') && !m.id.startsWith('plata-') && !m.id.startsWith('or-')
  )

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Per categoria</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categoryMedals.map((medal) => (
            <MedalBadge
              key={medal.id}
              medal={medal}
              earned={earnedMap.has(medal.id)}
              earnedDate={earnedMap.get(medal.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Especials</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {specialMedals.map((medal) => (
            <MedalBadge
              key={medal.id}
              medal={medal}
              earned={earnedMap.has(medal.id)}
              earnedDate={earnedMap.get(medal.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
