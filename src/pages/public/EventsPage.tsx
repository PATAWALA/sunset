import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Search, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchEvents } from '../../utils/supabase-helpers'
import type { Event } from '../../types/database'
import { Input } from '../../components/ui/input'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true)
      const data = await fetchEvents()
      setEvents(data)
      setFilteredEvents(data)
      setIsLoading(false)
    }
    loadEvents()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEvents(filtered)
    }
  }, [searchTerm, events])

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto section-padding pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-sage-800 mb-4">
            Nos <span className="text-terracotta-500">Événements</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez notre programmation et confiez-nous vos moments précieux. Service traiteur sur-mesure pour toutes vos réceptions.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={20} />
            <Input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white border border-sage-200 text-sage-800 placeholder:text-sage-400 rounded-full py-6 shadow-sm focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            />
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sage-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="text-sage-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun événement trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600'} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {event.is_featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-white text-xs font-bold rounded-full shadow-sm">
                        ✨ À la une
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-sage-600 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        L'Imprévu, Ganhi - Cotonou
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-sage-800 mb-3">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
                    
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium transition-colors mt-auto"
                    >
                      Réserver ma place <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage