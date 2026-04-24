import { motion } from 'framer-motion'
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
  'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1920',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920',
  'https://images.unsplash.com/photo-1545128485-c400e7702796?w=1920',
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
    <div className="bg-night min-h-screen">
      {/* ============================ */}
      {/* HERO SECTION */}
      {/* ============================ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-night">
        {/* Images superposées avec fondu croisé - PAS de AnimatePresence mode="wait" */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <motion.div
              key={img}
              initial={false}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
        
        {/* Overlay LÉGER - on passe de 70% à 40% */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 bg-black/30 backdrop-blur-sm border border-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-6">
              🔥 {featuredEvent ? featuredEvent.title : 'Le Lancé du Jour'}
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight drop-shadow-lg">
              <span className="sunset-gradient bg-clip-text text-transparent">Sunset</span>
              <br />
              <span className="text-white">Là où la nuit prend vie</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Bien plus qu'un bar. Un voyage sensoriel au-dessus de Ouagadougou.
              <br />
              <span className="text-amber-400 font-medium">Venez, vibrez, savourez.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                Je veux ma place <ArrowRight size={20} />
              </Link>
              <Link to="/menu" className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                Découvrir la carte
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Dots de navigation */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-amber-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ============================ */}
      {/* AMBIANCE SECTION */}
      {/* ============================ */}
      <section className="py-16 md:py-20 night-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              L'expérience <span className="sunset-gradient bg-clip-text text-transparent">Sunset</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
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
                className="glass-card rounded-2xl overflow-hidden group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full sunset-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* PLATS DU MOMENT */}
      {/* ============================ */}
      <section className="py-16 md:py-20 bg-night">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                Les <span className="sunset-gradient bg-clip-text text-transparent">délices</span> du moment
              </h2>
              <p className="text-gray-400 text-lg">
                Nos plats signatures qui font la réputation de Sunset
              </p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Voir toute la carte <ArrowRight size={18} />
            </Link>
          </div>

          {featuredPlats.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Les plats arrivent bientôt...</p>
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
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={plat.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'} 
                      alt={plat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
                      {plat.category === 'cocktails' ? '🍸 Cocktail' : '🍽️ Plat'}
                    </span>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-lg shadow-lg">
                        {plat.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {plat.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{plat.description}</p>
                    <Link
                      to={`/reserver-menu?plat=${encodeURIComponent(plat.name)}&prix=${encodeURIComponent(plat.price)}`}
                      className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors"
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
            <Link to="/menu" className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-2">
              Voir toute la carte <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* ÉVÉNEMENTS À VENIR */}
      {/* ============================ */}
      <section className="py-16 md:py-20 night-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                Les nuits <span className="sunset-gradient bg-clip-text text-transparent">inoubliables</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Réservez votre place pour nos prochaines soirées d'exception
              </p>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Tous les événements <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Les prochains événements arrivent...</p>
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
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600'} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
                    {event.is_featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full">
                        🔥 À LA UNE
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-amber-400 mb-3">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">
                        {new Date(event.event_date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Clock size={14} />
                      <span>{event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-5 line-clamp-2">{event.description}</p>
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium transition-all text-sm"
                    >
                      Je réserve ma soirée <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/events" className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-2">
              Tous les événements <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* CTA SECTION FINALE */}
      {/* ============================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 sunset-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545128485-c400e7702796?w=1920')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
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
              Réservez votre table maintenant. Goûtez. Dansez. Vivez Sunset.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="bg-white text-sunset-600 hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-lg transition shadow-2xl hover:scale-105">
                Je réserve une table
              </Link>
              <Link to="/menu" className="border-2 border-white text-white hover:bg-white hover:text-sunset-600 px-10 py-5 rounded-full font-bold text-lg transition backdrop-blur-sm">
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