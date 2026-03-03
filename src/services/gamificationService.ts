import type { Medal, EarnedMedal, MedalCheckContext } from '../types/gamification'

const CATEGORIES = ['ortografia', 'gramatica', 'lexic', 'sintaxi'] as const

type CategoryId = (typeof CATEGORIES)[number]

function categoryMedals(): Medal[] {
  const tiers: { prefix: string; nom: string; icona: string; threshold: number }[] = [
    { prefix: 'bronze', nom: 'Bronze', icona: '🥉', threshold: 50 },
    { prefix: 'plata', nom: 'Plata', icona: '🥈', threshold: 75 },
    { prefix: 'or', nom: 'Or', icona: '🥇', threshold: 90 },
  ]
  const catNames: Record<CategoryId, string> = {
    ortografia: 'Ortografia',
    gramatica: 'Gramàtica',
    lexic: 'Lèxic',
    sintaxi: 'Sintaxi',
  }

  const medals: Medal[] = []
  for (const tier of tiers) {
    for (const catId of CATEGORIES) {
      medals.push({
        id: `${tier.prefix}-${catId}`,
        nom: `${tier.nom} de ${catNames[catId]}`,
        descripcio: `Aconsegueix >= ${tier.threshold}% d'encerts en un exercici de ${catNames[catId]}.`,
        icona: tier.icona,
        condicio: `>= ${tier.threshold}% en ${catNames[catId]}`,
      })
    }
  }
  return medals
}

function specialMedals(): Medal[] {
  return [
    {
      id: 'primera-ratxa-5',
      nom: 'Ratxa de 5',
      descripcio: 'Encadena 5 respostes correctes seguides.',
      icona: '🔥',
      condicio: 'ratxaMaxima >= 5',
    },
    {
      id: 'primera-ratxa-10',
      nom: 'Ratxa de 10',
      descripcio: 'Encadena 10 respostes correctes seguides.',
      icona: '🔥',
      condicio: 'ratxaMaxima >= 10',
    },
    {
      id: 'deu-exercicis-dia',
      nom: '10 exercicis en un dia',
      descripcio: 'Completa 10 exercicis en un sol dia.',
      icona: '📅',
      condicio: '>= 10 exercicis avui',
    },
    {
      id: 'ratxa-diaria-3',
      nom: '3 dies seguits',
      descripcio: 'Practica durant 3 dies consecutius.',
      icona: '📅',
      condicio: 'ratxaDiaria >= 3',
    },
    {
      id: 'ratxa-diaria-7',
      nom: '7 dies seguits',
      descripcio: 'Practica durant 7 dies consecutius.',
      icona: '📅',
      condicio: 'ratxaDiaria >= 7',
    },
    {
      id: 'velocitat',
      nom: 'Velocitat',
      descripcio: "Aconsegueix un bonus de temps >= 80 en un exercici.",
      icona: '⚡',
      condicio: 'bonusTemps >= 80',
    },
  ]
}

export const MEDAL_CATALOG: Medal[] = [...categoryMedals(), ...specialMedals()]

export function getMedalById(id: string): Medal | undefined {
  return MEDAL_CATALOG.find((m) => m.id === id)
}

export function checkMedals(ctx: MedalCheckContext): EarnedMedal[] {
  const alreadyEarned = new Set(ctx.earnedMedals.map((m) => m.id))
  const now = new Date().toISOString()
  const newMedals: EarnedMedal[] = []

  function award(id: string) {
    if (!alreadyEarned.has(id)) {
      newMedals.push({ id, data: now })
      alreadyEarned.add(id)
    }
  }

  const total = ctx.encerts + ctx.errors
  const percentage = total > 0 ? (ctx.encerts / total) * 100 : 0

  // Category tier medals
  const tiers = [
    { prefix: 'bronze', threshold: 50 },
    { prefix: 'plata', threshold: 75 },
    { prefix: 'or', threshold: 90 },
  ]
  for (const tier of tiers) {
    if (percentage >= tier.threshold) {
      award(`${tier.prefix}-${ctx.categoriaId}`)
    }
  }

  // Streak medals
  if (ctx.ratxaMaxima >= 5) award('primera-ratxa-5')
  if (ctx.ratxaMaxima >= 10) award('primera-ratxa-10')

  // Daily medals
  if (ctx.exercicisAvui >= 10) award('deu-exercicis-dia')
  if (ctx.ratxaDiaria >= 3) award('ratxa-diaria-3')
  if (ctx.ratxaDiaria >= 7) award('ratxa-diaria-7')

  // Speed medal
  if (ctx.bonusTemps >= 80) award('velocitat')

  return newMedals
}
