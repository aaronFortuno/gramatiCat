import { Link } from 'react-router-dom'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="Obrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700">
          <span className="text-2xl">🐱</span>
          <span>gramatiCat</span>
        </Link>
      </div>
      <nav className="flex items-center gap-4">
        <Link to="/estadistiques" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
          Estadístiques
        </Link>
        <Link to="/medalles" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
          Medalles
        </Link>
      </nav>
    </header>
  )
}
