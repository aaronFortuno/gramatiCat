import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadManifest, loadExercise } from '../services/contentService'
import {
  updateCategoryStats,
  addHistorialEntry,
  updateStreaks,
  getStreaks,
  getMedalles,
  addMedalla,
  getHistorial,
} from '../services/storageService'
import { checkMedals } from '../services/gamificationService'
import ExerciseRunner from '../components/exercises/ExerciseRunner'
import type { Exercise } from '../types/exercise'
import type { EarnedMedal } from '../types/gamification'

export default function ExercisePage() {
  const { exerciciId } = useParams<{ exerciciId: string }>()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startTime] = useState(() => Date.now())
  const [completed, setCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [newMedals, setNewMedals] = useState<EarnedMedal[]>([])
  const [bonusTemps, setBonusTemps] = useState<number>(0)

  useEffect(() => {
    if (!exerciciId) return

    loadManifest()
      .then((manifest) => {
        for (const cat of manifest.categories) {
          for (const tema of cat.temes) {
            const ex = tema.exercicis.find((e) => e.id === exerciciId)
            if (ex) {
              return loadExercise(ex.fitxer)
            }
          }
        }
        throw new Error(`Exercici no trobat: ${exerciciId}`)
      })
      .then(setExercise)
      .catch((err) => setError(err.message))
  }, [exerciciId])

  const handleAnswer = useCallback((correct: boolean) => {
    const streaks = updateStreaks(correct)
    setStreak(streaks.ratxaActual)
  }, [])

  function handleComplete(encerts: number, errors: number, tempsUsed: number) {
    if (!exercise || completed) return
    setCompleted(true)

    const temps = tempsUsed > 0 ? tempsUsed : Math.round((Date.now() - startTime) / 1000)

    // Calculate time bonus: percentage of recommended time saved, scaled 0-100
    const tempsRecomanat = exercise.temps_recomanat
    let bonus = 0
    const total = encerts + errors
    const percentage = total > 0 ? (encerts / total) * 100 : 0
    if (percentage >= 50 && tempsRecomanat > 0 && temps < tempsRecomanat) {
      bonus = Math.round(((tempsRecomanat - temps) / tempsRecomanat) * 100)
    }
    setBonusTemps(bonus)

    updateCategoryStats(exercise.metadata.categoria, encerts, errors, temps)
    addHistorialEntry({
      exerciciId: exercise.id,
      data: new Date().toISOString(),
      encerts,
      errors,
      temps,
      bonusTemps: bonus,
    })

    // Check medals
    const streaks = getStreaks()
    const today = new Date().toISOString().split('T')[0]
    const historial = getHistorial()
    const exercicisAvui = historial.filter((h) => h.data.startsWith(today)).length

    const medals = checkMedals({
      categoriaId: exercise.metadata.categoria,
      encerts,
      errors,
      temps,
      ratxaMaxima: streaks.ratxaMaxima,
      ratxaDiaria: streaks.ratxaDiaria,
      exercicisAvui,
      bonusTemps: bonus,
      earnedMedals: getMedalles(),
    })

    if (medals.length > 0) {
      for (const m of medals) {
        addMedalla(m)
      }
      setNewMedals(medals)
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Tornar a l'inici
        </Link>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">
        <Link
          to={`/categoria/${exercise.metadata.categoria}`}
          className="hover:text-blue-600 transition-colors"
        >
          {exercise.metadata.categoria}
        </Link>
        {' / '}
        <Link
          to={`/categoria/${exercise.metadata.categoria}/${exercise.metadata.tema}`}
          className="hover:text-blue-600 transition-colors"
        >
          {exercise.metadata.tema}
        </Link>
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{exercise.titol}</h1>
      <p className="text-gray-500 mb-6">{exercise.descripcio}</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ExerciseRunner
          exercise={exercise}
          onComplete={handleComplete}
          onAnswer={handleAnswer}
          streak={streak}
          newMedals={newMedals}
          bonusTemps={bonusTemps}
        />
      </div>

      {completed && (
        <div className="mt-6 flex gap-3">
          <Link
            to={`/categoria/${exercise.metadata.categoria}/${exercise.metadata.tema}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tornar al tema
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Repetir exercici
          </button>
        </div>
      )}
    </div>
  )
}
