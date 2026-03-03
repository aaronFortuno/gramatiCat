import { NavLink } from 'react-router-dom'
import type { Category } from '../../types/content'

interface SidebarProps {
  categories: Category[]
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ categories, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out pt-16 lg:pt-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Categories
          </p>
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/categoria/${cat.id}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <span className="text-lg">{cat.icona}</span>
              <span>{cat.nom}</span>
            </NavLink>
          ))}
          <div className="border-t border-gray-100 my-4" />
          <NavLink
            to="/admin"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50'
              }`
            }
          >
            <span className="text-lg">🔧</span>
            <span>Admin Previewer</span>
          </NavLink>
        </nav>
      </aside>
    </>
  )
}
