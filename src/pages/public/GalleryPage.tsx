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
      <div className="min-h-screen bg-cream-50 pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto section-padding pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-sage-800 mb-4">
            Notre <span className="text-terracotta-500">Galerie</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Plongez dans l'ambiance de L'Imprévu. Découvrez nos plus beaux moments, nos plats signatures et notre cadre chaleureux.
          </p>
        </motion.div>

        {gallery.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={48} className="text-sage-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune photo pour le moment</p>
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
                className="relative h-64 rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(item)}
              >
                <img 
                  src={item.image_url} 
                  alt={item.caption || "L'Imprévu"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay subtil au hover */}
                <div className="absolute inset-0 bg-sage-900/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium">{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-sage-900/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] relative">
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.caption || "L'Imprévu"}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
              {selectedImage.caption && (
                <p className="text-white text-center mt-4 font-medium">{selectedImage.caption}</p>
              )}
              <button 
                className="absolute -top-10 right-0 text-white/80 hover:text-white text-3xl transition-colors"
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