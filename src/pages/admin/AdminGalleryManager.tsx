import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon, Info } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type GalleryItem = {
  id: string
  image_url: string
  caption: string | null
  uploaded_at: string
}

const AdminGalleryManager = () => {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Erreur chargement galerie:', error)
      toast.error('Erreur lors du chargement des photos.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, WEBP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image est trop volumineuse. Maximum 5 Mo.')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('gallery_items')
        .insert([{ image_url: publicUrl, caption: caption.trim() || null }])

      if (dbError) throw dbError

      toast.success('✅ Photo ajoutée avec succès !')
      setCaption('')
      loadImages()
    } catch (error: any) {
      console.error('Erreur upload:', error)
      toast.error('❌ Erreur lors de l\'upload : ' + (error.message || 'Veuillez réessayer.'))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Supprimer définitivement cette photo ?')) return

    try {
      const fileName = imageUrl.split('/').pop()
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName])
      }

      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('✅ Photo supprimée')
      loadImages()
    } catch (error: any) {
      toast.error('❌ Erreur lors de la suppression.')
    }
  }

  const todayDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
            📸 Galerie photos
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {todayDate.charAt(0).toUpperCase() + todayDate.slice(1)} • {images.length} photo(s)
          </p>
        </div>
      </div>

      {/* Message d'aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Comment ça marche ?</p>
          <p className="text-sm text-blue-700 mt-0.5">
            Ajoutez des photos de l'ambiance de votre établissement. Elles apparaîtront dans la galerie publique du site.
            Formats acceptés : JPG, PNG, WEBP. Taille maximum : 5 Mo.
          </p>
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">➕ Ajouter une photo</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="gallery-caption" className="block text-sm font-medium text-gray-700 mb-1.5">
              Légende (optionnelle)
            </label>
            <input
              id="gallery-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ex: Ambiance Samedi Soir, Terrasse au coucher du soleil..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="flex items-end">
            <input
              ref={fileInputRef}
              id="gallery-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-50 shadow-sm whitespace-nowrap"
              title="Choisir une photo à uploader"
            >
              <Upload size={18} />
              <span>{uploading ? 'Envoi en cours...' : 'Choisir une photo'}</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ✅ Formats acceptés : JPG, PNG, WEBP — Taille maximum : 5 Mo
        </p>
      </div>

      {/* Grille de photos */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🖼️ Photos actuelles ({images.length})
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune photo pour le moment</h3>
            <p className="text-gray-500 mb-1">La galerie publique est vide.</p>
            <p className="text-gray-400 text-sm">Cliquez sur "Choisir une photo" pour commencer à remplir votre galerie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || 'Photo de la galerie Sunset'}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.id, img.image_url)}
                    className="p-2.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                    title="Supprimer cette photo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {/* Légende */}
                {img.caption && (
                  <div className="p-3">
                    <p className="text-sm text-gray-700 font-medium truncate">{img.caption}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(img.uploaded_at), 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistiques rapides */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total photos</p>
              <p className="text-2xl font-display font-bold text-gray-900">{images.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dernière ajoutée</p>
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(images[0].uploaded_at), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminGalleryManager