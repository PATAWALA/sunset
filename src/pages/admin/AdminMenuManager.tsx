import { useState, useEffect, useRef } from 'react'
import { motion} from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Search,
  Eye,
  EyeOff,
  Info,
  Wine,
  UtensilsCrossed,
  Coffee,
  CakeSlice,
  ShoppingCart
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  updated_at: string
}

const CATEGORIES = [
  { id: 'cocktails', name: 'Cocktails', icon: Wine },
  { id: 'plats', name: 'Plats', icon: UtensilsCrossed },
  { id: 'softs', name: 'Boissons', icon: Coffee },
  { id: 'desserts', name: 'Desserts', icon: CakeSlice },
]

const AdminMenuManager = () => {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'plats',
    is_available: true,
    tags: ''
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement du menu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `menu-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('gallery').upload(fileName, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
      return publicUrl
    } catch (error) {
      toast.error('Erreur lors de l\'upload')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) {
      toast.error('Le nom et le prix sont obligatoires')
      return
    }

    try {
      const tagsArray = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const itemData = {
        name: form.name,
        description: form.description || null,
        price: form.price,
        image: form.image || null,
        category: form.category,
        is_available: form.is_available,
        tags: tagsArray.length > 0 ? tagsArray : null,
        updated_at: new Date().toISOString()
      }

      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)
        if (error) throw error
        toast.success('✅ Plat mis à jour !')
      } else {
        const { error } = await supabase.from('menu_items').insert([itemData])
        if (error) throw error
        toast.success('🍽️ Plat ajouté au menu !')
      }

      setShowModal(false)
      resetForm()
      loadItems()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce plat du menu ?')) return
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id)
      if (error) throw error
      toast.success('Plat supprimé')
      loadItems()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !item.is_available, updated_at: new Date().toISOString() })
        .eq('id', item.id)
      if (error) throw error
      loadItems()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      category: item.category,
      is_available: item.is_available,
      tags: item.tags?.join(', ') || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'plats',
      is_available: true,
      tags: ''
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleImageUpload(file)
    if (url) setForm({ ...form, image: url })
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm.trim() === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const todayDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  const stats = {
    total: items.length,
    available: items.filter(i => i.is_available).length,
    cocktails: items.filter(i => i.category === 'cocktails').length,
    plats: items.filter(i => i.category === 'plats').length,
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
            🍽️ Gestion du Menu
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {todayDate.charAt(0).toUpperCase() + todayDate.slice(1)} • {stats.total} plats au menu
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium text-sm transition shadow-sm"
          title="Ajouter un nouveau plat"
        >
          <Plus size={18} />
          <span>Ajouter un plat</span>
        </button>
      </div>

      {/* Message d'aide */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">Gérez votre carte</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Ajoutez, modifiez ou supprimez les plats et boissons. Les modifications apparaîtront instantanément sur le site.
          </p>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total plats', value: stats.total, color: 'bg-gray-100 text-gray-700', icon: ShoppingCart },
          { label: 'Disponibles', value: stats.available, color: 'bg-emerald-100 text-emerald-700', icon: Eye },
          { label: 'Cocktails', value: stats.cocktails, color: 'bg-amber-100 text-amber-700', icon: Wine },
          { label: 'Plats', value: stats.plats, color: 'bg-blue-100 text-blue-700', icon: UtensilsCrossed },
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
              placeholder="Rechercher un plat..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
              aria-label="Rechercher un plat"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition ${filterCategory === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Tous
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-1 ${filterCategory === cat.id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <cat.icon size={14} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des plats */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <UtensilsCrossed size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun plat trouvé</h3>
            <button onClick={() => { resetForm(); setShowModal(true) }} className="text-amber-500 hover:text-amber-600">
              Ajouter votre premier plat
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Image</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Plat</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Prix</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Dispo.</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Tags</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-5">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <UtensilsCrossed size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.description || '—'}</p>
                    </td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm font-semibold text-gray-900">{item.price}</td>
                    <td className="py-3 px-5">
                      <button
                        onClick={() => handleToggleAvailable(item)}
                        className={`p-2 rounded-lg transition ${item.is_available ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                        title={item.is_available ? 'Disponible' : 'Indisponible'}
                      >
                        {item.is_available ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(item)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600" title="Modifier">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600" title="Supprimer">
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

      {/* Modal Ajouter/Modifier */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Modifier le plat' : 'Nouveau plat'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Ex: Sunset Splash" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Décrivez le plat..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix *</label>
                  <input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Ex: 3500 F" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (séparés par des virgules)</label>
                <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Best-seller, Local, Épicé" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
                <div className="flex items-center gap-4">
                  {form.image && <img src={form.image} alt="" className="w-20 h-20 rounded-xl object-cover" />}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2  bg-amber-500 rounded-xl hover: bg-amber-400">
                    <Upload size={16} /> {uploading ? 'Upload...' : 'Choisir'}
                  </button>
                </div>
                <input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 mt-2" placeholder="Ou collez une URL" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="available" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                <label htmlFor="available" className="text-gray-700">Plat disponible</label>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-200">
                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                  <Save size={18} /> {editingItem ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">Annuler</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminMenuManager