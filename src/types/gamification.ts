export interface Medal {
  id: string
  nom: string
  descripcio: string
  icona: string
  condicio: string
}

export interface EarnedMedal {
  id: string
  data: string
}

export interface MedalCheckContext {
  categoriaId: string
  encerts: number
  errors: number
  temps: number
  ratxaMaxima: number
  ratxaDiaria: number
  exercicisAvui: number
  bonusTemps: number
  earnedMedals: EarnedMedal[]
}
