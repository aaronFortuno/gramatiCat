export type ExerciseType =
  | 'multiple-choice'
  | 'fill-in-the-blank'
  | 'drag-and-drop'
  | 'word-classification'

export type EducationLevel = 'CS' | 'ESO1' | 'ESO2'

export interface MultipleChoiceQuestion {
  id: string
  enunciat: string
  opcions: string[]
  resposta_correcta: number
  explicacio: string
}

export interface FillBlank {
  posicio: number
  resposta_correcta: string
  opcions?: string[]
}

export interface FillInTheBlankQuestion {
  id: string
  enunciat: string
  buits: FillBlank[]
  explicacio: string
}

export interface DragAndDropQuestion {
  id: string
  enunciat: string
  elements: string[]
  zones: string[]
  parelles_correctes: Record<string, string>
  explicacio: string
}

export interface WordClassificationQuestion {
  id: string
  enunciat: string
  paraules: string[]
  columnes: string[]
  classificacio_correcta: Record<string, string[]>
  explicacio: string
}

export type ExerciseQuestion =
  | MultipleChoiceQuestion
  | FillInTheBlankQuestion
  | DragAndDropQuestion
  | WordClassificationQuestion

export interface ExerciseMetadata {
  categoria: string
  tema: string
  tags: string[]
}

export interface Exercise {
  id: string
  titol: string
  descripcio: string
  tipus: ExerciseType
  nivell: EducationLevel
  temps_recomanat: number
  preguntes: ExerciseQuestion[]
  metadata: ExerciseMetadata
}
