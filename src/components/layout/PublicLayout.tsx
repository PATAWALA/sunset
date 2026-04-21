import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, MapPin, Phone, Clock } from 'lucide-react'
import { FaInstagram, FaFacebook } from "react-icons/fa"
import { useState } from 'react'

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Événements', path: '/events' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Notre Histoire', path: '/our-story' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F1A]/95 backdrop-blur-xl border-b border-white/10">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-[#F5A623] to-[#D9385E] text-white py-2 px-4 text-sm hidden md:block">
          <div className="container mx-auto flex justify-between">
            <div className="flex gap-6">
              <span className="flex items-center gap-2">
                <MapPin size={16} /> Ouagadougou, Quartier Ouaga 2000
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> Mar-Dim: 18h - 02h
              </span>
            </div>
            <div className="flex gap-4">
              <a href="tel:+22600000000" className="flex items-center gap-2 hover:text-white/80">
                <Phone size={16} /> +226 00 00 00 00
              </a>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full sunset-gradient flex items-center justify-center"
              >
                <span className="text-white text-xl">🌅</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-display font-bold sunset-gradient bg-clip-text text-transparent">
                  Sunset
                </h1>
                <p className="text-xs text-gray-400">Bar & Restaurant</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#F5A623]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/events" className="btn-primary text-sm px-6 py-2">
                Réserver une table
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 space-y-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    location.pathname === link.path
                      ? 'text-[#F5A623]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/events"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary block text-center"
              >
                Réserver une table
              </Link>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-28 md:pt-32">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0F0F1A] border-t border-white/10">
        <div className="container mx-auto section-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full sunset-gradient flex items-center justify-center">
                  <span className="text-white text-xl">🌅</span>
                </div>
                <h2 className="text-xl font-display font-bold text-white">Sunset</h2>
              </Link>
              <p className="text-gray-400 text-sm">
                Une sensation émouvante et émerveilleuse à Ouagadougou.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-[#F5A623] transition">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F5A623] transition">
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/events" className="hover:text-[#F5A623]">Événements</Link></li>
                <li><Link to="/gallery" className="hover:text-[#F5A623]">Galerie</Link></li>
                <li><Link to="/our-story" className="hover:text-[#F5A623]">Notre Histoire</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1" />
                  <span>Quartier Ouaga 2000, Ouagadougou</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <a href="tel:+22600000000" className="hover:text-[#F5A623]">+226 00 00 00 00</a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Mar-Dim: 18h - 02h</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Recevez nos événements en avant-première
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 rounded-l-full bg-[#1A1A2E] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5A623]"
                />
                <button className="bg-[#F5A623] hover:bg-[#FF6B35] px-6 py-2 rounded-r-full font-medium transition">
                  OK
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Sunset Bar & Restaurant. Tous droits réservés. Come and see 😍
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout