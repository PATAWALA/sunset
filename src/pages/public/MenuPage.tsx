import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Clock,
  ChefHat,
  ShoppingCart,
  CalendarDays,
  X,
  Phone,
  MapPin,
  UtensilsCrossed,
  Wine,
  Coffee,
  CakeSlice
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'

// Types
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

type MenuCategory = {
  id: string
  name: string
  icon: string
  description: string
}

const WHATSAPP_PHONE = '22600000000'

// Catégories statiques
const menuCategories: MenuCategory[] = [
  { id: 'cocktails', name: 'Cocktails Signature', icon: '🍹', description: 'Des créations uniques inspirées du coucher de soleil' },
  { id: 'plats', name: 'Plats à partager', icon: '🍽️', description: 'Une cuisine généreuse aux saveurs locales et internationales' },
  { id: 'softs', name: 'Boissons fraîches', icon: '🧃', description: 'Jus naturels, sodas et boissons sans alcool' },
  { id: 'desserts', name: 'Douceurs sucrées', icon: '🍰', description: 'Pour finir la soirée en beauté' }
]

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('cocktails')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    quantity: 1,
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Charger les plats depuis Supabase
  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      console.error('Erreur chargement menu:', error)
      toast.error('Impossible de charger le menu pour le moment.')
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrer les items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = item.category === activeCategory
    const matchesSearch = searchTerm.trim() === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const currentCategory = menuCategories.find(c => c.id === activeCategory)

  const handleOpenOrder = (item: MenuItem) => {
    setSelectedItem(item)
    setShowOrderModal(true)
    setOrderForm({
      name: '',
      phone: '',
      email: '',
      guests: 2,
      quantity: 1,
      notes: ''
    })
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderForm.name.trim() || !orderForm.phone.trim()) {
      toast.error('Veuillez remplir votre nom et numéro de téléphone.')
      return
    }

    setIsSubmitting(true)

    const message = encodeURIComponent(
      `🛒 *COMMANDE SUNSET*\n\n` +
      `👤 *Client :* ${orderForm.name}\n` +
      `📞 *Tél :* ${orderForm.phone}\n` +
      `📧 *Email :* ${orderForm.email || 'Non précisé'}\n\n` +
      `🍽️ *Plat commandé :* ${selectedItem?.name}\n` +
      `📝 *Description :* ${selectedItem?.description || ''}\n` +
      `💰 *Prix unitaire :* ${selectedItem?.price}\n` +
      `🔢 *Quantité :* ${orderForm.quantity}\n` +
      `👥 *Nombre de couverts :* ${orderForm.guests}\n\n` +
      `💬 *Notes :* ${orderForm.notes || 'Aucune'}\n\n` +
      `📍 *Sunset Bar, Ouaga 2000*\n` +
      `✅ Merci de confirmer la commande.`
    )

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank')

    toast.success('🛒 Commande envoyée ! Continuez sur WhatsApp.', {
      description: `Votre commande de "${selectedItem?.name}" a été transmise.`,
      duration: 5000
    })

    setShowOrderModal(false)
    setSelectedItem(null)
    setOrderForm({ name: '', phone: '', email: '', guests: 2, quantity: 1, notes: '' })
    setIsSubmitting(false)
  }

  const getCategoryIcon = (catId: string) => {
    const icons: Record<string, any> = {
      'cocktails': Wine,
      'plats': UtensilsCrossed,
      'softs': Coffee,
      'desserts': CakeSlice
    }
    return icons[catId] || UtensilsCrossed
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920"
            alt="Carte Sunset"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F1A]/90 via-[#0F0F1A]/70 to-[#0F0F1A]" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full text-amber-300 text-sm mb-8">
              <ChefHat size={18} />
              <span className="font-medium">Carte Sunset</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight">
              <span className="sunset-gradient bg-clip-text text-transparent">Saveurs</span>
              <br />& Sensations
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Une cuisine généreuse aux accents locaux et internationaux.
              Des cocktails signatures pour sublimer vos soirées au-dessus de Ouagadougou.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catégories */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {menuCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.id)
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.97 }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xl shadow-amber-500/30 scale-105'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={32} className={`mx-auto mb-3 ${activeCategory === cat.id ? 'text-white' : 'text-amber-400'}`} />
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <h3 className="font-semibold text-sm md:text-base">{cat.name}</h3>
                <p className="text-xs mt-1 opacity-70 hidden md:block">{cat.description}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-white">{currentCategory?.name}</h2>
            <p className="text-gray-400 mt-1">{currentCategory?.description}</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un plat ou cocktail..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              aria-label="Rechercher dans le menu"
            />
          </div>
        </div>
      </div>

      {/* Grille des menus */}
      <div className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun résultat trouvé</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('cocktails'); }}
              className="mt-4 text-amber-400 hover:text-amber-300 transition"
            >
              Voir toute la carte
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="group relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-[#0F0F1A]/40 to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {item.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Prix */}
                  <div className="absolute bottom-4 right-4">
                    <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl text-xl shadow-xl shadow-amber-500/30">
                      {item.price}
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Boutons d'action */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleOpenOrder(item)}
                      className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-amber-500/30"
                      title="Commander ce plat"
                    >
                      <ShoppingCart size={16} />
                      <span className="text-sm">Commander</span>
                    </button>
                    <Link
                      to={`/reserver-menu?plat=${encodeURIComponent(item.name)}&prix=${encodeURIComponent(item.price)}`}
                      className="flex items-center justify-center gap-2 border-2 border-white/30 hover:border-amber-500 text-white hover:text-amber-400 py-3 rounded-xl font-medium transition-all hover:bg-white/5"
                      title="Réserver une table avec ce menu"
                    >
                      <CalendarDays size={16} />
                      <span className="text-sm">Réserver</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Section Infos */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 text-center">
            <Clock size={32} className="text-amber-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Horaires</h3>
            <p className="text-gray-400 text-sm">Mardi - Dimanche</p>
            <p className="text-white font-medium">18h - 02h</p>
            <p className="text-gray-500 text-xs mt-2">Cuisine jusqu'à 23h30</p>
          </div>
          <div className="glass-card p-8 text-center">
            <MapPin size={32} className="text-amber-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Emplacement</h3>
            <p className="text-gray-400 text-sm">Quartier Ouaga 2000</p>
            <p className="text-white font-medium">À l'étage, vue panoramique</p>
          </div>
          <div className="glass-card p-8 text-center">
            <Phone size={32} className="text-amber-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Contact</h3>
            <p className="text-gray-400 text-sm">Réservations & Commandes</p>
            <a href="tel:+22600000000" className="text-amber-400 font-medium hover:text-amber-300">+226 00 00 00 00</a>
          </div>
        </div>
      </div>

      {/* Modal de commande */}
      <AnimatePresence>
        {showOrderModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1A] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-48 rounded-t-3xl overflow-hidden">
                <img
                  src={selectedItem.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] to-transparent" />
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition"
                  title="Fermer"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {selectedItem.tags?.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl font-display font-bold text-white">{selectedItem.name}</h2>
                    </div>
                    <span className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-lg">
                      {selectedItem.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div className="p-6">
                <p className="text-gray-300 mb-6">{selectedItem.description}</p>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Nom complet *</label>
                      <input
                        type="text"
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Téléphone *</label>
                      <input
                        type="tel"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition"
                        placeholder="+226 XX XX XX XX"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Email (optionnel)</label>
                    <input
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">Nombre de couverts</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={orderForm.guests}
                        onChange={(e) => setOrderForm({ ...orderForm, guests: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Notes particulières</label>
                    <textarea
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 transition resize-none"
                      placeholder="Allergies, préférences, instructions..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold text-lg transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          Commander via WhatsApp
                        </>
                      )}
                    </button>
                    <Link
                      to={`/reserver-menu?plat=${encodeURIComponent(selectedItem.name)}&prix=${encodeURIComponent(selectedItem.price)}`}
                      className="flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:border-amber-500 hover:text-amber-400 px-6 py-3.5 rounded-xl font-medium transition"
                      onClick={() => setShowOrderModal(false)}
                    >
                      <CalendarDays size={20} />
                      Réserver une table
                    </Link>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MenuPage