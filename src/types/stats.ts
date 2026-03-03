export interface CategoryStats {
  encerts: number
  errors: number
  tempsTotal: number
}

export interface UserStats {
  categories: Record<string, CategoryStats>
}

export interface Streaks {
  ratxaActual: number
  ratxaMaxima: number
  ratxaDiaria: number
  ratxaDiariaMaxima: number
  ultimaData: string
}

export interface HistorialEntry {
  exerciciId: string
  data: string
  encerts: number
  errors: number
  temps: number
}

export type Historial = HistorialEntry[]
