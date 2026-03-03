import type { ContentsManifest } from '../types/content'
import type { Exercise } from '../types/exercise'

const BASE_URL = import.meta.env.BASE_URL

export async function loadManifest(): Promise<ContentsManifest> {
  const response = await fetch(`${BASE_URL}continguts.json`)
  if (!response.ok) {
    throw new Error(`Error carregant el manifest: ${response.status}`)
  }
  return response.json()
}

export async function loadExercise(filePath: string): Promise<Exercise> {
  const response = await fetch(`${BASE_URL}exercicis/${filePath}`)
  if (!response.ok) {
    throw new Error(`Error carregant l'exercici: ${filePath}`)
  }
  return response.json()
}
