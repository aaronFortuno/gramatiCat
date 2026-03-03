import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadManifest } from '../services/contentService'
import type { Category, Topic } from '../types/content'

export default function TopicPage() {
  const { categoriaId, temaId } = useParams<{ categoriaId: string; temaId: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadManifest()
      .then((m) => {
        const cat = m.categories.find((c) => c.id === categoriaId) ?? null
        setCategory(cat)
        setTopic(cat?.temes.find((t) => t.id === temaId) ?? null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [categoriaId, temaId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!category || !topic) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Tema no trobat</p>
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
        <Link
          to={`/categoria/${categoriaId}`}
          className="hover:text-blue-600 transition-colors"
        >
          {category.nom}
        </Link>
        {' / '}
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{topic.nom}</h1>
      <p className="text-gray-500 mb-8">{topic.descripcio}</p>

      {topic.exercicis.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-500">Encara no hi ha exercicis per a aquest tema.</p>
          <p className="text-sm text-gray-400 mt-1">
            Estaran disponibles properament!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topic.exercicis.map((ex, i) => (
            <Link
              key={ex.id}
              to={`/exercici/${ex.id}`}
              className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ex.titol}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
