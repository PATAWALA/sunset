import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MapPin, Phone, Clock, Sparkles, UtensilsCrossed, Mail, Home } from 'lucide-react'
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa"
import { useState } from 'react'

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Événements', path: '/events' },
    { name: 'Menu', path: '/menu' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Notre Histoire', path: '/our-story' },
  ]

  const phoneNumber = '+229 66 97 40 40'
  const email = 'manager@limprevubenin.com'
  const facebookUrl = 'https://web.facebook.com/limprevuBJ'
  const instagramUrl = 'https://www.instagram.com/limprevubenin'
  const websiteUrl = 'https://limprevubenin.com'

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-sage-100">
        {/* Top bar - Service traiteur & Horaires */}
        <div className="bg-gradient-to-r from-sage-600 via-sage-500 to-terracotta-500 text-white py-2.5 px-4 text-sm overflow-hidden">
          <div className="container mx-auto flex justify-between items-center">
            <motion.div 
              animate={{ opacity: [1, 0.85, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="flex gap-6"
            >
              <span className="flex items-center gap-2">
                <UtensilsCrossed size={16} className="animate-subtle-pulse" /> 
                <span className="font-medium">SERVICE TRAITEUR SUR-MESURE</span>
              </span>
              <span className="hidden md:flex items-center gap-2">
                <Sparkles size={16} className="animate-spin-slow" /> 
                <span>Menu de la semaine disponible</span>
              </span>
            </motion.div>
            <div className="flex gap-4">
              <a 
                href={`tel:${phoneNumber.replace(/\s/g, '')}`} 
                className="flex items-center gap-2 hover:text-gold-200 transition"
              >
                <Phone size={15} className="animate-subtle-pulse" /> 
                <span className="hidden sm:inline font-medium">{phoneNumber}</span>
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
                whileHover={{ rotate: -5, scale: 1.05 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sage-400 to-terracotta-400 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 rounded-full bg-white border-2 border-sage-300 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow overflow-hidden">
                  <UtensilsCrossed size={22} className="text-sage-700" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gradient-gourmet">
                  L'Imprévu
                </h1>
                <p className="text-xs text-terracotta-600 font-medium tracking-widest uppercase">
                  Bistrot & Guesthouse
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2.5 font-body font-medium text-sm transition-all rounded-lg ${
                    location.pathname === link.path 
                      ? 'text-sage-700 bg-sage-50' 
                      : 'text-gray-600 hover:text-sage-700 hover:bg-cream-100/50'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-500 rounded-full"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/reserver-menu" 
                className="bg-sage-600 hover:bg-sage-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Réserver une table
              </Link>
            </div>

            {/* Social Icons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-sage-600 transition-colors p-2 hover:bg-sage-50 rounded-full" 
                title="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href={instagramUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-terracotta-500 transition-colors p-2 hover:bg-terracotta-50 rounded-full" 
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-sage-600 transition-colors p-2 hover:bg-sage-50 rounded-full" 
                title="TikTok"
              >
                <FaTiktok size={18} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-sage-800 hover:text-sage-600 transition p-2"
              title="Menu"
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
                className="md:hidden py-4 space-y-2 overflow-hidden border-t border-sage-100 mt-3"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3.5 px-4 rounded-xl font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-sage-50 text-sage-700 border-l-4 border-sage-500'
                        : 'text-gray-600 hover:bg-cream-50 hover:text-sage-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/reserver-menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3.5 px-4 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-semibold text-center shadow-md transition-all"
                >
                  Réserver une table
                </Link>
                <div className="flex gap-4 pt-3 px-4">
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sage-600 transition p-2">
                    <FaFacebook size={20} />
                  </a>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-terracotta-500 transition p-2">
                    <FaInstagram size={20} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-sage-600 transition p-2">
                    <FaTiktok size={20} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[120px] md:pt-[120px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-sage-900 text-white">
        {/* Section supérieure décorative */}
        <div className="h-1 bg-gradient-to-r from-sage-400 via-terracotta-400 to-gold-400" />
        
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Colonne 1 - Logo & Description */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                  <UtensilsCrossed size={22} className="text-gold-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">L'Imprévu</h2>
                  <p className="text-xs text-gold-300 font-medium tracking-wider">BISTROT & GUESTHOUSE</p>
                </div>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Café, bistrot & guesthouse au cœur de Cotonou. Une expérience culinaire unique, des chambres confortables et un service traiteur d'exception pour vos événements.
              </p>
              <div className="flex gap-3">
                <a 
                  href={facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-gold-400 transition bg-white/5 p-2.5 rounded-full hover:bg-white/10" 
                  title="Facebook"
                >
                  <FaFacebook size={18} />
                </a>
                <a 
                  href={instagramUrl} 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-terracotta-400 transition bg-white/5 p-2.5 rounded-full hover:bg-white/10" 
                  title="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-gold-400 transition bg-white/5 p-2.5 rounded-full hover:bg-white/10" 
                  title="TikTok"
                >
                  <FaTiktok size={18} />
                </a>
              </div>
            </div>

            {/* Colonne 2 - Navigation */}
            <div>
              <h3 className="font-display font-bold text-gold-400 mb-5 text-lg">Navigation</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-white transition flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 - Contact */}
            <div>
              <h3 className="font-display font-bold text-gold-400 mb-5 text-lg">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-terracotta-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Ganhi, face au siège d'Ecobank</p>
                    <p className="text-gray-400 text-xs mt-0.5">Cotonou, Bénin</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-terracotta-400 shrink-0" />
                  <a 
                    href={`tel:${phoneNumber.replace(/\s/g, '')}`} 
                    className="text-gray-300 hover:text-white transition text-sm"
                  >
                    {phoneNumber}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-terracotta-400 shrink-0" />
                  <a 
                    href={`mailto:${email}`} 
                    className="text-gray-300 hover:text-white transition text-sm"
                  >
                    {email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 text-terracotta-400 shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">Lun - Sam</p>
                    <p className="text-gray-400 text-xs">Midi & Soir</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Home size={18} className="text-terracotta-400 shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">2 adresses à Cotonou</p>
                    <p className="text-gray-400 text-xs">Ganhi & Fidjrossè</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Colonne 4 - Réservation rapide */}
            <div>
              <h3 className="font-display font-bold text-gold-400 mb-5 text-lg">Réservation</h3>
              <p className="text-gray-300 text-sm mb-5">
                Réservez votre table ou commandez à emporter. Service traiteur disponible pour vos événements.
              </p>
              <div className="space-y-3">
                <a 
                  href={`https://wa.me/${phoneNumber.replace(/[\s+]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-terracotta-600 hover:bg-terracotta-500 text-white py-3 px-4 rounded-xl font-medium text-center transition-all shadow-lg hover:shadow-terracotta-500/25"
                >
                  Commander sur WhatsApp
                </a>
                <Link 
                  to="/reserver-menu"
                  className="block w-full bg-gold-600 hover:bg-gold-500 text-sage-900 py-3 px-4 rounded-xl font-semibold text-center transition-all shadow-lg hover:shadow-gold-500/25"
                >
                  Réserver une table
                </Link>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-white/10 my-10" />

          {/* Barre inférieure */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} L'Imprévu Bistrot & Guesthouse. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-gold-400 rounded-full animate-subtle-pulse" />
              Fait avec passion au Bénin 🇧🇯
            </p>
            <a 
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition text-sm"
            >
              limprevubenin.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout