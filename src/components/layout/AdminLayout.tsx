import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  Home,
  Menu,
  X,
  ShoppingCart,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Session expirée, veuillez vous reconnecter')
      navigate('/portal')
    }
    setIsLoading(false)
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Calendar, label: 'Événements', path: '/admin/events' },
    { icon: Users, label: 'Réservations', path: '/admin/reservations' },
    { icon: ShoppingCart, label: 'Gestion des plats', path: '/admin/menu' },
    { icon: Image, label: 'Galerie', path: '/admin/gallery' },
  ]

  const isActive = (path: string) => {
    if (path === '/admin/dashboard' && location.pathname === '/admin') return true
    return location.pathname.startsWith(path)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-12 h-12 border-4 border-sage-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-cream-50">
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-cream-200 shadow-sm transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-cream-200">
          {isSidebarOpen ? (
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-terracotta-500 flex items-center justify-center">
                <UtensilsCrossed size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-sage-800">L'Imprévu</span>
            </Link>
          ) : (
            <Link to="/admin/dashboard" className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-terracotta-500 flex items-center justify-center">
                <UtensilsCrossed size={16} className="text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-sage-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition"
            title={isSidebarOpen ? "Réduire la barre latérale" : "Agrandir la barre latérale"}
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-sage-600 text-white shadow-md shadow-sage-500/20'
                  : 'text-gray-600 hover:bg-sage-50 hover:text-sage-800'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Lien vers le site public */}
        <div className="p-2 border-t border-cream-200">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-sage-50 hover:text-sage-800 transition-all ${
              !isSidebarOpen && 'justify-center'
            }`}
            title={!isSidebarOpen ? 'Voir le site' : ''}
          >
            <Home size={20} />
            {isSidebarOpen && <span>Voir le site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-cream-200 px-4 py-3 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-terracotta-500 flex items-center justify-center">
            <UtensilsCrossed size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-sage-800">L'Imprévu</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-sage-600 hover:bg-sage-50 rounded-lg"
          title="Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-sage-900/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 bg-white border-r border-cream-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 flex items-center px-6 border-b border-cream-200">
              <span className="font-display font-bold text-sage-800 text-lg">Menu</span>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? 'bg-sage-600 text-white'
                      : 'text-gray-600 hover:bg-sage-50 hover:text-sage-800'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-sage-50 hover:text-sage-800"
              >
                <Home size={20} />
                <span>Voir le site</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 pt-16 md:pt-0 bg-cream-50">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout