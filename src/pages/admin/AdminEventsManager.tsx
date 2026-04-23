import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Upload,
  X,
  Save,
  Star,
  Info
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type Event = {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string
  end_time: string | null
  cover_image_url: string | null
  is_featured: boolean
  max_capacity: number | null
  created_at: string
}

const AdminEventsManager = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '20:00',
    end_time: '02:00',
    cover_image_url: '',
    is_featured: false,
    max_capacity: 100
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) {
      toast.error('Erreur lors du chargement des événements')
    } else {
      setEvents(data || [])
    }
    setIsLoading(false)
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `event-covers/${fileName}`

      const { error } = await supabase.storage
        .from('events')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title || !form.event_date) {
      toast.error('Le titre et la date sont obligatoires.')
      return
    }

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(form)
          .eq('id', editingEvent.id)

        if (error) throw error
        toast.success('✅ Événement mis à jour avec succès !')
      } else {
        const { error } = await supabase
          .from('events')
          .insert([form])

        if (error) throw error
        toast.success('🎉 Événement créé avec succès !')
      }

      setShowModal(false)
      resetForm()
      loadEvents()
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cet événement ? Cette action est irréversible.')) return

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Événement supprimé')
      loadEvents()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleToggleFeatured = async (event: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_featured: !event.is_featured })
        .eq('id', event.id)

      if (error) throw error
      loadEvents()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    setForm({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      start_time: event.start_time.slice(0, 5),
      end_time: event.end_time?.slice(0, 5) || '02:00',
      cover_image_url: event.cover_image_url || '',
      is_featured: event.is_featured,
      max_capacity: event.max_capacity || 100
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingEvent(null)
    setForm({
      title: '',
      description: '',
      event_date: '',
      start_time: '20:00',
      end_time: '02:00',
      cover_image_url: '',
      is_featured: false,
      max_capacity: 100
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await handleImageUpload(file)
    if (url) {
      setForm({ ...form, cover_image_url: url })
    }
  }

  const todayDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
            Gestion des événements
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            📅 {todayDate.charAt(0).toUpperCase() + todayDate.slice(1)} • {events.length} événement(s) programmé(s)
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium text-sm transition shadow-sm"
          title="Créer un nouvel événement"
        >
          <Plus size={18} />
          <span>Nouvel événement</span>
        </button>
      </div>

      {/* Message d'aide */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">Comment ça marche ?</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Créez vos événements ici. Ils apparaîtront automatiquement sur le site.
            Utilisez l'étoile ⭐ pour mettre un événement en avant sur la page d'accueil.
          </p>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement pour le moment</h3>
            <p className="text-gray-500 mb-6">Créez votre premier événement pour commencer à recevoir des réservations.</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium transition"
            >
              <Plus size={18} />
              <span>Créer un événement</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Événement</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Horaire</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Places</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">À la une</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-5">
                      {event.cover_image_url ? (
                        <img src={event.cover_image_url} alt={`Image de ${event.title}`} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{event.description || 'Aucune description'}</p>
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-700">
                      {format(new Date(event.event_date), 'dd/MM/yyyy')}
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-700">
                      {event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5) || '02:00'}
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-700">
                      {event.max_capacity || '—'}
                    </td>
                    <td className="py-3 px-5">
                      <button
                        onClick={() => handleToggleFeatured(event)}
                        className={`p-2 rounded-lg transition ${
                          event.is_featured
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-gray-100 text-gray-400 hover:text-amber-600'
                        }`}
                        title={event.is_featured ? "Retirer de la une" : "Mettre à la une"}
                      >
                        <Star size={18} fill={event.is_featured ? '#F5A623' : 'none'} />
                      </button>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                          title="Modifier cet événement"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                          title="Supprimer cet événement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistiques rapides */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total événements</p>
            <p className="text-2xl font-display font-bold text-gray-900">{events.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">À la une</p>
            <p className="text-2xl font-display font-bold text-amber-600">{events.filter(e => e.is_featured).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">À venir</p>
            <p className="text-2xl font-display font-bold text-emerald-600">
              {events.filter(e => new Date(e.event_date), new Date().setHours(0,0,0,0)).length}
            </p>
          </div>
        </div>
      )}

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
          >
            {/* En-tête du modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingEvent ? 'Modifiez les informations de l\'événement' : 'Remplissez les informations pour créer un nouvel événement'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Titre */}
              <div>
                <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Titre de l'événement <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Ex: Soirée Live - Abou Diarra"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="event-description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Décrivez l'ambiance, les artistes, les animations prévues..."
                />
              </div>

              {/* Date et capacité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="event-capacity" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Capacité maximale
                  </label>
                  <input
                    id="event-capacity"
                    type="number"
                    value={form.max_capacity}
                    onChange={(e) => setForm({ ...form, max_capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="Ex: 150"
                    min="1"
                  />
                </div>
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-start" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Heure de début
                  </label>
                  <input
                    id="event-start"
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor="event-end" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Heure de fin
                  </label>
                  <input
                    id="event-end"
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Image de couverture
                </label>
                <div className="flex items-center gap-4 mb-3">
                  {form.cover_image_url && (
                    <img src={form.cover_image_url} alt="Aperçu de la couverture" className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-200" />
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      id="event-image-file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 text-sm font-medium"
                      title="Choisir une image depuis votre appareil"
                    >
                      <Upload size={16} />
                      {uploading ? 'Envoi en cours...' : 'Choisir une image'}
                    </button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WEBP. Max 5 Mo.</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="event-image-url" className="block text-xs text-gray-500 mb-1">
                    Ou collez une URL d'image :
                  </label>
                  <input
                    id="event-image-url"
                    type="url"
                    value={form.cover_image_url}
                    onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
              </div>

              {/* À la une */}
              <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
                <label htmlFor="is_featured" className="text-gray-700 font-medium cursor-pointer">
                  ⭐ Mettre en avant (À la une)
                </label>
                <span className="text-gray-400 text-sm">— Apparaîtra en grand sur la page d'accueil</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-medium transition shadow-sm disabled:opacity-50"
                  title={editingEvent ? "Enregistrer les modifications" : "Créer l'événement"}
                >
                  <Save size={18} />
                  <span>{editingEvent ? 'Mettre à jour' : 'Créer l\'événement'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition"
                  title="Annuler et fermer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminEventsManager