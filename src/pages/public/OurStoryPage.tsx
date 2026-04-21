import { motion } from 'framer-motion'
import { Star, Heart, Users, MapPin } from 'lucide-react'

const OurStoryPage = () => {
  return (
    <div className="min-h-screen night-gradient pt-24">
      <div className="container mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            Notre <span className="sunset-gradient bg-clip-text text-transparent">Histoire</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Depuis 2020, Sunset Bar est devenu le lieu incontournable des nuits de Ouagadougou.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 md:p-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                <span className="text-3xl font-display text-sunset-400">S</span>unset Bar est né d'une passion 
                pour la fête, la musique et la gastronomie. Situé au cœur du quartier animé de Ouaga 2000, 
                notre établissement a ouvert ses portes avec une ambition simple : créer un lieu où chaque 
                soirée devient un souvenir inoubliable.
              </p>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Aujourd'hui, Sunset Bar est reconnu pour son ambiance unique, ses soirées à thème 
                légendaires et sa cuisine signature qui mélange saveurs locales et influences internationales. 
                Notre terrasse en plein air offre une vue imprenable sur les couchers de soleil de Ouaga, 
                créant cette "sensation émouvante et émerveilleuse" qui fait notre réputation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-sunset-500/20 flex items-center justify-center mx-auto mb-4">
                    <Star size={28} className="text-sunset-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">200+</h3>
                  <p className="text-gray-400">Soirées organisées</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-sunset-500/20 flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="text-sunset-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">15k+</h3>
                  <p className="text-gray-400">Clients satisfaits</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-sunset-500/20 flex items-center justify-center mx-auto mb-4">
                    <Users size={28} className="text-sunset-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">30+</h3>
                  <p className="text-gray-400">Artistes accueillis</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin size={24} className="text-sunset-400" />
                  Venez nous voir
                </h3>
                <p className="text-gray-300">
                  Sunset Bar - Quartier Ouaga 2000, Ouagadougou, Burkina Faso<br />
                  Ouvert du Mardi au Dimanche, de 18h à 02h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurStoryPage