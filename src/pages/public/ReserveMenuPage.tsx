import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  MapPin,
  ArrowLeft,
  Users,
  UtensilsCrossed,
  Send,
  CheckCircle,
  MessageCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const WHATSAPP_PHONE = '22966974040'

const ReserveMenuPage = () => {
  const [searchParams] = useSearchParams()
  const platFromUrl = searchParams.get('plat') || ''
  const prixFromUrl = searchParams.get('prix') || ''

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    date: '',
    time: '20:00',
    plat: platFromUrl,
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitWhatsApp = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.date) {
      toast.error('Veuillez remplir tous les champs obligatoires.')
      return
    }

    setIsSubmitting(true)

    const message = encodeURIComponent(
      `🍽️ *RÉSERVATION - L'IMPRÉVU*\n\n` +
      `👤 *Client :* ${form.name}\n` +
      `📞 *Tél :* ${form.phone}\n` +
      `📧 *Email :* ${form.email || 'Non précisé'}\n` +
      `👥 *Personnes :* ${form.guests}\n` +
      `📅 *Date :* ${format(new Date(form.date), 'EEEE d MMMM yyyy', { locale: fr })}\n` +
      `🕐 *Heure :* ${form.time}\n` +
      `🍽️ *Menu/Plat :* ${form.plat || 'Non précisé'}\n` +
      `💰 *Prix indicatif :* ${prixFromUrl || 'À confirmer'}\n` +
      `📝 *Notes :* ${form.notes || 'Aucune'}\n\n` +
      `📍 *L'Imprévu, Ganhi - Cotonou*\n` +
      `✅ *Merci de confirmer la réservation.*`
    )

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank')

    toast.success('🍽️ Réservation envoyée !', {
      description: 'Continuez sur WhatsApp pour confirmer.',
      icon: <MessageCircle className="text-green-400" />
    })

    setForm({
      name: '',
      phone: '',
      email: '',
      guests: 2,
      date: '',
      time: '20:00',
      plat: '',
      notes: ''
    })
    setIsSubmitting(false)
  }

  const handleSubmitOnline = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.date) {
      toast.error('Veuillez remplir tous les champs obligatoires.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      toast.success('✅ Réservation enregistrée !', {
        description: "L'Imprévu vous contactera pour confirmer.",
        icon: <CheckCircle className="text-green-400" />
      })

      setForm({
        name: '',
        phone: '',
        email: '',
        guests: 2,
        date: '',
        time: '20:00',
        plat: '',
        notes: ''
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto section-padding pt-24 pb-16">
        {/* Fil d'Ariane */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-sage-700 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Retour à la carte
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne gauche : Infos */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-sage-800 mb-4">
                  Réserver <span className="text-terracotta-500">une table</span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Choisissez votre menu, votre date, et on s'occupe du reste.
                </p>
              </div>

              {/* Infos pratiques */}
              <div className="bg-white border border-cream-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Clock size={20} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Horaires</p>
                    <p className="text-sage-800 font-medium">Lun-Sam : Midi & Soir</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <MapPin size={20} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Lieu</p>
                    <p className="text-sage-800 font-medium">Ganhi, face à Ecobank</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Users size={20} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Adresses</p>
                    <p className="text-sage-800 font-medium">Ganhi & Fidjrossè</p>
                  </div>
                </div>
              </div>

              {/* Citation */}
              <div className="bg-white border border-cream-200 rounded-2xl p-6 border-l-4 border-terracotta-500 shadow-sm">
                <p className="text-sage-800 italic">
                  "Du choix des mets à la qualité du service, chaque détail est pensé pour sublimer vos événements."
                </p>
                <p className="text-terracotta-500 mt-2 text-sm font-medium">— L'équipe L'Imprévu</p>
              </div>
            </motion.div>
          </div>

          {/* Colonne droite : Formulaire */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-cream-200 rounded-2xl p-8 md:p-10 shadow-md"
            >
              <div className="text-center mb-8">
                <UtensilsCrossed size={32} className="text-sage-600 mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-display font-bold text-sage-800 mb-2">
                  Réservez votre table & votre menu
                </h2>
                <p className="text-gray-500">
                  Remplissez le formulaire ci-dessous. Vous recevrez une confirmation.
                </p>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                {/* Nom */}
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

                {/* Téléphone */}
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

                {/* Email */}
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

                {/* Date & Heure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 focus:outline-none focus:border-sage-400 transition"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Heure</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 focus:outline-none focus:border-sage-400 transition"
                    />
                  </div>
                </div>

                {/* Nombre de personnes & Plat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Nombre de personnes *</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 focus:outline-none focus:border-sage-400 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Menu ou Plat souhaité</label>
                    <input
                      type="text"
                      value={form.plat}
                      onChange={(e) => setForm({ ...form, plat: e.target.value })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition"
                      placeholder="Ex: Penne sauce pesto"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Notes particulières</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl text-sage-800 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition resize-none"
                    placeholder="Allergies, occasion spéciale, préférence de table..."
                  />
                </div>

                {/* Boutons d'action */}
                <div className="pt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleSubmitWhatsApp}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Réserver via WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitOnline}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-sage-600 to-sage-500 hover:from-sage-700 hover:to-sage-600 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Réserver en ligne
                  </button>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                  En réservant, vous acceptez d'être contacté(e) pour confirmer votre réservation.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReserveMenuPage