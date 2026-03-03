import { useState, useCallback } from 'react'
import type {
  Exercise,
  MultipleChoiceQuestion,
  FillInTheBlankQuestion,
  DragAndDropQuestion,
  WordClassificationQuestion,
} from '../../types/exercise'
import type { EarnedMedal } from '../../types/gamification'
import { getMedalById } from '../../services/gamificationService'
import MultipleChoice from './MultipleChoice'
import FillInTheBlank from './FillInTheBlank'
import DragAndDrop from './DragAndDrop'
import WordClassification from './WordClassification'
import ExerciseTimer from './ExerciseTimer'
import StreakCounter from './StreakCounter'
import { useTimer } from '../../hooks/useTimer'

interface Props {
  exercise: Exercise
  onComplete: (encerts: number, errors: number, temps: number) => void
  onAnswer?: (correct: boolean) => void
  streak?: number
  newMedals?: EarnedMedal[]
  bonusTemps?: number
}

export default function ExerciseRunner({
  exercise,
  onComplete,
  onAnswer,
  streak = 0,
  newMedals = [],
  bonusTemps,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [encerts, setEncerts] = useState(0)
  const [errors, setErrors] = useState(0)
  const [finished, setFinished] = useState(false)
  const [waitingNext, setWaitingNext] = useState(false)

  const total = exercise.preguntes.length
  const pregunta = exercise.preguntes[currentIndex]
  const tempsRecomanat = exercise.temps_recomanat

  // Track actual counts in refs to avoid stale state on expire
  const encertsRef = { current: encerts }
  const errorsRef = { current: errors }

  const handleExpire = useCallback(() => {
    // All unanswered questions count as errors
    const remaining = total - (encertsRef.current + errorsRef.current)
    const finalEncerts = encertsRef.current
    const finalErrors = errorsRef.current + remaining
    setEncerts(finalEncerts)
    setErrors(finalErrors)
    setFinished(true)
    onComplete(finalEncerts, finalErrors, 0)
  }, [total, onComplete])

  const timer = useTimer(tempsRecomanat, handleExpire)

  // Start timer on first render
  useState(() => {
    timer.start()
  })

  function handleAnswer(correct: boolean) {
    if (correct) {
      setEncerts((e) => {
        encertsRef.current = e + 1
        return e + 1
      })
    } else {
      setErrors((e) => {
        errorsRef.current = e + 1
        return e + 1
      })
    }
    onAnswer?.(correct)
    setWaitingNext(true)
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      timer.pause()
      setFinished(true)
      onComplete(encertsRef.current, errorsRef.current, tempsRecomanat - timer.secondsLeft)
    } else {
      setCurrentIndex(currentIndex + 1)
      setWaitingNext(false)
    }
  }

  if (finished) {
    const finalTotal = encerts + errors
    const percentage = finalTotal > 0 ? Math.round((encerts / finalTotal) * 100) : 0

    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">
          {percentage >= 90 ? '🏆' : percentage >= 70 ? '⭐' : percentage >= 50 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Exercici completat!</h2>
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{encerts}</p>
            <p className="text-sm text-gray-500">Correctes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-500">{errors}</p>
            <p className="text-sm text-gray-500">Incorrectes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
            <p className="text-sm text-gray-500">Encerts</p>
          </div>
        </div>

        {bonusTemps !== undefined && bonusTemps > 0 && (
          <div className="text-center">
            <p className="text-lg font-semibold text-amber-600">
              ⚡ Bonus de temps: +{bonusTemps} punts
            </p>
          </div>
        )}

        {newMedals.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Noves medalles!</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {newMedals.map((m) => {
                const medal = getMedalById(m.id)
                return (
                  <div
                    key={m.id}
                    className="flex flex-col items-center gap-1 p-3 bg-yellow-50 border border-yellow-200 rounded-xl animate-streak-pop"
                  >
                    <span className="text-3xl">{medal?.icona ?? '🏅'}</span>
                    <span className="text-xs font-medium text-gray-700">{medal?.nom ?? m.id}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderQuestion() {
    switch (exercise.tipus) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            key={pregunta.id}
            pregunta={pregunta as MultipleChoiceQuestion}
            onAnswer={handleAnswer}
          />
        )
      case 'fill-in-the-blank':
        return (
          <FillInTheBlank
            key={pregunta.id}
            pregunta={pregunta as FillInTheBlankQuestion}
            onAnswer={handleAnswer}
          />
        )
      case 'drag-and-drop':
        return (
          <DragAndDrop
            key={pregunta.id}
            pregunta={pregunta as DragAndDropQuestion}
            onAnswer={handleAnswer}
          />
        )
      case 'word-classification':
        return (
          <WordClassification
            key={pregunta.id}
            pregunta={pregunta as WordClassificationQuestion}
            onAnswer={handleAnswer}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress bar + timer + streak */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
          {currentIndex + 1} / {total}
        </span>
        <StreakCounter streak={streak} />
        <ExerciseTimer
          secondsLeft={timer.secondsLeft}
          totalSeconds={timer.totalSeconds}
          urgency={timer.urgency}
        />
      </div>

      {renderQuestion()}

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
