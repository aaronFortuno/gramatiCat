import { useState } from 'react'
import type { MultipleChoiceQuestion } from '../../types/exercise'

interface Props {
  pregunta: MultipleChoiceQuestion
  onAnswer: (correct: boolean) => void
}

export default function MultipleChoice({ pregunta, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const isCorrect = selected === pregunta.resposta_correcta

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
  }

  function handleSubmit() {
    if (selected === null || answered) return
    setAnswered(true)
    onAnswer(isCorrect)
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-800">{pregunta.enunciat}</p>

      <div className="space-y-2">
        {pregunta.opcions.map((opcio, i) => {
          let classes = 'w-full text-left px-4 py-3 rounded-lg border-2 transition-all '
          if (!answered) {
            classes += selected === i
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          } else if (i === pregunta.resposta_correcta) {
            classes += 'border-green-500 bg-green-50 text-green-700'
          } else if (i === selected) {
            classes += 'border-red-500 bg-red-50 text-red-700'
          } else {
            classes += 'border-gray-200 text-gray-400'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={classes}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {opcio}
            </button>
          )
        })}
      </div>

      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Comprova
        </button>
      )}

      {answered && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correcte!' : 'Incorrecte'}
          </p>
          {pregunta.explicacio && (
            <p className="text-sm text-gray-600 mt-1">{pregunta.explicacio}</p>
          )}
        </div>
      )}
    </div>
  )
}
