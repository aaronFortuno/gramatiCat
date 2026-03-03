import type { UserStats, Streaks, Historial, HistorialEntry } from '../types/stats'
import type { EarnedMedal } from '../types/gamification'

const KEYS = {
  stats: 'gramaticat_stats',
  streaks: 'gramaticat_streaks',
  historial: 'gramaticat_historial',
  medalles: 'gramaticat_medalles',
} as const

let _storage: Storage = localStorage

/** Override the Storage backend (useful for testing) */
export function setStorage(storage: Storage): void {
  _storage = storage
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = _storage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  try {
    _storage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage quota exceeded', e)
  }
}

const DEFAULT_STATS: UserStats = { categories: {} }
const DEFAULT_STREAKS: Streaks = {
  ratxaActual: 0,
  ratxaMaxima: 0,
  ratxaDiaria: 0,
  ratxaDiariaMaxima: 0,
  ultimaData: '',
}

export function getStats(): UserStats {
  return read(KEYS.stats, DEFAULT_STATS)
}

export function updateCategoryStats(
  categoriaId: string,
  encerts: number,
  errors: number,
  temps: number
): void {
  const stats = getStats()
  const current = stats.categories[categoriaId] ?? { encerts: 0, errors: 0, tempsTotal: 0 }
  stats.categories[categoriaId] = {
    encerts: current.encerts + encerts,
    errors: current.errors + errors,
    tempsTotal: current.tempsTotal + temps,
  }
  write(KEYS.stats, stats)
}

export function getStreaks(): Streaks {
  return read(KEYS.streaks, DEFAULT_STREAKS)
}

export function updateStreaks(correct: boolean): Streaks {
  const streaks = getStreaks()
  const today = new Date().toISOString().split('T')[0]

  if (correct) {
    streaks.ratxaActual += 1
    streaks.ratxaMaxima = Math.max(streaks.ratxaMaxima, streaks.ratxaActual)
  } else {
    streaks.ratxaActual = 0
  }

  if (streaks.ultimaData !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (streaks.ultimaData === yesterday) {
      streaks.ratxaDiaria += 1
    } else if (streaks.ultimaData !== today) {
      streaks.ratxaDiaria = 1
    }
    streaks.ratxaDiariaMaxima = Math.max(streaks.ratxaDiariaMaxima, streaks.ratxaDiaria)
    streaks.ultimaData = today
  }

  write(KEYS.streaks, streaks)
  return streaks
}

export function getHistorial(): Historial {
  return read(KEYS.historial, [])
}

export function addHistorialEntry(entry: HistorialEntry): void {
  const historial = getHistorial()
  historial.push(entry)
  write(KEYS.historial, historial)
}

export function getMedalles(): EarnedMedal[] {
  return read(KEYS.medalles, [])
}

export function addMedalla(medal: EarnedMedal): void {
  const medalles = getMedalles()
  if (!medalles.some((m) => m.id === medal.id)) {
    medalles.push(medal)
    write(KEYS.medalles, medalles)
  }
}

export function clearAllData(): void {
  Object.values(KEYS).forEach((key) => _storage.removeItem(key))
}
