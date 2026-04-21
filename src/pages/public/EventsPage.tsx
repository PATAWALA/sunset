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
    <div className="min-h-screen night-gradient pt-24">
      <div className="container mx-auto section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            Nos <span className="sunset-gradient bg-clip-text text-transparent">Événements</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Découvrez notre programmation et réservez votre place pour une soirée inoubliable.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-full py-6"
            />
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun événement trouvé</p>
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
                {/* CARTE UNIFORME - MÊME STYLE QUE HOMEPAGE */}
                <div className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600'} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] to-transparent" />
                    {event.is_featured && (
                      <span className="badge-featured">
                        🔥 À la une
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-[#F5A623] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        Sunset Bar, Ouagadougou
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
                    
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex items-center gap-2 text-[#F5A623] hover:text-[#FF6B35] font-medium transition-colors mt-auto"
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