import type { ExerciseType } from '../types/exercise'

interface ValidationResult {
  valid: boolean
  errors: string[]
}

const VALID_TYPES: ExerciseType[] = [
  'multiple-choice',
  'fill-in-the-blank',
  'drag-and-drop',
  'word-classification',
]

const VALID_LEVELS = ['CS', 'ESO1', 'ESO2']

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function validateMultipleChoice(q: Record<string, unknown>, i: number, errors: string[]) {
  if (!isNonEmptyString(q.enunciat)) errors.push(`Pregunta ${i + 1}: falta "enunciat".`)
  if (!Array.isArray(q.opcions) || q.opcions.length < 2)
    errors.push(`Pregunta ${i + 1}: "opcions" ha de ser un array amb >= 2 elements.`)
  if (typeof q.resposta_correcta !== 'number')
    errors.push(`Pregunta ${i + 1}: "resposta_correcta" ha de ser un número (índex).`)
  else if (Array.isArray(q.opcions) && (q.resposta_correcta < 0 || q.resposta_correcta >= q.opcions.length))
    errors.push(`Pregunta ${i + 1}: "resposta_correcta" fora de rang.`)
}

function validateFillInTheBlank(q: Record<string, unknown>, i: number, errors: string[]) {
  if (!isNonEmptyString(q.enunciat)) errors.push(`Pregunta ${i + 1}: falta "enunciat".`)
  if (!Array.isArray(q.buits) || q.buits.length === 0)
    errors.push(`Pregunta ${i + 1}: "buits" ha de ser un array no buit.`)
  else {
    for (let j = 0; j < q.buits.length; j++) {
      const b = q.buits[j] as Record<string, unknown>
      if (!isObject(b)) { errors.push(`Pregunta ${i + 1}, buit ${j + 1}: ha de ser un objecte.`); continue }
      if (typeof b.posicio !== 'number') errors.push(`Pregunta ${i + 1}, buit ${j + 1}: falta "posicio".`)
      if (!isNonEmptyString(b.resposta_correcta)) errors.push(`Pregunta ${i + 1}, buit ${j + 1}: falta "resposta_correcta".`)
    }
  }
}

function validateDragAndDrop(q: Record<string, unknown>, i: number, errors: string[]) {
  if (!isNonEmptyString(q.enunciat)) errors.push(`Pregunta ${i + 1}: falta "enunciat".`)
  if (!Array.isArray(q.elements) || q.elements.length === 0)
    errors.push(`Pregunta ${i + 1}: "elements" ha de ser un array no buit.`)
  if (!Array.isArray(q.zones) || q.zones.length === 0)
    errors.push(`Pregunta ${i + 1}: "zones" ha de ser un array no buit.`)
  if (!isObject(q.parelles_correctes))
    errors.push(`Pregunta ${i + 1}: "parelles_correctes" ha de ser un objecte.`)
}

function validateWordClassification(q: Record<string, unknown>, i: number, errors: string[]) {
  if (!isNonEmptyString(q.enunciat)) errors.push(`Pregunta ${i + 1}: falta "enunciat".`)
  if (!Array.isArray(q.paraules) || q.paraules.length === 0)
    errors.push(`Pregunta ${i + 1}: "paraules" ha de ser un array no buit.`)
  if (!Array.isArray(q.columnes) || q.columnes.length < 2)
    errors.push(`Pregunta ${i + 1}: "columnes" ha de tenir >= 2 elements.`)
  if (!isObject(q.classificacio_correcta))
    errors.push(`Pregunta ${i + 1}: "classificacio_correcta" ha de ser un objecte.`)
}

export function validateExerciseJson(raw: string): ValidationResult {
  const errors: string[] = []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (e) {
    return { valid: false, errors: [`JSON invàlid: ${(e as Error).message}`] }
  }

  if (!isObject(parsed)) return { valid: false, errors: ['El JSON ha de ser un objecte.'] }

  if (!isNonEmptyString(parsed.id)) errors.push('Falta "id" (string).')
  if (!isNonEmptyString(parsed.titol)) errors.push('Falta "titol" (string).')
  if (!isNonEmptyString(parsed.descripcio)) errors.push('Falta "descripcio" (string).')

  const tipus = parsed.tipus as string
  if (!VALID_TYPES.includes(tipus as ExerciseType))
    errors.push(`"tipus" invàlid. Ha de ser: ${VALID_TYPES.join(', ')}.`)

  if (!VALID_LEVELS.includes(parsed.nivell as string))
    errors.push(`"nivell" invàlid. Ha de ser: ${VALID_LEVELS.join(', ')}.`)

  if (typeof parsed.temps_recomanat !== 'number' || parsed.temps_recomanat <= 0)
    errors.push('"temps_recomanat" ha de ser un número positiu.')

  // Metadata
  if (!isObject(parsed.metadata)) {
    errors.push('Falta "metadata" (objecte amb categoria, tema, tags).')
  } else {
    if (!isNonEmptyString(parsed.metadata.categoria)) errors.push('metadata: falta "categoria".')
    if (!isNonEmptyString(parsed.metadata.tema)) errors.push('metadata: falta "tema".')
    if (!Array.isArray(parsed.metadata.tags)) errors.push('metadata: "tags" ha de ser un array.')
  }

  // Questions
  if (!Array.isArray(parsed.preguntes) || parsed.preguntes.length === 0) {
    errors.push('"preguntes" ha de ser un array no buit.')
  } else {
    for (let i = 0; i < parsed.preguntes.length; i++) {
      const q = parsed.preguntes[i] as Record<string, unknown>
      if (!isObject(q)) { errors.push(`Pregunta ${i + 1}: ha de ser un objecte.`); continue }
      if (!isNonEmptyString(q.id)) errors.push(`Pregunta ${i + 1}: falta "id".`)

      switch (tipus) {
        case 'multiple-choice': validateMultipleChoice(q, i, errors); break
        case 'fill-in-the-blank': validateFillInTheBlank(q, i, errors); break
        case 'drag-and-drop': validateDragAndDrop(q, i, errors); break
        case 'word-classification': validateWordClassification(q, i, errors); break
      }
    }

    // Check duplicate IDs
    const ids = (parsed.preguntes as Record<string, unknown>[]).map((q) => q.id).filter(Boolean)
    const dupes = ids.filter((id, idx) => ids.indexOf(id) !== idx)
    if (dupes.length > 0) errors.push(`IDs de pregunta duplicats: ${[...new Set(dupes)].join(', ')}.`)
  }

  return { valid: errors.length === 0, errors }
}
