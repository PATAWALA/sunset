import { useEffect, useState } from 'react'
import {
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Search,
  Info,
  Calendar,
  Users,
  Clock
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

type ReservationWithEvent = {
  id: string
  event_id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  number_of_guests: number
  special_request: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  table_preference: string | null
  created_at: string
  event: {
    title: string
    event_date: string
    start_time?: string
  } | null
}

type FilterPeriod = 'all' | 'today' | 'yesterday' | 'thisWeek'

const AdminReservations = () => {
  const [reservations, setReservations] = useState<ReservationWithEvent[]>([])
  const [filteredReservations, setFilteredReservations] = useState<ReservationWithEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all')

  useEffect(() => {
    loadReservations()
  }, [])

  useEffect(() => {
    filterReservations()
  }, [reservations, filterPeriod, searchTerm])

  const loadReservations = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`*, event:events(title, event_date, start_time)`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterReservations = () => {
    let filtered = [...reservations]

    // Filtre par période
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = subDays(today, 1)
    const weekAgo = subDays(today, 7)

    if (filterPeriod === 'today') {
      filtered = filtered.filter(r => new Date(r.created_at) >= today)
    } else if (filterPeriod === 'yesterday') {
      filtered = filtered.filter(r => {
        const d = new Date(r.created_at)
        return d >= yesterday && d < today
      })
    } else if (filterPeriod === 'thisWeek') {
      filtered = filtered.filter(r => new Date(r.created_at) >= weekAgo)
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(r =>
        r.customer_name.toLowerCase().includes(term) ||
        r.customer_phone.includes(term) ||
        r.event?.title?.toLowerCase().includes(term)
      )
    }

    setFilteredReservations(filtered)
  }

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled', reservation: ReservationWithEvent) => {
    try {
      const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
      if (error) throw error

      if (status === 'confirmed' && reservation.customer_phone) {
        const phone = reservation.customer_phone.replace(/\D/g, '')
        const msg = encodeURIComponent(
          `🌅 *SUNSET - RÉSERVATION CONFIRMÉE*\n\n` +
          `Bonjour ${reservation.customer_name},\n\n` +
          `✅ Votre réservation pour *${reservation.event?.title}* est *CONFIRMÉE* !\n\n` +
          `📅 Date : ${reservation.event?.event_date ? format(new Date(reservation.event.event_date), 'EEEE d MMMM yyyy', { locale: fr }) : ''}\n` +
          `🕐 Heure : ${reservation.event?.start_time?.slice(0, 5) || ''}\n` +
          `👥 Personnes : ${reservation.number_of_guests}\n` +
          `🪑 Table : ${reservation.table_preference || 'Non précisé'}\n\n` +
          `📍 Sunset Bar, Quartier Ouaga 2000\n\n` +
          `À très bientôt ! 🕺💃\nL'équipe Sunset 🌅`
        )
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
      }

      toast.success(status === 'confirmed' ? '✅ Réservation confirmée ! WhatsApp ouvert.' : '❌ Réservation annulée.')
      loadReservations()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour.')
    }
  }

  const todayDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Statistiques rapides
  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
            📋 Réservations
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {todayDate.charAt(0).toUpperCase() + todayDate.slice(1)} • {stats.total} réservation(s) au total
          </p>
        </div>
      </div>

      {/* Message d'aide */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
        <Info size={18} className="text-purple-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-purple-800">Gérez vos réservations</p>
          <p className="text-sm text-purple-700 mt-0.5">
            Consultez, confirmez ou annulez les demandes de réservation. 
            Quand vous confirmez, un message WhatsApp est automatiquement préparé pour informer le client.
          </p>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700', icon: Users },
          { label: 'En attente', value: stats.pending, color: 'bg-amber-100 text-amber-700', icon: Clock },
          { label: 'Confirmées', value: stats.confirmed, color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
          { label: 'Annulées', value: stats.cancelled, color: 'bg-red-100 text-red-700', icon: XCircle },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className={`p-1.5 rounded-lg ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, téléphone ou événement..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
              aria-label="Rechercher une réservation"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all' as FilterPeriod, label: 'Tout' },
              { id: 'today' as FilterPeriod, label: 'Aujourd\'hui' },
              { id: 'yesterday' as FilterPeriod, label: 'Hier' },
              { id: 'thisWeek' as FilterPeriod, label: 'Cette semaine' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterPeriod(f.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition ${
                  filterPeriod === f.id
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={`Filtrer les réservations : ${f.label}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            {filterPeriod === 'all' ? 'Toutes' : filterPeriod === 'today' ? 'Aujourd\'hui' : filterPeriod === 'yesterday' ? 'Hier' : 'Cette semaine'}
            {' : '}{filteredReservations.length} réservation(s)
          </h3>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500">Essayez de changer les filtres ou la période.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredReservations.map((res) => (
              <div
                key={res.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-4 border border-gray-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      res.status === 'confirmed' ? 'bg-emerald-500' :
                      res.status === 'cancelled' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`} />
                    <p className="font-semibold text-gray-900">{res.customer_name}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 ml-4">
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {res.customer_phone}
                    </span>
                    {res.customer_email && (
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {res.customer_email}
                      </span>
                    )}
                  </div>
                  
                  <div className="ml-4 mt-2 text-sm text-gray-600">
                    <p>
                      🎉 <strong>{res.event?.title || 'Événement inconnu'}</strong>
                      {' • '}👥 {res.number_of_guests} personne(s)
                      {' • '}🪑 {res.table_preference || 'Sans préférence'}
                    </p>
                    {res.event?.event_date && (
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(res.event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                        {' à '}{res.event?.start_time?.slice(0, 5) || '—'}
                      </p>
                    )}
                    {res.special_request && (
                      <p className="text-xs text-gray-500 mt-1">📝 {res.special_request}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Reçue le {format(new Date(res.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {res.status === 'confirmed' ? '✅ Confirmée' : res.status === 'cancelled' ? '❌ Annulée' : '⏳ En attente'}
                  </span>

                  {res.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(res.id, 'confirmed', res)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                        title="Confirmer cette réservation et ouvrir WhatsApp"
                      >
                        ✅ Confirmer
                      </button>
                      <button
                        onClick={() => updateStatus(res.id, 'cancelled', res)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                        title="Annuler cette réservation"
                      >
                        ❌ Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReservations