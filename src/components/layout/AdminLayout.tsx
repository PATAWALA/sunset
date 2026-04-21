import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Image, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Veuillez vous connecter')
      navigate('/admin/login')
    }
    setIsLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnexion réussie')
    navigate('/admin/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Événements', path: '/admin/events' },
    { icon: Users, label: 'Réservations', path: '/admin/reservations' },
    { icon: Image, label: 'Galerie', path: '/admin/gallery' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center night-gradient">
        <div className="w-12 h-12 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen night-gradient flex">
      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 h-full transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-20'}
        bg-night/95 backdrop-blur-md border-r border-white/10
      `}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full sunset-gradient" />
              <span className="font-bold text-white">Sunset Admin</span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full sunset-gradient mx-auto" />
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white/60 hover:text-white hidden md:block"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                ${location.pathname === item.path 
                  ? 'bg-sunset-500 text-white' 
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all mb-2"
          >
            <Home size={20} />
            {isSidebarOpen && <span>Voir le site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout