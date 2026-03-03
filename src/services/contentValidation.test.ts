import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { validateExerciseJson } from './exerciseValidator'

const ROOT = resolve(__dirname, '../../public')
const manifestPath = resolve(ROOT, 'continguts.json')

interface ExRef {
  id: string
  titol: string
  fitxer: string
}

interface Topic {
  id: string
  exercicis: ExRef[]
}

interface Category {
  id: string
  temes: Topic[]
}

interface Manifest {
  categories: Category[]
}

function loadManifest(): Manifest {
  return JSON.parse(readFileSync(manifestPath, 'utf-8'))
}

function getAllExerciseRefs(manifest: Manifest): ExRef[] {
  const refs: ExRef[] = []
  for (const cat of manifest.categories) {
    for (const tema of cat.temes) {
      for (const ex of tema.exercicis) {
        refs.push(ex)
      }
    }
  }
  return refs
}

describe('Content validation (6.6)', () => {
  const manifest = loadManifest()
  const refs = getAllExerciseRefs(manifest)

  it('continguts.json is valid JSON', () => {
    expect(() => loadManifest()).not.toThrow()
  })

  it('has at least one exercise', () => {
    expect(refs.length).toBeGreaterThan(0)
  })

  it('all exercise IDs are unique', () => {
    const ids = refs.map((r) => r.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dupes).toEqual([])
  })

  it('all referenced exercise files exist', () => {
    for (const ref of refs) {
      const filePath = resolve(ROOT, 'exercicis', ref.fitxer)
      expect(existsSync(filePath), `Missing file: ${ref.fitxer}`).toBe(true)
    }
  })

  it('all exercise JSON files pass schema validation', () => {
    for (const ref of refs) {
      const filePath = resolve(ROOT, 'exercicis', ref.fitxer)
      const content = readFileSync(filePath, 'utf-8')
      const result = validateExerciseJson(content)
      expect(result.valid, `Invalid: ${ref.fitxer} — ${result.errors.join('; ')}`).toBe(true)
    }
  })

  it('exercise file IDs match manifest IDs', () => {
    for (const ref of refs) {
      const filePath = resolve(ROOT, 'exercicis', ref.fitxer)
      const content = JSON.parse(readFileSync(filePath, 'utf-8'))
      expect(content.id, `ID mismatch in ${ref.fitxer}`).toBe(ref.id)
    }
  })

  it('every category has at least one topic', () => {
    for (const cat of manifest.categories) {
      expect(cat.temes.length, `Category ${cat.id} has no topics`).toBeGreaterThan(0)
    }
  })

  it('every topic has at least one exercise', () => {
    for (const cat of manifest.categories) {
      for (const tema of cat.temes) {
        expect(
          tema.exercicis.length,
          `Topic ${cat.id}/${tema.id} has no exercises`
        ).toBeGreaterThan(0)
      }
    }
  })
})
