import { useState } from 'react'
import type { DragAndDropQuestion } from '../../types/exercise'

interface Props {
  pregunta: DragAndDropQuestion
  onAnswer: (correct: boolean) => void
}

export default function DragAndDrop({ pregunta, onAnswer }: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [answered, setAnswered] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const assignedElements = new Set(Object.keys(assignments))
  const unassigned = pregunta.elements.filter((el) => !assignedElements.has(el))

  function handleDragStart(element: string) {
    setDraggedItem(element)
  }

  function handleDrop(zone: string) {
    if (!draggedItem || answered) return
    setAssignments((prev) => ({ ...prev, [draggedItem]: zone }))
    setDraggedItem(null)
  }

  function handleRemove(element: string) {
    if (answered) return
    setAssignments((prev) => {
      const next = { ...prev }
      delete next[element]
      return next
    })
  }

  function handleSubmit() {
    if (answered || unassigned.length > 0) return
    setAnswered(true)
    const allCorrect = pregunta.elements.every(
      (el) => assignments[el] === pregunta.parelles_correctes[el]
    )
    onAnswer(allCorrect)
  }

  const allCorrect =
    answered &&
    pregunta.elements.every(
      (el) => assignments[el] === pregunta.parelles_correctes[el]
    )

  return (
    <div className="space-y-5">
      <p className="text-lg font-medium text-gray-800">{pregunta.enunciat}</p>

      {/* Elements per arrossegar */}
      {unassigned.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unassigned.map((el) => (
            <button
              key={el}
              draggable={!answered}
              onDragStart={() => handleDragStart(el)}
              onClick={() => !answered && setDraggedItem(draggedItem === el ? null : el)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium cursor-grab active:cursor-grabbing transition-all ${
                draggedItem === el
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              {el}
            </button>
          ))}
        </div>
      )}

      {draggedItem && !answered && (
        <p className="text-sm text-blue-600">
          Toca una zona per col·locar: <strong>{draggedItem}</strong>
        </p>
      )}

      {/* Zones target */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pregunta.zones.map((zone) => {
          const elementsInZone = Object.entries(assignments)
            .filter(([, z]) => z === zone)
            .map(([el]) => el)

          return (
            <div
              key={zone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(zone)}
              onClick={() => draggedItem && handleDrop(zone)}
              className={`min-h-24 p-4 rounded-lg border-2 border-dashed transition-all ${
                draggedItem
                  ? 'border-blue-400 bg-blue-50/50 cursor-pointer'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {zone}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {elementsInZone.map((el) => {
                  let pillClass = 'px-3 py-1 rounded text-sm font-medium '
                  if (!answered) {
                    pillClass += 'bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200'
                  } else if (pregunta.parelles_correctes[el] === zone) {
                    pillClass += 'bg-green-100 text-green-700'
                  } else {
                    pillClass += 'bg-red-100 text-red-700'
                  }

                  return (
                    <button
                      key={el}
                      onClick={() => handleRemove(el)}
                      disabled={answered}
                      className={pillClass}
                    >
                      {el}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
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
            <p className="text-sm text-gray-600 mt-1">
              Solució:{' '}
              {pregunta.elements
                .map((el) => `${el} → ${pregunta.parelles_correctes[el]}`)
                .join(' | ')}
            </p>
          )}
          {pregunta.explicacio && (
            <p className="text-sm text-gray-600 mt-1">{pregunta.explicacio}</p>
          )}
        </div>
      )}
    </div>
  )
}
