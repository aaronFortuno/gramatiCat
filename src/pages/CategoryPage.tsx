import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadManifest } from '../services/contentService'
import type { Category } from '../types/content'

export default function CategoryPage() {
  const { categoriaId } = useParams<{ categoriaId: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadManifest()
      .then((m) => {
        setCategory(m.categories.find((c) => c.id === categoriaId) ?? null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [categoriaId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Categoria no trobada</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Tornar a l'inici
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Inici
        </Link>
        {' / '}
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
        <span className="text-3xl">{category.icona}</span>
        {category.nom}
      </h1>
      <p className="text-gray-500 mb-8">{category.descripcio}</p>

      <div className="space-y-3">
        {category.temes.map((tema) => {
          const hasExercises = tema.exercicis.length > 0
          return (
            <Link
              key={tema.id}
              to={`/categoria/${categoriaId}/${tema.id}`}
              className={`block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all ${
                !hasExercises ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{tema.nom}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tema.descripcio}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      hasExercises
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {tema.exercicis.length} {tema.exercicis.length === 1 ? 'exercici' : 'exercicis'}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
