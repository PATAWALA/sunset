import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fetchGallery } from '../../utils/supabase-helpers'
import type { GalleryItem } from '../../types/database'
import { Image as ImageIcon } from 'lucide-react'

const GalleryPage = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true)
      const data = await fetchGallery()
      setGallery(data)
      setIsLoading(false)
    }
    loadGallery()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen night-gradient pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen night-gradient pt-24">
      <div className="container mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            Notre <span className="sunset-gradient bg-clip-text text-transparent">Galerie</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Plongez dans l'ambiance Sunset. Découvrez nos meilleurs moments.
          </p>
        </motion.div>

        {gallery.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune photo pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(item)}
              >
                <img 
                  src={item.image_url} 
                  alt={item.caption || 'Sunset Bar'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm">{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] relative">
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.caption || 'Sunset Bar'}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              {selectedImage.caption && (
                <p className="text-white text-center mt-4">{selectedImage.caption}</p>
              )}
              <button 
                className="absolute top-4 right-4 text-white text-2xl hover:text-sunset-500"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryPage