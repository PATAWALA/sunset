import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  Music, 
  Utensils, 
  Star, 
  ArrowRight, 
  ChefHat,
  Clock,
  ShoppingCart
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchFeaturedEvent, fetchUpcomingEvents } from '../../utils/supabase-helpers'
import { supabase } from '../../lib/supabase'
import type { Event } from '../../types/database'

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  image: string | null
  category: string
  is_available: boolean
  tags: string[] | null
}

const heroImages = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920',
]

const HomePage = () => {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [featuredPlats, setFeaturedPlats] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true)
      await Promise.all([
        loadEvents(),
        loadFeaturedPlats()
      ])
      setIsLoading(false)
    }
    loadAll()
  }, [])

  const loadEvents = async () => {
    const featured = await fetchFeaturedEvent()
    const upcoming = await fetchUpcomingEvents(3)
    setFeaturedEvent(featured)
    setUpcomingEvents(upcoming)
  }

  const loadFeaturedPlats = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .in('category', ['plats', 'cocktails'])
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) throw error
      setFeaturedPlats(data || [])
    } catch (error) {
      console.error('Erreur chargement plats:', error)
    }
  }

  const ambianceFeatures = [
    { 
      icon: Music, 
      title: 'Live Music', 
      desc: 'Des artistes qui enflamment la scène chaque soir',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'
    },
    { 
      icon: Users, 
      title: 'Piste de Danse', 
      desc: 'Lâchez-vous sur les meilleurs sons d\'Afrique et du monde',
      image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=600'
    },
    { 
      icon: Utensils, 
      title: 'Cuisine d\'Exception', 
      desc: 'Des saveurs locales sublimées par notre chef',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
    },
    { 
      icon: Star, 
      title: 'Vue Panoramique', 
      desc: 'Surplombez Ouagadougou, admirez le coucher de soleil',
      image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600'
    },
  ]

  return (
    <div className="bg-cream-50">
      {/* ============================ */}
      {/* HERO SECTION - Pleine hauteur, collé au header */}
      {/* ============================ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
          />
        </AnimatePresence>
        
        {/* Overlay simple et propre - juste assez sombre pour le texte blanc */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white pt-[120px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 bg-black/40 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold uppercase tracking-wider rounded-full mb-6">
              ✨ {featuredEvent ? featuredEvent.title : 'Bistrot & Guesthouse'}
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight drop-shadow-lg">
              L'Imprévu
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl text-gold-300">L'art de recevoir</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Café, bistrot & guesthouse au cœur de Cotonou.
              <br />
              <span className="text-gold-300 font-medium">Une cuisine authentique, un accueil chaleureux.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="bg-sage-600 hover:bg-sage-700 text-white text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 font-semibold shadow-lg transition-all">
                Je réserve ma table <ArrowRight size={20} />
              </Link>
              <Link to="/menu" className="bg-white/20 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white/30 hover:border-white text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 font-semibold transition-all">
                Notre menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================ */}
      {/* AMBIANCE SECTION */}
      {/* ============================ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-sage-800 mb-6">
              L'expérience <span className="text-terracotta-500">L'Imprévu</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Un lieu où chaque détail est pensé pour éveiller vos sens. 
              La musique, les saveurs, la vue : tout converge pour créer des moments inoubliables.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ambianceFeatures.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="bg-white border border-cream-200 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon size={24} className="text-sage-700" />
                  </div>
                  <h3 className="text-xl font-bold text-sage-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* PLATS DU MOMENT */}
      {/* ============================ */}
      <section className="py-16 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-sage-800 mb-3">
                Les <span className="text-terracotta-500">délices</span> du moment
              </h2>
              <p className="text-gray-600 text-lg">
                Nos plats signatures qui font la réputation de L'Imprévu
              </p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium transition-colors">
              Voir toute la carte <ArrowRight size={18} />
            </Link>
          </div>

          {featuredPlats.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat size={48} className="text-sage-300 mx-auto mb-4" />
              <p className="text-gray-500">Les plats arrivent bientôt...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlats.map((plat, index) => (
                <motion.div
                  key={plat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-cream-200 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={plat.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'} 
                      alt={plat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-sage-700 text-xs font-medium rounded-full border border-sage-200 shadow-sm">
                      {plat.category === 'cocktails' ? '🍸 Cocktail' : '🍽️ Plat'}
                    </span>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-4 py-2 bg-terracotta-500 text-white font-bold rounded-xl text-lg shadow-lg">
                        {plat.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-sage-800 mb-2 group-hover:text-terracotta-600 transition-colors">
                      {plat.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{plat.description}</p>
                    <Link
                      to={`/reserver-menu?plat=${encodeURIComponent(plat.name)}&prix=${encodeURIComponent(plat.price)}`}
                      className="inline-flex items-center gap-2 text-terracotta-600 hover:text-terracotta-700 font-medium text-sm transition-colors"
                    >
                      <ShoppingCart size={14} />
                      Commander ce plat
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/menu" className="text-sage-600 hover:text-sage-700 font-medium inline-flex items-center gap-2">
              Voir toute la carte <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* ÉVÉNEMENTS À VENIR */}
      {/* ============================ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-sage-800 mb-3">
                Les nuits <span className="text-terracotta-500">inoubliables</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Réservez votre place pour nos prochaines soirées d'exception
              </p>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium transition-colors">
              Tous les événements <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-sage-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="text-sage-300 mx-auto mb-4" />
              <p className="text-gray-500">Les prochains événements arrivent...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className="bg-white border border-cream-200 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600'} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {event.is_featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-white text-xs font-bold rounded-full shadow-sm">
                        ✨ À LA UNE
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sage-600 mb-3">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">
                        {new Date(event.event_date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-sage-800 mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <Clock size={14} />
                      <span>{event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-5 line-clamp-2">{event.description}</p>
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-2.5 rounded-full font-medium transition-all text-sm shadow-md"
                    >
                      Je réserve ma soirée <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/events" className="text-sage-600 hover:text-sage-700 font-medium inline-flex items-center gap-2">
              Tous les événements <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* CTA SECTION FINALE */}
      {/* ============================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sage-600 via-sage-500 to-terracotta-500 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555244162-803834f70033?w=1920')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
              L'extraordinaire vous attend
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Réservez votre table maintenant. Savourez. Partagez. Vivez L'Imprévu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="bg-white text-sage-700 hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-lg transition shadow-2xl hover:scale-105">
                Je réserve une table
              </Link>
              <Link to="/menu" className="border-2 border-white text-white hover:bg-white hover:text-sage-700 px-10 py-5 rounded-full font-bold text-lg transition backdrop-blur-sm">
                Je découvre le menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage