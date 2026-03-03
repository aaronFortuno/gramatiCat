import { useState } from 'react'
import type { WordClassificationQuestion } from '../../types/exercise'

interface Props {
  pregunta: WordClassificationQuestion
  onAnswer: (correct: boolean) => void
}

export default function WordClassification({ pregunta, onAnswer }: Props) {
  const [columns, setColumns] = useState<Record<string, string[]>>(
    Object.fromEntries(pregunta.columnes.map((c) => [c, []]))
  )
  const [answered, setAnswered] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const assignedWords = new Set(Object.values(columns).flat())
  const unassigned = pregunta.paraules.filter((w) => !assignedWords.has(w))

  function handleAssign(column: string) {
    if (!selectedWord || answered) return
    setColumns((prev) => ({
      ...prev,
      [column]: [...prev[column], selectedWord],
    }))
    setSelectedWord(null)
  }

  function handleRemove(column: string, word: string) {
    if (answered) return
    setColumns((prev) => ({
      ...prev,
      [column]: prev[column].filter((w) => w !== word),
    }))
  }

  function handleSubmit() {
    if (answered || unassigned.length > 0) return
    setAnswered(true)

    const allCorrect = pregunta.columnes.every((col) => {
      const expected = new Set(pregunta.classificacio_correcta[col] ?? [])
      const actual = new Set(columns[col])
      return expected.size === actual.size && [...expected].every((w) => actual.has(w))
    })
    onAnswer(allCorrect)
  }

  const allCorrect =
    answered &&
    pregunta.columnes.every((col) => {
      const expected = new Set(pregunta.classificacio_correcta[col] ?? [])
      const actual = new Set(columns[col])
      return expected.size === actual.size && [...expected].every((w) => actual.has(w))
    })

  return (
    <div className="space-y-5">
      <p className="text-lg font-medium text-gray-800">{pregunta.enunciat}</p>

      {/* Paraules per classificar */}
      {unassigned.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unassigned.map((word) => (
            <button
              key={word}
              onClick={() => !answered && setSelectedWord(selectedWord === word ? null : word)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedWord === word
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {selectedWord && !answered && (
        <p className="text-sm text-blue-600">
          Toca una columna per col·locar: <strong>{selectedWord}</strong>
        </p>
      )}

      {/* Columnes */}
      <div className={`grid gap-3 grid-cols-${pregunta.columnes.length}`} style={{ gridTemplateColumns: `repeat(${pregunta.columnes.length}, 1fr)` }}>
        {pregunta.columnes.map((col) => (
          <div
            key={col}
            onClick={() => selectedWord && handleAssign(col)}
            className={`min-h-32 p-4 rounded-lg border-2 border-dashed transition-all ${
              selectedWord
                ? 'border-blue-400 bg-blue-50/50 cursor-pointer'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 text-center">
              {col}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {columns[col].map((word) => {
                const isCorrect = (pregunta.classificacio_correcta[col] ?? []).includes(word)
                let pillClass = 'px-3 py-1 rounded text-sm font-medium '
                if (!answered) {
                  pillClass += 'bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200'
                } else if (isCorrect) {
                  pillClass += 'bg-green-100 text-green-700'
                } else {
                  pillClass += 'bg-red-100 text-red-700'
                }

                return (
                  <button
                    key={word}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(col, word)
                    }}
                    disabled={answered}
                    className={pillClass}
                  >
                    {word}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={unassigned.length > 0}
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
          {!allCorrect && (
            <div className="text-sm text-gray-600 mt-1">
              <p>Solució:</p>
              {pregunta.columnes.map((col) => (
                <p key={col}>
                  <strong>{col}:</strong>{' '}
                  {(pregunta.classificacio_correcta[col] ?? []).join(', ')}
                </p>
              ))}
            </div>
          )}
          {pregunta.explicacio && (
            <p className="text-sm text-gray-600 mt-1">{pregunta.explicacio}</p>
          )}
        </div>
      )}
    </div>
  )
}
