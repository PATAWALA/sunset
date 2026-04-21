import { motion} from 'framer-motion';
import { Link } from 'react-router-dom'
import { Calendar, Users, Music, Utensils, Star, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchFeaturedEvent, fetchUpcomingEvents } from '../../utils/supabase-helpers'
import type { Event } from '../../types/database'

const HomePage = () => {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true)
      const featured = await fetchFeaturedEvent()
      const upcoming = await fetchUpcomingEvents(3)
      setFeaturedEvent(featured)
      setUpcomingEvents(upcoming)
      setIsLoading(false)
    }
    loadEvents()
  }, [])

  const ambianceFeatures = [
    { icon: Music, title: 'Live Music', desc: 'Des artistes qui font vibrer Ouaga' },
    { icon: Users, title: 'Ambiance Dance', desc: 'Une piste qui ne dort jamais' },
    { icon: Utensils, title: 'Cuisine Signature', desc: 'Des saveurs qui émerveillent' },
    { icon: Star, title: 'Soirées VIP', desc: 'Un service d\'exception' },
  ]

  return (
    <div className="bg-night min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${featuredEvent?.cover_image_url || 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1920'})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-night" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 bg-sunset-500/20 backdrop-blur-sm border border-sunset-500/50 text-sunset-300 text-sm font-bold uppercase tracking-wider rounded-full mb-6">
              🔥 Le Lancé du Jour
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
              <span className="sunset-gradient bg-clip-text text-transparent">Sunset</span>
              <br />
              Bar & Restaurant
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Une sensation émouvante et émerveilleuse à Ouagadougou.
              Venez vivre l'expérience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                Réserver ma place <ArrowRight size={20} />
              </Link>
              <Link to="/gallery" className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                Découvrir l'ambiance
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ambiance Section */}
      <section className="section-padding night-gradient">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              L'ambiance <span className="sunset-gradient bg-clip-text text-transparent">Sunset</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Plus qu'un restaurant, une expérience unique où chaque soirée devient un souvenir inoubliable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {ambianceFeatures.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 text-center group hover:border-sunset-500/50 transition-all"
              >
                <div className="w-16 h-16 rounded-full sunset-gradient flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements à venir */}
      <section className="section-padding bg-night">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-2">Événements à venir</h2>
              <p className="text-gray-400">Réservez votre place pour nos prochaines soirées</p>
            </div>
            <Link to="/events" className="text-sunset-500 hover:text-sunset-400 flex items-center gap-2">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600'} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night to-transparent" />
                    {event.is_featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-sunset-500 text-white text-xs font-bold rounded-full">
                        🔥 À la une
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-sunset-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(event.event_date).toLocaleDateString('fr-FR')}
                      </span>
                      <span>{event.start_time.slice(0, 5)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-sunset-500 hover:text-sunset-400 font-medium flex items-center gap-1"
                    >
                      Réserver <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 sunset-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545128485-c400e7702796?w=1920')] bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Prêt à vivre l'expérience ?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Réservez votre table maintenant et laissez-vous emporter par la magie Sunset.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="bg-white text-sunset-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition">
                Réserver une table
              </Link>
              <a href="tel:+22600000000" className="border-2 border-white text-white hover:bg-white hover:text-sunset-600 px-8 py-4 rounded-full font-bold text-lg transition">
                Appeler maintenant
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage