import { useState, useMemo } from 'react'
import { validateExerciseJson } from '../services/exerciseValidator'
import ExerciseRunner from '../components/exercises/ExerciseRunner'
import type { Exercise } from '../types/exercise'

const TEMPLATES: Record<string, string> = {
  'multiple-choice': JSON.stringify({
    id: 'categoria-tema-001',
    titol: 'Títol de l\'exercici',
    descripcio: 'Descripció breu.',
    tipus: 'multiple-choice',
    nivell: 'CS',
    temps_recomanat: 120,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Quina és la resposta correcta?',
        opcions: ['Opció A', 'Opció B', 'Opció C', 'Opció D'],
        resposta_correcta: 1,
        explicacio: 'Explicació de per què B és correcta.',
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
  'fill-in-the-blank': JSON.stringify({
    id: 'categoria-tema-001',
    titol: 'Títol de l\'exercici',
    descripcio: 'Descripció breu.',
    tipus: 'fill-in-the-blank',
    nivell: 'CS',
    temps_recomanat: 120,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Completa: La Maria va _eure aigua.',
        buits: [{ posicio: 0, resposta_correcta: 'b', opcions: ['b', 'v'] }],
        explicacio: 'Beure s\'escriu amb b.',
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
  'drag-and-drop': JSON.stringify({
    id: 'categoria-tema-001',
    titol: 'Títol de l\'exercici',
    descripcio: 'Descripció breu.',
    tipus: 'drag-and-drop',
    nivell: 'CS',
    temps_recomanat: 180,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Classifica els elements.',
        elements: ['element1', 'element2'],
        zones: ['zona A', 'zona B'],
        parelles_correctes: { element1: 'zona A', element2: 'zona B' },
        explicacio: 'Explicació.',
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
  'word-classification': JSON.stringify({
    id: 'categoria-tema-001',
    titol: 'Títol de l\'exercici',
    descripcio: 'Descripció breu.',
    tipus: 'word-classification',
    nivell: 'CS',
    temps_recomanat: 180,
    preguntes: [
      {
        id: 'q1',
        enunciat: 'Classifica les paraules.',
        paraules: ['paraula1', 'paraula2', 'paraula3'],
        columnes: ['columna A', 'columna B'],
        classificacio_correcta: { 'columna A': ['paraula1'], 'columna B': ['paraula2', 'paraula3'] },
        explicacio: 'Explicació.',
      },
    ],
    metadata: { categoria: 'categoria', tema: 'tema', tags: ['tag1'] },
  }, null, 2),
}

export default function AdminPage() {
  const [json, setJson] = useState(TEMPLATES['multiple-choice'])
  const [previewKey, setPreviewKey] = useState(0)

  const validation = useMemo(() => validateExerciseJson(json), [json])

  const exercise = useMemo<Exercise | null>(() => {
    if (!validation.valid) return null
    try {
      return JSON.parse(json) as Exercise
    } catch {
      return null
    }
  }, [json, validation.valid])

  function handleDownload() {
    try {
      const formatted = JSON.stringify(JSON.parse(json), null, 2)
      const blob = new Blob([formatted], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = exercise?.id ? `${exercise.id}.json` : 'exercici.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch { /* validation already catches parse errors */ }
  }

  function handlePreview() {
    setPreviewKey((k) => k + 1)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Admin Previewer</h1>
      <p className="text-sm text-gray-500">
        Edita el JSON d'un exercici i previsualitza'l en temps real.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor panel */}
        <div className="space-y-3">
          {/* Template buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-400 self-center">Plantilla:</span>
            {Object.keys(TEMPLATES).map((type) => (
              <button
                key={type}
                onClick={() => { setJson(TEMPLATES[type]); setPreviewKey((k) => k + 1) }}
                className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>

          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
            className="w-full h-[500px] font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-xl border border-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Validation status */}
          {validation.valid ? (
            <p className="text-sm text-green-600 font-medium">JSON vàlid</p>
          ) : (
            <div className="space-y-1">
              {validation.errors.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              disabled={!validation.valid}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previsualitzar
            </button>
            <button
              onClick={handleDownload}
              disabled={!validation.valid}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Descarregar JSON
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px]">
          {exercise ? (
            <div key={previewKey}>
              <p className="text-xs text-gray-400 mb-1">
                {exercise.metadata.categoria} / {exercise.metadata.tema}
              </p>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{exercise.titol}</h2>
              <p className="text-sm text-gray-500 mb-4">{exercise.descripcio}</p>
              <ExerciseRunner
                exercise={exercise}
                onComplete={() => {}}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <p className="text-center">
                La previsualització apareixerà aquí quan el JSON sigui vàlid.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
