import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Users,
  TrendingUp,
  PartyPopper,
  Trash2,
  Plus,
  Image as ImageIcon,
  Eye,
  ChevronRight,
  Star,
  Search,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Info,
  UtensilsCrossed,
  Edit,
  Save,
  X,
  Wine,
  Coffee,
  CakeSlice
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

// Types
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
}

type GalleryItem = {
  id: string
  image_url: string
  caption: string | null
  uploaded_at: string
}

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  image: string | null
  category: string
  is_available: boolean
  tags: string[] | null
  created_at: string
}

type Stats = {
  todayReservations: number
  activeEvents: number
  totalReservations: number
  pendingReservations: number
  totalMenuItems: number
}

type FilterPeriod = 'all' | 'today' | 'yesterday' | 'thisWeek'

const MENU_CATEGORIES = [
  { id: 'cocktails', name: 'Cocktails', icon: Wine },
  { id: 'plats', name: 'Plats', icon: UtensilsCrossed },
  { id: 'softs', name: 'Boissons', icon: Coffee },
  { id: 'desserts', name: 'Desserts', icon: CakeSlice },
]

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'events' | 'gallery' | 'menu'>('overview')
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [stats, setStats] = useState<Stats>({
    todayReservations: 0,
    activeEvents: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalMenuItems: 0
  })
  const [reservations, setReservations] = useState<ReservationWithEvent[]>([])
  const [filteredReservations, setFilteredReservations] = useState<ReservationWithEvent[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // États pour le modal menu
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'plats',
    is_available: true,
    tags: ''
  })

  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    filterReservations()
  }, [reservations, filterPeriod, searchTerm])

  const loadAllData = async () => {
    setIsLoading(true)
    await Promise.all([loadStats(), loadReservations(), loadEvents(), loadGallery(), loadMenuItems()])
    setIsLoading(false)
  }

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { count: todayCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true }).gte('created_at', today)
      const { count: activeCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).gte('event_date', today)
      const { count: totalCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true })
      const { count: pendingCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      const { count: menuCount } = await supabase.from('menu_items').select('*', { count: 'exact', head: true })
      setStats({
        todayReservations: todayCount || 0,
        activeEvents: activeCount || 0,
        totalReservations: totalCount || 0,
        pendingReservations: pendingCount || 0,
        totalMenuItems: menuCount || 0
      })
    } catch (error) {
      console.error('Erreur stats:', error)
    }
  }

  const loadReservations = async () => {
    try {
      const { data, error } = await supabase.from('reservations').select(`*, event:events(title, event_date, start_time)`).order('created_at', { ascending: false })
      if (error) throw error
      setReservations(data as ReservationWithEvent[] || [])
    } catch (error) { console.error('Erreur réservations:', error) }
  }

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true })
      if (error) throw error
      setEvents(data || [])
    } catch (error) { console.error('Erreur événements:', error) }
  }

  const loadGallery = async () => {
    try {
      const { data, error } = await supabase.from('gallery_items').select('*').order('uploaded_at', { ascending: false })
      if (error) throw error
      setGallery(data || [])
    } catch (error) { console.error('Erreur galerie:', error) }
  }

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*').order('category', { ascending: true }).order('created_at', { ascending: false })
      if (error) throw error
      setMenuItems(data || [])
    } catch (error) { console.error('Erreur menu:', error) }
  }

  const filterReservations = () => {
    let filtered = [...reservations]
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const yesterday = subDays(today, 1)
    const weekAgo = subDays(today, 7)
    if (filterPeriod === 'today') filtered = filtered.filter(r => new Date(r.created_at) >= today)
    else if (filterPeriod === 'yesterday') filtered = filtered.filter(r => { const d = new Date(r.created_at); return d >= yesterday && d < today })
    else if (filterPeriod === 'thisWeek') filtered = filtered.filter(r => new Date(r.created_at) >= weekAgo)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(r => r.customer_name.toLowerCase().includes(term) || r.customer_phone.includes(term) || r.event?.title?.toLowerCase().includes(term))
    }
    setFilteredReservations(filtered)
  }

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'cancelled', reservation: ReservationWithEvent) => {
    try {
      const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
      if (error) throw error
      if (status === 'confirmed' && reservation.customer_phone) {
        const phoneNumber = reservation.customer_phone.replace(/\D/g, '')
        const message = encodeURIComponent(`🌅 *SUNSET - RÉSERVATION CONFIRMÉE*\n\nBonjour ${reservation.customer_name},\n\n✅ Votre réservation pour *${reservation.event?.title}* est *CONFIRMÉE* !\n\n📍 Sunset Bar, Ouaga 2000\n\nÀ très bientôt ! 🕺💃\nL'équipe Sunset 🌅`)
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
      }
      toast.success(status === 'confirmed' ? '✅ Réservation confirmée !' : '❌ Réservation annulée')
      loadReservations(); loadStats()
    } catch (error) { toast.error('Erreur lors de la mise à jour') }
  }

  const deleteEvent = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    try { await supabase.from('events').delete().eq('id', id); toast.success('Événement supprimé'); loadEvents(); loadStats() }
    catch (error) { toast.error('Erreur lors de la suppression') }
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    try { await supabase.from('events').update({ is_featured: !current }).eq('id', id); toast.success('Événement mis à jour'); loadEvents() }
    catch (error) { toast.error('Erreur') }
  }

  const deleteGalleryItem = async (id: string, imageUrl: string) => {
    if (!confirm('Supprimer cette photo ?')) return
    try {
      const fileName = imageUrl.split('/').pop()
      if (fileName) await supabase.storage.from('gallery').remove([fileName])
      await supabase.from('gallery_items').delete().eq('id', id)
      toast.success('Photo supprimée'); loadGallery()
    } catch (error) { toast.error('Erreur') }
  }

  // ============ MENU CRUD ============
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!menuForm.name || !menuForm.price) { toast.error('Le nom et le prix sont obligatoires'); return }
    try {
      const tagsArray = menuForm.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      const itemData = {
        name: menuForm.name,
        description: menuForm.description || null,
        price: menuForm.price,
        image: menuForm.image || null,
        category: menuForm.category,
        is_available: menuForm.is_available,
        tags: tagsArray.length > 0 ? tagsArray : null
      }
      if (editingMenuItem) {
        await supabase.from('menu_items').update(itemData).eq('id', editingMenuItem.id)
        toast.success('✅ Plat mis à jour !')
      } else {
        await supabase.from('menu_items').insert([itemData])
        toast.success('🍽️ Plat ajouté au menu !')
      }
      setShowMenuModal(false); resetMenuForm(); loadMenuItems(); loadStats()
    } catch (error: any) { toast.error(error.message || 'Erreur') }
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Supprimer ce plat du menu ?')) return
    try { await supabase.from('menu_items').delete().eq('id', id); toast.success('Plat supprimé'); loadMenuItems(); loadStats() }
    catch (error) { toast.error('Erreur') }
  }

  const toggleMenuItemAvailable = async (item: MenuItem) => {
    try { await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id); loadMenuItems() }
    catch (error) { toast.error('Erreur') }
  }

  const openEditMenuModal = (item: MenuItem) => {
    setEditingMenuItem(item)
    setMenuForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      category: item.category,
      is_available: item.is_available,
      tags: item.tags?.join(', ') || ''
    })
    setShowMenuModal(true)
  }

  const resetMenuForm = () => {
    setEditingMenuItem(null)
    setMenuForm({ name: '', description: '', price: '', image: '', category: 'plats', is_available: true, tags: '' })
  }

  const StatCards = () => {
    const items = [
      { title: 'Aujourd\'hui', subtitle: 'Réservations du jour', value: stats.todayReservations, icon: Calendar, color: 'bg-blue-500' },
      { title: 'Actifs', subtitle: 'Événements à venir', value: stats.activeEvents, icon: PartyPopper, color: 'bg-amber-500' },
      { title: 'Total', subtitle: 'Réservations reçues', value: stats.totalReservations, icon: TrendingUp, color: 'bg-emerald-500' },
      { title: 'Menu', subtitle: 'Plats au menu', value: stats.totalMenuItems, icon: UtensilsCrossed, color: 'bg-purple-500' },
    ]
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-display font-bold text-gray-900">{item.value}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{item.title}</p>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </div>
              <div className={`${item.color} p-2.5 rounded-xl text-white`}><item.icon size={20} /></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const todayDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  const tabs = [
    { id: 'overview' as const, label: 'Vue d\'ensemble', icon: Eye, help: 'Statistiques et résumé de l\'activité' },
    { id: 'reservations' as const, label: 'Réservations', icon: Users, help: 'Liste de toutes les demandes de réservation' },
    { id: 'events' as const, label: 'Événements', icon: Calendar, help: 'Gérer la programmation des soirées' },
    { id: 'menu' as const, label: 'Menu', icon: UtensilsCrossed, help: 'Gérer les plats, cocktails et boissons' },
    { id: 'gallery' as const, label: 'Galerie', icon: ImageIcon, help: 'Photos de l\'ambiance et des soirées' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-0.5">📅 {todayDate.charAt(0).toUpperCase() + todayDate.slice(1)}</p>
        </div>
        <Link to="/admin/events">
          <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium text-sm transition shadow-sm" title="Créer un nouvel événement">
            <Plus size={18} /><span>Nouvel événement</span>
          </button>
        </Link>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? 'text-amber-600 border-amber-500 bg-amber-50/50' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}`}
              title={tab.help}>
              <tab.icon size={16} /><span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="px-1 py-2">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Info size={12} />
            {tabs.find(t => t.id === activeTab)?.help}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* VUE D'ENSEMBLE */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <StatCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Réservations récentes</h3>
                  <button onClick={() => setActiveTab('reservations')} className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">Voir tout <ChevronRight size={16} /></button>
                </div>
                <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                  {reservations.slice(0, 5).length === 0 ? (
                    <p className="text-center py-6 text-gray-400">Aucune réservation pour le moment.</p>
                  ) : (
                    reservations.slice(0, 5).map((res) => (
                      <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{res.customer_name}</p>
                          <p className="text-xs text-gray-500">{res.customer_phone} • {res.event?.title || '—'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : res.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {res.status === 'confirmed' ? '✅ Confirmée' : res.status === 'cancelled' ? '❌ Annulée' : '⏳ En attente'}
                          </span>
                          {res.status === 'pending' && (
                            <div className="flex gap-1">
                              <button onClick={() => updateReservationStatus(res.id, 'confirmed', res)} className="p-1.5 bg-emerald-600 text-white rounded-lg" title="Confirmer"><CheckCircle size={14} /></button>
                              <button onClick={() => updateReservationStatus(res.id, 'cancelled', res)} className="p-1.5 bg-red-600 text-white rounded-lg" title="Annuler"><XCircle size={14} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">📋 Résumé</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Réservations aujourd'hui</span><span className="font-bold text-gray-900">{stats.todayReservations}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Événements à venir</span><span className="font-bold text-gray-900">{stats.activeEvents}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Plats au menu</span><span className="font-bold text-purple-600">{stats.totalMenuItems}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">En attente de confirmation</span><span className="font-bold text-amber-600">{stats.pendingReservations}</span></div>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-200"><p className="text-xs text-gray-400">📅 {todayDate.charAt(0).toUpperCase() + todayDate.slice(1)}</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* RÉSERVATIONS (inchangé) */}
        {activeTab === 'reservations' && (
          <motion.div key="reservations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="Rechercher par nom, téléphone ou événement..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none" aria-label="Rechercher une réservation" />
                </div>
                <div className="flex gap-2">
                  {[{ id: 'all' as FilterPeriod, label: 'Tout' },{ id: 'today' as FilterPeriod, label: 'Aujourd\'hui' },{ id: 'yesterday' as FilterPeriod, label: 'Hier' },{ id: 'thisWeek' as FilterPeriod, label: 'Cette semaine' }].map((f) => (
                    <button key={f.id} onClick={() => setFilterPeriod(f.id)} className={`px-4 py-2.5 rounded-full text-sm font-medium transition ${filterPeriod === f.id ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f.label}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">{filteredReservations.length} réservation(s)</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredReservations.length === 0 ? <p className="text-center py-8 text-gray-400">Aucune réservation trouvée.</p> : filteredReservations.map((res) => (
                  <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{res.customer_name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Phone size={14} /> {res.customer_phone}</span>
                        {res.customer_email && <span className="flex items-center gap-1"><Mail size={14} /> {res.customer_email}</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{res.event?.title || '—'} • {res.number_of_guests} pers.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : res.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {res.status === 'confirmed' ? '✅ Confirmée' : res.status === 'cancelled' ? '❌ Annulée' : '⏳ En attente'}
                      </span>
                      {res.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateReservationStatus(res.id, 'confirmed', res)} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">✅ Confirmer</button>
                          <button onClick={() => updateReservationStatus(res.id, 'cancelled', res)} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">❌ Annuler</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ÉVÉNEMENTS (résumé) */}
        {activeTab === 'events' && (
          <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Programmation ({events.length})</h3>
                <Link to="/admin/events"><button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium"><Plus size={16} /> Nouveau</button></Link>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {events.length === 0 ? <p className="text-center py-8 text-gray-400">Aucun événement.</p> : events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {event.cover_image_url ? <img src={event.cover_image_url} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600"><PartyPopper size={20} /></div>}
                      <div><p className="font-semibold text-gray-900">{event.title}</p><p className="text-sm text-gray-500">{format(new Date(event.event_date), 'EEEE d MMMM', { locale: fr })} • {event.start_time.slice(0, 5)}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleFeatured(event.id, event.is_featured)} className={`p-2 rounded-lg transition ${event.is_featured ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}><Star size={18} fill={event.is_featured ? '#F5A623' : 'none'} /></button>
                      <button onClick={() => deleteEvent(event.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* GALERIE (résumé) */}
        {activeTab === 'gallery' && (
          <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Photos ({gallery.length})</h3>
                <Link to="/admin/gallery"><button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium"><Plus size={16} /> Ajouter</button></Link>
              </div>
              {gallery.length === 0 ? <p className="text-center py-8 text-gray-400">Aucune photo.</p> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto">
                  {gallery.map((item) => (
                    <div key={item.id} className="relative group">
                      <img src={item.image_url} alt="" className="w-full h-32 object-cover rounded-xl" />
                      <button onClick={() => deleteGalleryItem(item.id, item.image_url)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* MENU (NOUVEL ONGLET) */}
        {activeTab === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">🍽️ Menu ({menuItems.length} plats)</h3>
                <button onClick={() => { resetMenuForm(); setShowMenuModal(true) }} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  <Plus size={16} /> Ajouter un plat
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Image</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Plat</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Cat.</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Prix</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Dispo.</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {menuItems.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-400">Aucun plat au menu.</td></tr>
                    ) : menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          {item.image ? <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><UtensilsCrossed size={16} className="text-gray-400" /></div>}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.description || '—'}</p>
                        </td>
                        <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{item.category}</span></td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">{item.price}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => toggleMenuItemAvailable(item)} className={`p-1.5 rounded-lg transition ${item.is_available ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`} title={item.is_available ? 'Disponible' : 'Indisponible'}>
                            <Eye size={14} />
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button onClick={() => openEditMenuModal(item)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600" title="Modifier"><Edit size={14} /></button>
                            <button onClick={() => handleDeleteMenuItem(item.id)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600" title="Supprimer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Menu */}
            {showMenuModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900">{editingMenuItem ? 'Modifier le plat' : 'Nouveau plat'}</h2>
                    <button onClick={() => setShowMenuModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleSaveMenuItem} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input type="text" value={menuForm.name} onChange={e => setMenuForm({...menuForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Ex: Sunset Splash" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Description du plat..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix *</label>
                        <input type="text" value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Ex: 3 500 F" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                          {MENU_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                      <input type="text" value={menuForm.tags} onChange={e => setMenuForm({...menuForm, tags: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Best-seller, Local, Épicé" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                      <input type="url" value={menuForm.image} onChange={e => setMenuForm({...menuForm, image: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="https://..." />
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="menu-available" checked={menuForm.is_available} onChange={e => setMenuForm({...menuForm, is_available: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                      <label htmlFor="menu-available" className="text-sm text-gray-700">Plat disponible</label>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-gray-200">
                      <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"><Save size={16} /> {editingMenuItem ? 'Mettre à jour' : 'Ajouter'}</button>
                      <button type="button" onClick={() => setShowMenuModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">Annuler</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard