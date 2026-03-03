export interface ExerciseRef {
  id: string
  titol: string
  fitxer: string
}

export interface Topic {
  id: string
  nom: string
  descripcio: string
  exercicis: ExerciseRef[]
}

export interface Category {
  id: string
  nom: string
  descripcio: string
  icona: string
  color: string
  temes: Topic[]
}

export interface ContentsManifest {
  categories: Category[]
}
