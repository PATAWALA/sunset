
import { Calendar, Clock, MapPin, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchEvents } from '../../utils/supabase-helpers'
import type { Event } from '../../types/database'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card'
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
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin" />
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
                <Card className="glass-effect border-white/10 overflow-hidden group hover:border-sunset-500/50 transition-all h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600'} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {event.is_featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-sunset-500 text-white text-xs font-bold rounded-full">
                        🔥 À la une
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
                  </div>
                  
                  <CardHeader>
                    <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-sunset-400">
                      <Calendar size={16} />
                      <span>
                        {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span>{event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} />
                      <span>Sunset Bar, Ouagadougou</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {event.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter>
                    <Link to={`/events/${event.id}`} className="w-full">
                      <Button className="w-full sunset-gradient hover:opacity-90 text-white">
                        Réserver ma place
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage