import { useState } from 'react'
import type { Exercise, MultipleChoiceQuestion, FillInTheBlankQuestion } from '../../types/exercise'
import MultipleChoice from './MultipleChoice'
import FillInTheBlank from './FillInTheBlank'

interface Props {
  exercise: Exercise
  onComplete: (encerts: number, errors: number) => void
}

export default function ExerciseRunner({ exercise, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [encerts, setEncerts] = useState(0)
  const [errors, setErrors] = useState(0)
  const [finished, setFinished] = useState(false)
  const [waitingNext, setWaitingNext] = useState(false)

  const total = exercise.preguntes.length
  const pregunta = exercise.preguntes[currentIndex]

  function handleAnswer(correct: boolean) {
    if (correct) {
      setEncerts((e) => e + 1)
    } else {
      setErrors((e) => e + 1)
    }
    setWaitingNext(true)
  }

  function handleNext() {
    const nextIndex = currentIndex + 1
    if (nextIndex >= total) {
      setFinished(true)
      const finalEncerts = encerts + (waitingNext ? 0 : 0) // already updated
      onComplete(finalEncerts, errors)
    } else {
      setCurrentIndex(nextIndex)
      setWaitingNext(false)
    }
  }

  if (finished) {
    const finalEncerts = encerts
    const finalErrors = errors
    const percentage = total > 0 ? Math.round((finalEncerts / total) * 100) : 0

    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">
          {percentage >= 90 ? '🏆' : percentage >= 70 ? '⭐' : percentage >= 50 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Exercici completat!</h2>
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{finalEncerts}</p>
            <p className="text-sm text-gray-500">Correctes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-500">{finalErrors}</p>
            <p className="text-sm text-gray-500">Incorrectes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
            <p className="text-sm text-gray-500">Encerts</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / total) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Pregunta */}
      {exercise.tipus === 'multiple-choice' && (
        <MultipleChoice
          key={pregunta.id}
          pregunta={pregunta as MultipleChoiceQuestion}
          onAnswer={handleAnswer}
        />
      )}

      {exercise.tipus === 'fill-in-the-blank' && (
        <FillInTheBlank
          key={pregunta.id}
          pregunta={pregunta as FillInTheBlankQuestion}
          onAnswer={handleAnswer}
        />
      )}

      {exercise.tipus === 'drag-and-drop' && (
        <div className="p-8 text-center text-gray-400">
          Tipus drag-and-drop en desenvolupament (Fase 1.2)
        </div>
      )}

      {exercise.tipus === 'word-classification' && (
        <div className="p-8 text-center text-gray-400">
          Tipus word-classification en desenvolupament (Fase 1.2)
        </div>
      )}

      {/* Botó següent */}
      {waitingNext && (
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {currentIndex + 1 < total ? 'Següent' : 'Veure resultats'}
        </button>
      )}
    </div>
  )
}
