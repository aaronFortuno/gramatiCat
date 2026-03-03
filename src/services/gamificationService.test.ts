import { describe, it, expect } from 'vitest'
import { MEDAL_CATALOG, getMedalById, checkMedals } from './gamificationService'
import type { MedalCheckContext } from '../types/gamification'

function baseCtx(overrides: Partial<MedalCheckContext> = {}): MedalCheckContext {
  return {
    categoriaId: 'ortografia',
    encerts: 0,
    errors: 0,
    temps: 60,
    ratxaMaxima: 0,
    ratxaDiaria: 0,
    exercicisAvui: 0,
    bonusTemps: 0,
    earnedMedals: [],
    ...overrides,
  }
}

describe('MEDAL_CATALOG', () => {
  it('has 18 medals total', () => {
    expect(MEDAL_CATALOG).toHaveLength(18)
  })

  it('has 12 category medals + 6 special medals', () => {
    const category = MEDAL_CATALOG.filter((m) =>
      m.id.startsWith('bronze-') || m.id.startsWith('plata-') || m.id.startsWith('or-')
    )
    expect(category).toHaveLength(12)
    expect(MEDAL_CATALOG.length - category.length).toBe(6)
  })

  it('each medal has unique id', () => {
    const ids = MEDAL_CATALOG.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getMedalById', () => {
  it('returns medal by id', () => {
    const medal = getMedalById('bronze-ortografia')
    expect(medal).toBeDefined()
    expect(medal!.icona).toBe('🥉')
  })

  it('returns undefined for unknown id', () => {
    expect(getMedalById('fake-id')).toBeUndefined()
  })
})

describe('checkMedals', () => {
  it('awards bronze when >= 50%', () => {
    const result = checkMedals(baseCtx({ encerts: 5, errors: 5 }))
    expect(result.some((m) => m.id === 'bronze-ortografia')).toBe(true)
  })

  it('awards bronze + plata when >= 75%', () => {
    const result = checkMedals(baseCtx({ encerts: 8, errors: 2 }))
    expect(result.some((m) => m.id === 'bronze-ortografia')).toBe(true)
    expect(result.some((m) => m.id === 'plata-ortografia')).toBe(true)
  })

  it('awards all tiers when >= 90%', () => {
    const result = checkMedals(baseCtx({ encerts: 9, errors: 1 }))
    expect(result.some((m) => m.id === 'bronze-ortografia')).toBe(true)
    expect(result.some((m) => m.id === 'plata-ortografia')).toBe(true)
    expect(result.some((m) => m.id === 'or-ortografia')).toBe(true)
  })

  it('awards nothing when < 50%', () => {
    const result = checkMedals(baseCtx({ encerts: 3, errors: 7 }))
    expect(result.filter((m) => m.id.endsWith('-ortografia'))).toHaveLength(0)
  })

  it('does not re-award already earned medals', () => {
    const result = checkMedals(baseCtx({
      encerts: 9, errors: 1,
      earnedMedals: [{ id: 'bronze-ortografia', data: '2025-01-01' }],
    }))
    expect(result.some((m) => m.id === 'bronze-ortografia')).toBe(false)
    expect(result.some((m) => m.id === 'plata-ortografia')).toBe(true)
  })

  it('awards streak medal for ratxaMaxima >= 5', () => {
    const result = checkMedals(baseCtx({ ratxaMaxima: 5 }))
    expect(result.some((m) => m.id === 'primera-ratxa-5')).toBe(true)
  })

  it('awards both streak medals for ratxaMaxima >= 10', () => {
    const result = checkMedals(baseCtx({ ratxaMaxima: 10 }))
    expect(result.some((m) => m.id === 'primera-ratxa-5')).toBe(true)
    expect(result.some((m) => m.id === 'primera-ratxa-10')).toBe(true)
  })

  it('awards daily exercise medal', () => {
    const result = checkMedals(baseCtx({ exercicisAvui: 10 }))
    expect(result.some((m) => m.id === 'deu-exercicis-dia')).toBe(true)
  })

  it('awards daily streak medals', () => {
    const r3 = checkMedals(baseCtx({ ratxaDiaria: 3 }))
    expect(r3.some((m) => m.id === 'ratxa-diaria-3')).toBe(true)
    expect(r3.some((m) => m.id === 'ratxa-diaria-7')).toBe(false)

    const r7 = checkMedals(baseCtx({ ratxaDiaria: 7 }))
    expect(r7.some((m) => m.id === 'ratxa-diaria-3')).toBe(true)
    expect(r7.some((m) => m.id === 'ratxa-diaria-7')).toBe(true)
  })

  it('awards speed medal for bonusTemps >= 80', () => {
    const result = checkMedals(baseCtx({ bonusTemps: 80 }))
    expect(result.some((m) => m.id === 'velocitat')).toBe(true)
  })

  it('does not award speed medal for bonusTemps < 80', () => {
    const result = checkMedals(baseCtx({ bonusTemps: 79 }))
    expect(result.some((m) => m.id === 'velocitat')).toBe(false)
  })

  it('uses correct category from context', () => {
    const result = checkMedals(baseCtx({ categoriaId: 'lexic', encerts: 10, errors: 0 }))
    expect(result.some((m) => m.id === 'or-lexic')).toBe(true)
    expect(result.some((m) => m.id === 'or-ortografia')).toBe(false)
  })
})
