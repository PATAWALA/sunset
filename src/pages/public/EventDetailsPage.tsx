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

const WHATSAPP_PHONE = '22966974040'

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
      `L'IMPRÉVU - RÉSERVATION ÉVÉNEMENT\n\n` +
      `👤 Client : ${form.name}\n` +
      `📞 Téléphone : ${form.phone}\n` +
      `👥 Personnes : ${form.guests}\n` +
      `✨ Événement : ${event?.title}\n` +
      `📅 Date : ${event ? format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr }) : ''} à ${event?.start_time?.slice(0, 5)}\n` +
      `🪑 Table : ${form.preference || 'Non précisé'}\n` +
      `📝 Demande spéciale : ${form.request || 'Aucune'}\n\n` +
      `📍 L'Imprévu, Ganhi - Cotonou\n` +
      `✅ Merci de confirmer la réservation.`
    )

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank')
  }

  const handleWhatsAppReservation = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Veuillez remplir votre nom et votre numéro de téléphone.')
      return
    }

    setIsSubmitting(true)
    const result = await saveReservation()
    
    if (!result.success) {
      toast.error("Erreur lors de l'enregistrement. Veuillez réessayer.")
      setIsSubmitting(false)
      return
    }

    openWhatsApp()

    toast.success('Demande envoyée !', {
      description: 'Continuez sur WhatsApp pour confirmer.',
      icon: <MessageCircle className="text-green-400" />
    })

    setForm({ name: '', phone: '', email: '', guests: 2, preference: '', request: '' })
    setIsSubmitting(false)
  }

  const handleOnlineReservation = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Veuillez remplir votre nom et votre numéro de téléphone.')
      return
    }

    setIsSubmitting(true)
    const result = await saveReservation()
    
    if (!result.success) {
      toast.error("Erreur lors de l'enregistrement. Veuillez réessayer.")
      setIsSubmitting(false)
      return
    }

    toast.success('Réservation confirmée !', {
      description: 'Vous recevrez une confirmation par téléphone.',
      icon: <CheckCircle className="text-green-400" />
    })

    setForm({ name: '', phone: '', email: '', guests: 2, preference: '', request: '' })
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <Calendar size={64} className="text-sage-300 mx-auto mb-4" />
          <h2 className="text-2xl text-sage-800 mb-4">Événement non trouvé</h2>
          <Link to="/events" className="text-sage-600 hover:text-sage-700 font-medium">
            Retour aux événements
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto section-padding pt-24 pb-16">
        {/* Fil d'Ariane */}
        <Link to="/events" className="inline-flex items-center gap-2 text-gray-500 hover:text-sage-700 mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour aux événements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne gauche : Infos */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Image de couverture - nette */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
                <img
                  src={event.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                {event.is_featured && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-gold-500 text-white font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles size={16} /> À la une
                  </span>
                )}
              </div>

              {/* Titre */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-sage-800 mb-4 leading-tight">
                {event.title}
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Rejoignez-nous pour un moment exceptionnel à L'Imprévu.
              </p>

              {/* Bloc infos pratiques */}
              <div className="flex flex-wrap gap-6 mb-8 p-5 bg-white border border-cream-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Calendar size={20} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p className="text-sage-800 font-medium">
                      {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Clock size={20} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Horaire</p>
                    <p className="text-sage-800 font-medium">
                      {event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <MapPin size={20} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Lieu</p>
                    <p className="text-sage-800 font-medium">L'Imprévu, Ganhi - Cotonou</p>
                  </div>
                </div>
                {event.max_capacity && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                      <Users size={20} className="text-sage-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Capacité</p>
                      <p className="text-sage-800 font-medium">{event.max_capacity} personnes</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-sage-800 mb-4 flex items-center gap-2">
                  <Music size={24} className="text-terracotta-500" />
                  À propos de l'événement
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {event.description}
                </p>
              </div>

              {/* Citation */}
              <div className="p-6 bg-white border border-cream-200 rounded-xl border-l-4 border-terracotta-500 shadow-sm">
                <p className="text-sage-800 italic text-lg leading-relaxed">
                  "Du choix des mets à la qualité du service, chaque détail est pensé pour sublimer vos événements."
                </p>
                <p className="text-terracotta-500 mt-3 font-medium">L'équipe L'Imprévu</p>
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
            <div className="bg-white border border-cream-200 rounded-2xl p-6 md:p-8 shadow-md">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-sage-800 mb-2">
                  Réserver une table
                </h2>
                <p className="text-gray-500 text-sm">
                  Remplissez le formulaire pour réserver votre place
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Téléphone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition"
                    placeholder="+229 XX XX XX XX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Email (optionnel)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Nombre de personnes *</label>
                  <input
                    type="number"
                    min="1"
                    max={event.max_capacity || 20}
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 focus:outline-none focus:border-sage-400 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Préférence de table</label>
                  <select
                    value={form.preference}
                    onChange={(e) => setForm({ ...form, preference: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-300"
                  >
                    <option value="">Sans préférence</option>
                    <option value="interieur">Salle intérieure</option>
                    <option value="terrasse">Terrasse</option>
                    <option value="jardin">Jardin</option>
                    <option value="prive">Espace privé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Demande spéciale</label>
                  <textarea
                    value={form.request}
                    onChange={(e) => setForm({ ...form, request: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition resize-none"
                    placeholder="Occasion spéciale, allergies, préférences..."
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
                    Réserver via WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleOnlineReservation}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-sage-600 to-sage-500 hover:from-sage-700 hover:to-sage-600 text-white py-4 rounded-xl font-bold text-base transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={20} />
                    Réserver en ligne
                  </button>
                </div>

                <p className="text-center text-gray-400 text-xs">
                  En réservant, vous acceptez d'être contacté(e) pour confirmer.
                </p>
              </form>

              <div className="mt-8 pt-6 border-t border-cream-200 text-center">
                <p className="text-gray-500 text-sm mb-3">Ou par téléphone</p>
                <a
                  href="tel:+22966974040"
                  className="inline-flex items-center justify-center gap-2 text-sage-600 hover:text-sage-700 text-lg font-medium transition"
                >
                  <Phone size={18} /> +229 66 97 40 40
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