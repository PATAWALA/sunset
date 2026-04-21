import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Phone, ArrowLeft, Users, Music } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchEventById, createReservation } from '../../utils/supabase-helpers'
import type { Event } from '../../types/database'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const EventDetailsPage = () => {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    preference: '',
    request: ''
  })

  useEffect(() => {
    const loadEvent = async () => {
      if (id) {
        setIsLoading(true)
        const data = await fetchEventById(id)
        setEvent(data)
        setIsLoading(false)
      }
    }
    loadEvent()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await createReservation(id!, {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || undefined,
      number_of_guests: form.guests,
      table_preference: form.preference || undefined,
      special_request: form.request || undefined
    })
    
    if (result.success) {
      toast.success('✨ Réservation confirmée ! Le Sunset vous attend 😍', {
        description: 'Vous recevrez une confirmation par WhatsApp.'
      })
      setForm({ name: '', phone: '', email: '', guests: 2, preference: '', request: '' })
    } else {
      toast.error('Erreur lors de la réservation. Veuillez réessayer.')
    }
    
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen night-gradient pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen night-gradient pt-24 flex items-center justify-center">
        <div className="text-center">
          <Calendar size={64} className="text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl text-white mb-4">Événement non trouvé</h2>
          <Link to="/events" className="text-sunset-500 hover:text-sunset-400">
            Retour aux événements
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen night-gradient pt-24">
      <div className="container mx-auto section-padding">
        {/* Breadcrumb */}
        <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={16} /> Retour aux événements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Infos événement */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                <img 
                  src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200'} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.is_featured && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-sunset-500 text-white font-bold rounded-full">
                    🔥 Événement à la une
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-6 mb-6 p-4 glass-effect rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sunset-500/20 flex items-center justify-center">
                    <Calendar size={20} className="text-sunset-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-medium">
                      {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sunset-500/20 flex items-center justify-center">
                    <Clock size={20} className="text-sunset-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Horaire</p>
                    <p className="text-white font-medium">
                      {event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sunset-500/20 flex items-center justify-center">
                    <MapPin size={20} className="text-sunset-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Lieu</p>
                    <p className="text-white font-medium">Sunset Bar, Ouagadougou</p>
                  </div>
                </div>
                {event.max_capacity && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sunset-500/20 flex items-center justify-center">
                      <Users size={20} className="text-sunset-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Capacité</p>
                      <p className="text-white font-medium">{event.max_capacity} personnes</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music size={24} className="text-sunset-400" />
                  À propos de l'événement
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Formulaire réservation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Réserver une table</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-gray-300">Nom complet *</Label>
                  <Input 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Téléphone (WhatsApp) *</Label>
                  <Input 
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="+226 XX XX XX XX"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Email (optionnel)</Label>
                  <Input 
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Nombre de personnes *</Label>
                  <Input 
                    type="number"
                    min="1"
                    max={event.max_capacity || 20}
                    value={form.guests}
                    onChange={(e) => setForm({...form, guests: parseInt(e.target.value) || 1})}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Préférence de table</Label>
                  <select 
                    value={form.preference}
                    onChange={(e) => setForm({...form, preference: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  >
                    <option value="" className="bg-night">Sans préférence</option>
                    <option value="piste" className="bg-night">Près de la piste de danse</option>
                    <option value="terrasse" className="bg-night">Terrasse</option>
                    <option value="vip" className="bg-night">Espace VIP</option>
                    <option value="bar" className="bg-night">Près du bar</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-gray-300">Demande spéciale</Label>
                  <Textarea 
                    value={form.request}
                    onChange={(e) => setForm({...form, request: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Allergies, anniversaire, etc."
                    rows={3}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sunset-gradient text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Réservation en cours...
                    </>
                  ) : (
                    'Confirmer la réservation'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-3">Ou réservez par téléphone</p>
                <a 
                  href="tel:+22600000000" 
                  className="inline-flex items-center justify-center gap-2 text-sunset-500 hover:text-sunset-400 text-lg font-medium"
                >
                  <Phone size={18} /> +226 00 00 00 00
                </a>
                <p className="text-gray-500 text-xs mt-4">
                  En réservant, vous acceptez nos conditions générales.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage