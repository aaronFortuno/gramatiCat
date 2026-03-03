import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { loadManifest } from '../../services/contentService'
import type { Category } from '../../types/content'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    loadManifest()
      .then((manifest) => setCategories(manifest.categories))
      .catch((err) => console.error('Error carregant categories:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      <div className="flex">
        <Sidebar
          categories={categories}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
