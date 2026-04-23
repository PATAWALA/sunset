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
  PartyPopper,
  Send,
  CheckCircle,
  MessageCircle,
  Database
} from 'lucide-react'
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

// Numéro WhatsApp du gérant (format international SANS le '+')
const WHATSAPP_PHONE = '22600000000' // Remplacez par le vrai numéro

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

  // Fonction générique pour sauvegarder la réservation
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

  // Ouvre WhatsApp avec le message pré-rempli
  const openWhatsApp = () => {
    const messageLines = [
      `🌅 *NOUVELLE RÉSERVATION – SUNSET*`,
      ``,
      `👤 *Client :* ${form.name}`,
      `📞 *Téléphone :* ${form.phone}`,
      `👥 *Personnes :* ${form.guests}`,
      `📅 *Événement :* ${event?.title}`,
      `🕐 *Date :* ${event ? format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr }) : ''} à ${event?.start_time?.slice(0, 5)}`,
      `🪑 *Table :* ${form.preference || 'Non précisé'}`,
      `📝 *Demande spéciale :* ${form.request || 'Aucune'}`,
      ``,
      `✅ *Merci de confirmer la réservation.*`
    ]

    const whatsappMessage = encodeURIComponent(messageLines.join('\n'))
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`
    window.open(whatsappUrl, '_blank')
  }

  // Action pour "Réserver via WhatsApp"
  const handleWhatsAppReservation = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Veuillez remplir votre nom et votre numéro WhatsApp')
      return
    }

    setIsSubmitting(true)

    // Sauvegarde dans Supabase
    const result = await saveReservation()
    if (!result.success) {
      toast.error('Erreur lors de l’enregistrement. Veuillez réessayer.')
      setIsSubmitting(false)
      return
    }

    // Ouvrir WhatsApp
    openWhatsApp()

    toast.success('🎉 Demande envoyée !', {
      description: 'Continuez sur WhatsApp pour confirmer.',
      icon: <MessageCircle className="text-green-400" />
    })

    // Réinitialiser le formulaire
    setForm({
      name: '',
      phone: '',
      email: '',
      guests: 2,
      preference: '',
      request: ''
    })

    setIsSubmitting(false)
  }

  // Action pour "Réserver en ligne" (sans WhatsApp)
  const handleOnlineReservation = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Veuillez remplir votre nom et votre numéro de téléphone')
      return
    }

    setIsSubmitting(true)

    const result = await saveReservation()
    if (!result.success) {
      toast.error('Erreur lors de l’enregistrement. Veuillez réessayer.')
      setIsSubmitting(false)
      return
    }

    toast.success('✨ Réservation confirmée !', {
      description: 'Vous recevrez une confirmation par téléphone.',
      icon: <CheckCircle className="text-green-400" />
    })

    // Réinitialiser le formulaire
    setForm({
      name: '',
      phone: '',
      email: '',
      guests: 2,
      preference: '',
      request: ''
    })

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
        {/* Fil d'Ariane */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Retour aux événements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : Infos + ambiance */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Image de couverture */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img
                  src={
                    event.cover_image_url ||
                    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200'
                  }
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {event.is_featured && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-sunset-500 text-white font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles size={16} /> À la une
                  </span>
                )}
              </div>

              {/* Titre & accroche */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                {event.title}
              </h1>
              <p className="text-gray-300 text-lg mb-6 flex items-center gap-2">
                <PartyPopper size={20} className="text-sunset-400" />
                Une soirée qui promet d'être légendaire !
              </p>

              {/* Bloc infos pratiques */}
              <div className="flex flex-wrap gap-6 mb-8 p-5 glass-effect rounded-xl">
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

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music size={24} className="text-sunset-400" />
                  À propos de l'événement
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {event.description}
                </p>
              </div>

              {/* Ambiance / citation */}
              <div className="mt-8 p-5 glass-effect rounded-xl border-l-4 border-sunset-500">
                <p className="text-white italic text-lg">
                  "Une sensation émouvante et émerveilleuse. Venez comme vous êtes, repartez avec des étoiles plein les yeux."
                </p>
                <p className="text-sunset-400 mt-2">— L'équipe Sunset</p>
              </div>
            </motion.div>
          </div>

          {/* Colonne droite : Formulaire de réservation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  Prêt à danser ? 💃🕺
                </h2>
                <p className="text-gray-400">
                  Choisissez votre mode de réservation
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Nom */}
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">
                    Ton prénom et nom *
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-xl py-6"
                    placeholder="ex: Awa Ouédraogo"
                    required
                  />
                </div>

                {/* Téléphone WhatsApp */}
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">
                    Numéro de téléphone *
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-xl py-6"
                    placeholder="+226 XX XX XX XX"
                    required
                  />
                </div>

                {/* Email (optionnel) */}
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">
                    Email (optionnel)
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-xl py-6"
                    placeholder="ton@email.com"
                  />
                </div>

                {/* Nombre de personnes */}
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">
                    Nombre de personnes *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max={event.max_capacity || 20}
                    value={form.guests}
                    onChange={(e) =>
                      setForm({ ...form, guests: parseInt(e.target.value) || 1 })
                    }
                    className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-xl py-6"
                    required
                  />
                </div>

                {/* Préférence de table */}
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">
                    Où veux-tu t'installer ?
                  </Label>
                  <select
                    value={form.preference}
                    onChange={(e) => setForm({ ...form, preference: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  >
                    <option value="" className="bg-[#0F0F1A]">
                      🎲 Peu importe, je veux danser !
                    </option>
                    <option value="piste" className="bg-[#0F0F1A]">
                      💃 Près de la piste de danse
                    </option>
                    <option value="terrasse" className="bg-[#0F0F1A]">
                      🌇 Terrasse (vue sunset)
                    </option>
                    <option value="vip" className="bg-[#0F0F1A]">
                      ✨ Espace VIP
                    </option>
                    <option value="bar" className="bg-[#0F0F1A]">
                      🍸 Près du bar
                    </option>
                  </select>
                </div>

                {/* Demande spéciale */}
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">
                    Une occasion spéciale ?
                  </Label>
                  <Textarea
                    value={form.request}
                    onChange={(e) => setForm({ ...form, request: e.target.value })}
                    className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-xl"
                    placeholder="Anniversaire, allergie, message pour le DJ..."
                    rows={3}
                  />
                </div>

                {/* Double bouton de réservation */}
                <div className="pt-4 space-y-3">
                  <Button
                    type="button"
                    onClick={handleWhatsAppReservation}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Réserver via WhatsApp
                  </Button>

                  <Button
                    type="button"
                    onClick={handleOnlineReservation}
                    disabled={isSubmitting}
                    className="w-full sunset-gradient text-white py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-sunset-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Database size={20} />
                    Réserver en ligne
                  </Button>
                </div>

                <p className="text-center text-gray-500 text-xs">
                  En réservant, vous acceptez d'être contacté(e) pour confirmer.
                </p>
              </form>

              {/* Contact direct */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-3">
                  Besoin d'aide ? Appelez-nous
                </p>
                <a
                  href="tel:+22600000000"
                  className="inline-flex items-center justify-center gap-2 text-sunset-500 hover:text-sunset-400 text-xl font-medium transition"
                >
                  <Phone size={20} /> +226 00 00 00 00
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