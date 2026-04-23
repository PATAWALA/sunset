import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MapPin, Phone, Clock, Sparkles, Music } from 'lucide-react'
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa"
import { useState, useEffect } from 'react'

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Événements', path: '/events' },
    { name: 'Menu', path: '/menu' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Notre Histoire', path: '/our-story' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-night">
      {/* Header - TOUJOURS OPAQUE */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F1A] border-b border-white/10">
        {/* Top bar festive */}
        <div className="bg-gradient-to-r from-[#F5A623] via-[#FF6B35] to-[#D9385E] text-white py-2 px-4 text-sm overflow-hidden">
          <div className="container mx-auto flex justify-between items-center">
            <motion.div 
              animate={{ x: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex gap-6"
            >
              <span className="flex items-center gap-2">
                <Music size={16} className="animate-pulse" /> 
                <span className="hidden sm:inline">🎵 DJ SET TOUS LES SOIRS 🎵</span>
                <span className="sm:hidden">🎵 LIVE DJ 🎵</span>
              </span>
              <span className="hidden md:flex items-center gap-2">
                <Sparkles size={16} className="animate-spin-slow" /> 
                HAPPY HOUR 18h-20h
              </span>
            </motion.div>
            <div className="flex gap-4">
              <a href="tel:+22600000000" className="flex items-center gap-2 hover:text-white/80 transition">
                <Phone size={16} className="animate-pulse" /> 
                <span className="hidden sm:inline">+226 00 00 00 00</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5A623] to-[#FF6B35] rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#F5A623] via-[#FF6B35] to-[#D9385E] flex items-center justify-center shadow-xl border border-white/30">
                  <span className="text-white text-xl">🌅</span>
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-display font-bold">
                  <span className="text-white">Sunset</span>
                </h1>
                <p className="text-xs text-gray-400 font-medium tracking-wider">
                  BAR & RESTAURANT • OUAGA
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 font-medium text-base transition-all ${
                    location.pathname === link.path
                      ? 'text-[#F5A623]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-[#F5A623]"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
              <Link
                to="/events"
                className="bg-gradient-to-r from-[#F5A623] to-[#FF6B35] text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-[#F5A623]/30 transition-all"
              >
                RÉSERVER
              </Link>
            </div>

            {/* Social Icons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="#" className="text-gray-400 hover:text-[#F5A623] transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F5A623] transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F5A623] transition-colors">
                <FaTiktok size={18} />
              </a>
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
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 space-y-2 overflow-hidden"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg font-medium ${
                      location.pathname === link.path
                        ? 'bg-[#F5A623]/20 text-[#F5A623]'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/events"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 bg-gradient-to-r from-[#F5A623] to-[#FF6B35] text-white rounded-lg font-bold text-center"
                >
                  RÉSERVER MA PLACE
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content - Padding top EXACTEMENT égal à la hauteur de la navbar */}
      <main className="flex-1 pt-[104px] md:pt-[104px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0F0F1A] border-t border-white/10">
        <div className="container mx-auto section-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FF6B35] flex items-center justify-center">
                  <span className="text-white text-xl">🌅</span>
                </div>
                <h2 className="text-xl font-display font-bold text-white">Sunset</h2>
              </Link>
              <p className="text-gray-400 text-sm">
                Une sensation émouvante et émerveilleuse à Ouagadougou.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="text-gray-400 hover:text-[#F5A623] transition">
                  <FaFacebook size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F5A623] transition">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F5A623] transition">
                  <FaTiktok size={18} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/events" className="hover:text-[#F5A623] transition">Événements</Link></li>
                <li><Link to="/gallery" className="hover:text-[#F5A623] transition">Galerie</Link></li>
                <li><Link to="/our-story" className="hover:text-[#F5A623] transition">Notre Histoire</Link></li>
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
                <button className="bg-[#F5A623] hover:bg-[#FF6B35] px-5 py-2 rounded-r-full font-medium transition">
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