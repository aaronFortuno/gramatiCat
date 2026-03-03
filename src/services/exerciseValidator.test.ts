import { describe, it, expect } from 'vitest'
import { validateExerciseJson } from './exerciseValidator'

const validMC = JSON.stringify({
  id: 'test-mc-001',
  titol: 'Test',
  descripcio: 'Desc',
  tipus: 'multiple-choice',
  nivell: 'CS',
  temps_recomanat: 60,
  preguntes: [
    { id: 'q1', enunciat: 'Pregunta?', opcions: ['A', 'B'], resposta_correcta: 0, explicacio: 'Ok' },
  ],
  metadata: { categoria: 'ortografia', tema: 'accents', tags: ['test'] },
})

describe('exerciseValidator', () => {
  it('accepts a valid multiple-choice exercise', () => {
    const result = validateExerciseJson(validMC)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects invalid JSON syntax', () => {
    const result = validateExerciseJson('{ not json }')
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('JSON invàlid')
  })

  it('rejects non-object JSON', () => {
    const result = validateExerciseJson('"hello"')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('El JSON ha de ser un objecte.')
  })

  it('reports missing required fields', () => {
    const result = validateExerciseJson(JSON.stringify({}))
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Falta "id" (string).')
    expect(result.errors).toContain('Falta "titol" (string).')
    expect(result.errors).toContain('Falta "descripcio" (string).')
  })

  it('rejects invalid tipus', () => {
    const obj = JSON.parse(validMC)
    obj.tipus = 'quiz'
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('"tipus" invàlid'))).toBe(true)
  })

  it('rejects invalid nivell', () => {
    const obj = JSON.parse(validMC)
    obj.nivell = 'BACH'
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('"nivell" invàlid'))).toBe(true)
  })

  it('rejects negative temps_recomanat', () => {
    const obj = JSON.parse(validMC)
    obj.temps_recomanat = -10
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.valid).toBe(false)
  })

  it('validates multiple-choice question fields', () => {
    const obj = JSON.parse(validMC)
    obj.preguntes = [{ id: 'q1' }]
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('falta "enunciat"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('"opcions"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('"resposta_correcta"'))).toBe(true)
  })

  it('rejects out-of-range resposta_correcta', () => {
    const obj = JSON.parse(validMC)
    obj.preguntes[0].resposta_correcta = 5
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('fora de rang'))).toBe(true)
  })

  it('validates fill-in-the-blank question fields', () => {
    const obj = {
      id: 't', titol: 't', descripcio: 't', tipus: 'fill-in-the-blank',
      nivell: 'CS', temps_recomanat: 60,
      preguntes: [{ id: 'q1', enunciat: 'text _', buits: [{}], explicacio: 'ok' }],
      metadata: { categoria: 'a', tema: 'b', tags: [] },
    }
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('falta "posicio"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('falta "resposta_correcta"'))).toBe(true)
  })

  it('validates drag-and-drop question fields', () => {
    const obj = {
      id: 't', titol: 't', descripcio: 't', tipus: 'drag-and-drop',
      nivell: 'CS', temps_recomanat: 60,
      preguntes: [{ id: 'q1' }],
      metadata: { categoria: 'a', tema: 'b', tags: [] },
    }
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('"elements"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('"zones"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('"parelles_correctes"'))).toBe(true)
  })

  it('validates word-classification question fields', () => {
    const obj = {
      id: 't', titol: 't', descripcio: 't', tipus: 'word-classification',
      nivell: 'CS', temps_recomanat: 60,
      preguntes: [{ id: 'q1' }],
      metadata: { categoria: 'a', tema: 'b', tags: [] },
    }
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('"paraules"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('"columnes"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('"classificacio_correcta"'))).toBe(true)
  })

  it('detects duplicate question IDs', () => {
    const obj = JSON.parse(validMC)
    obj.preguntes.push({ ...obj.preguntes[0] })
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('duplicats'))).toBe(true)
  })

  it('rejects missing metadata fields', () => {
    const obj = JSON.parse(validMC)
    obj.metadata = {}
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('falta "categoria"'))).toBe(true)
    expect(result.errors.some((e) => e.includes('falta "tema"'))).toBe(true)
  })

  it('rejects empty preguntes array', () => {
    const obj = JSON.parse(validMC)
    obj.preguntes = []
    const result = validateExerciseJson(JSON.stringify(obj))
    expect(result.errors.some((e) => e.includes('array no buit'))).toBe(true)
  })
})
