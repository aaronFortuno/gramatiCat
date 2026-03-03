import { HashRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const TopicPage = lazy(() => import('./pages/TopicPage'))
const ExercisePage = lazy(() => import('./pages/ExercisePage'))
const StatsPage = lazy(() => import('./pages/StatsPage'))
const MedalsPage = lazy(() => import('./pages/MedalsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function Loading() {
  return <p className="text-gray-400 p-8">Carregant...</p>
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categoria/:categoriaId" element={<CategoryPage />} />
            <Route path="/categoria/:categoriaId/:temaId" element={<TopicPage />} />
            <Route path="/exercici/:exerciciId" element={<ExercisePage />} />
            <Route path="/estadistiques" element={<StatsPage />} />
            <Route path="/medalles" element={<MedalsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
