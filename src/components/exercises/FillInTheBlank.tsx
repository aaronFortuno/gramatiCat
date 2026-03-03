import { useState } from 'react'
import type { FillInTheBlankQuestion } from '../../types/exercise'

interface Props {
  pregunta: FillInTheBlankQuestion
  onAnswer: (correct: boolean) => void
}

export default function FillInTheBlank({ pregunta, onAnswer }: Props) {
  const [answers, setAnswers] = useState<string[]>(
    pregunta.buits.map(() => '')
  )
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState<boolean[]>([])

  function handleChange(index: number, value: string) {
    if (answered) return
    const next = [...answers]
    next[index] = value
    setAnswers(next)
  }

  function handleSubmit() {
    if (answered) return
    const r = pregunta.buits.map(
      (buit, i) => answers[i].trim().toLowerCase() === buit.resposta_correcta.toLowerCase()
    )
    setResults(r)
    setAnswered(true)
    onAnswer(r.every(Boolean))
  }

  const allCorrect = results.length > 0 && results.every(Boolean)
  const canSubmit = answers.every((a) => a.trim().length > 0)

  // Render enunciat amb inputs o selects inline
  function renderEnunciat() {
    const parts = pregunta.enunciat.split('_')
    const elements: React.ReactNode[] = []

    for (let i = 0; i < parts.length; i++) {
      elements.push(<span key={`t${i}`}>{parts[i]}</span>)

      if (i < pregunta.buits.length) {
        const buit = pregunta.buits[i]
        const isCorrectAnswer = results[i]

        if (buit.opcions && buit.opcions.length > 0) {
          // Select amb opcions
          elements.push(
            <select
              key={`b${i}`}
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              disabled={answered}
              className={`inline-block mx-1 px-3 py-1 rounded border-2 text-center font-medium transition-colors ${
                !answered
                  ? 'border-blue-300 bg-white focus:border-blue-500 focus:outline-none'
                  : isCorrectAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
              }`}
            >
              <option value="">—</option>
              {buit.opcions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )
        } else {
          // Input lliure
          elements.push(
            <input
              key={`b${i}`}
              type="text"
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              disabled={answered}
              className={`inline-block mx-1 px-3 py-1 rounded border-2 text-center font-medium w-20 transition-colors ${
                !answered
                  ? 'border-blue-300 bg-white focus:border-blue-500 focus:outline-none'
                  : isCorrectAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
              }`}
              placeholder="..."
            />
          )
        }
      }
    }

    return elements
  }

  return (
    <div className="space-y-4">
      <p className="text-lg leading-relaxed text-gray-800">{renderEnunciat()}</p>

      {answered && !allCorrect && (
        <p className="text-sm text-gray-500">
          Resposta correcta:{' '}
          <span className="font-medium text-green-700">
            {pregunta.buits.map((b) => b.resposta_correcta).join(', ')}
          </span>
        </p>
      )}

      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Comprova
        </button>
      )}

      {answered && (
        <div
          className={`p-4 rounded-lg ${
            allCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className={`font-semibold ${allCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {allCorrect ? 'Correcte!' : 'Incorrecte'}
          </p>
          {pregunta.explicacio && (
            <p className="text-sm text-gray-600 mt-1">{pregunta.explicacio}</p>
          )}
        </div>
      )}
    </div>
  )
}
