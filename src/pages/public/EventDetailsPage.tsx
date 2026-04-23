import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Users,
  Music,
  Sparkles,
  MessageCircle,
  CheckCircle,
  Send
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchEventById, createReservation } from '../../utils/supabase-helpers'
import type { Event } from '../../types/database'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const WHATSAPP_PHONE = '22606114646'

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

  const saveReservation = async () => {
    return await createReservation(id!, {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || undefined,
      number_of_guests: form.guests,
      table_preference: form.preference || undefined,
      special_request: form.request || undefined
    })
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `SUNSET - NOUVELLE RESERVATION\n\n` +
      `Client : ${form.name}\n` +
      `Telephone : ${form.phone}\n` +
      `Personnes : ${form.guests}\n` +
      `Evenement : ${event?.title}\n` +
      `Date : ${event ? format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr }) : ''} a ${event?.start_time?.slice(0, 5)}\n` +
      `Table : ${form.preference || 'Non precise'}\n` +
      `Demande speciale : ${form.request || 'Aucune'}\n\n` +
      `Merci de confirmer la reservation.`
    )

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank')
  }

  const handleWhatsAppReservation = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Veuillez remplir votre nom et votre numero de telephone.')
      return
    }

    setIsSubmitting(true)
    const result = await saveReservation()
    
    if (!result.success) {
      toast.error('Erreur lors de l\'enregistrement. Veuillez reessayer.')
      setIsSubmitting(false)
      return
    }

    openWhatsApp()

    toast.success('Demande envoyee !', {
      description: 'Continuez sur WhatsApp pour confirmer.',
      icon: <MessageCircle className="text-green-400" />
    })

    setForm({ name: '', phone: '', email: '', guests: 2, preference: '', request: '' })
    setIsSubmitting(false)
  }

  const handleOnlineReservation = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Veuillez remplir votre nom et votre numero de telephone.')
      return
    }

    setIsSubmitting(true)
    const result = await saveReservation()
    
    if (!result.success) {
      toast.error('Erreur lors de l\'enregistrement. Veuillez reessayer.')
      setIsSubmitting(false)
      return
    }

    toast.success('Reservation confirmee !', {
      description: 'Vous recevrez une confirmation par telephone.',
      icon: <CheckCircle className="text-green-400" />
    })

    setForm({ name: '', phone: '', email: '', guests: 2, preference: '', request: '' })
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] pt-24 flex items-center justify-center">
        <div className="text-center">
          <Calendar size={64} className="text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl text-white mb-4">Evenement non trouve</h2>
          <Link to="/events" className="text-amber-400 hover:text-amber-300">
            Retour aux evenements
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] pt-24">
      <div className="container mx-auto section-padding">
        {/* Fil d'Ariane */}
        <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour aux evenements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne gauche : Infos */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Image de couverture */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <img
                  src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {event.is_featured && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-amber-500 text-white font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles size={16} /> A la une
                  </span>
                )}
              </div>

              {/* Titre */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                {event.title}
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                Rejoignez-nous pour une soiree exceptionnelle au Sunset.
              </p>

              {/* Bloc infos pratiques */}
              <div className="flex flex-wrap gap-6 mb-8 p-5 glass-effect rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Calendar size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-medium">
                      {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Clock size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Horaire</p>
                    <p className="text-white font-medium">
                      {event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <MapPin size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Lieu</p>
                    <p className="text-white font-medium">Sunset Bar, Ouagadougou</p>
                  </div>
                </div>
                {event.max_capacity && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Users size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Capacite</p>
                      <p className="text-white font-medium">{event.max_capacity} personnes</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music size={24} className="text-amber-400" />
                  A propos de l'evenement
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {event.description}
                </p>
              </div>

              {/* Citation */}
              <div className="p-6 glass-effect rounded-xl border-l-4 border-amber-500">
                <p className="text-white italic text-lg leading-relaxed">
                  "Une sensation emouvante et emerveilleuse. Venez comme vous etes, repartez avec des souvenirs inoubliables."
                </p>
                <p className="text-amber-400 mt-3 font-medium">L'equipe Sunset</p>
              </div>
            </motion.div>
          </div>

          {/* Colonne droite : Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Reserver une table
                </h2>
                <p className="text-gray-400 text-sm">
                  Remplissez le formulaire pour reservez votre place
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Telephone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition"
                    placeholder="+226 XX XX XX XX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Email (optionnel)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Nombre de personnes *</label>
                  <input
                    type="number"
                    min="1"
                    max={event.max_capacity || 20}
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Preference de table</label>
                  <select
                    value={form.preference}
                    onChange={(e) => setForm({ ...form, preference: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="" className="bg-[#0F0F1A]">Sans preference</option>
                    <option value="piste" className="bg-[#0F0F1A]">Pres de la piste de danse</option>
                    <option value="terrasse" className="bg-[#0F0F1A]">Terrasse (vue panoramique)</option>
                    <option value="vip" className="bg-[#0F0F1A]">Espace VIP</option>
                    <option value="bar" className="bg-[#0F0F1A]">Pres du bar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Demande speciale</label>
                  <textarea
                    value={form.request}
                    onChange={(e) => setForm({ ...form, request: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition resize-none"
                    placeholder="Occasion speciale, allergies, preferences..."
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppReservation}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-base transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MessageCircle size={20} />
                    Reserver via WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleOnlineReservation}
                    disabled={isSubmitting}
                    className="w-full sunset-gradient text-white py-4 rounded-xl font-bold text-base transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={20} />
                    Reserver en ligne
                  </button>
                </div>

                <p className="text-center text-gray-500 text-xs">
                  En reservant, vous acceptez d'etre contacte(e) pour confirmer.
                </p>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-3">Ou par telephone</p>
                <a
                  href="tel:+22606114646"
                  className="inline-flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 text-lg font-medium transition"
                >
                  <Phone size={18} /> +226 06 11 46 46
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage