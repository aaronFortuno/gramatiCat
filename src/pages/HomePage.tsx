import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadManifest } from '../services/contentService'
import type { Category } from '../types/content'

const COLOR_MAP: Record<string, string> = {
  '#2563eb': 'border-blue-400 hover:border-blue-500 hover:shadow-blue-100',
  '#16a34a': 'border-green-400 hover:border-green-500 hover:shadow-green-100',
  '#f59e0b': 'border-amber-400 hover:border-amber-500 hover:shadow-amber-100',
  '#dc2626': 'border-red-400 hover:border-red-500 hover:shadow-red-100',
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadManifest()
      .then((m) => setCategories(m.categories))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalExercicis = categories.reduce(
    (sum, c) => sum + c.temes.reduce((s, t) => s + t.exercicis.length, 0),
    0
  )

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          <span className="text-5xl mr-2">🐱</span>gramatiCat
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Practica la teva llengua catalana amb exercicis interactius
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {categories.length} categories &middot; {totalExercicis} exercicis
        </p>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {categories.map((cat) => {
          const exerciseCount = cat.temes.reduce((s, t) => s + t.exercicis.length, 0)
          const colorClass = COLOR_MAP[cat.color] ?? 'border-gray-300 hover:border-gray-400'

          return (
            <Link
              key={cat.id}
              to={`/categoria/${cat.id}`}
              className={`block p-6 bg-white rounded-xl border-2 ${colorClass} hover:shadow-lg transition-all duration-200`}
            >
              <div className="text-4xl mb-3">{cat.icona}</div>
              <h2 className="text-xl font-bold text-gray-900">{cat.nom}</h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.descripcio}</p>
              <div className="flex gap-4 mt-4 text-xs text-gray-400">
                <span>{cat.temes.length} temes</span>
                <span>{exerciseCount} exercicis</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
