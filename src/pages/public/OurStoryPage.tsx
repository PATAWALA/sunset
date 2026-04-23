import { motion } from 'framer-motion'
import { 
  Star, 
  Heart, 
  MapPin, 
  Award, 
  Quote, 
  Sparkles,
  Music,
  Calendar,
  Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'

const OurStoryPage = () => {
  const stats = [
    { icon: Calendar, value: '500+', label: 'Soirées organisées', color: 'from-amber-500 to-orange-600' },
    { icon: Heart, value: '25 000+', label: 'Clients conquis', color: 'from-red-500 to-pink-600' },
    { icon: Music, value: '100+', label: 'Artistes & DJs', color: 'from-purple-500 to-violet-600' },
    { icon: Star, value: '4.8', label: 'Note moyenne', color: 'from-yellow-500 to-amber-600' },
  ]

  const team = [
    {
      name: 'Madame la Fondatrice',
      role: 'Fondatrice & Visionnaire',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      bio: 'Une femme d\'affaires audacieuse qui a transformé sa passion pour l\'hospitalité en un lieu mythique. Son rêve : offrir à Ouagadougou une expérience nocturne inégalée, où chaque client repart avec des étoiles plein les yeux.',
      quote: '"Sunset n\'est pas qu\'un bar, c\'est une émotion."'
    },
    {
      name: 'Chef Ibrahim',
      role: 'Chef Exécutif',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80',
      bio: 'Formé aux quatre coins du monde, il marie les saveurs locales aux techniques internationales. Sa cuisine est un voyage gustatif qui surprend et enchante les papilles.',
      quote: '"Chaque plat raconte une histoire."'
    },
    {
      name: 'DJ Amina',
      role: 'Directrice Artistique & DJ Résidente',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
      bio: 'Aux platines depuis l\'ouverture, elle connaît les beats qui font danser Ouaga. Afrobeat, dancehall, hits internationaux : elle lit la foule comme personne.',
      quote: '"La musique est le cœur battant de Sunset."'
    },
    {
      name: 'Jean-Marc',
      role: 'Chef Barman',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      bio: 'Mixologue passionné, créateur des cocktails signatures qui font la renommée de Sunset. Chaque cocktail est une œuvre d\'art liquide.',
      quote: '"Un bon cocktail, c\'est un coucher de soleil dans un verre."'
    }
  ]

  const timeline = [
    {
      year: '2018',
      title: 'La Vision',
      description: 'Une jeune entrepreneure imagine un lieu unique à Ouagadougou, perché en hauteur, où la nuit serait plus belle qu\'ailleurs.',
      icon: Eye
    },
    {
      year: '2020',
      title: 'L\'Ouverture',
      description: 'Sunset Bar ouvre ses portes au cœur du quartier Ouaga 2000. La terrasse panoramique devient instantanément un symbole.',
      icon: Sparkles
    },
    {
      year: '2022',
      title: 'La Consécration',
      description: 'Sunset est élu "Meilleur Bar de Ouagadougou". La carte s\'enrichit d\'une cuisine signature audacieuse.',
      icon: Award
    },
    {
      year: '2024',
      title: 'L\'Expérience',
      description: 'Plus qu\'un bar, Sunset est devenu une destination. Événements privés, concerts live, et une communauté fidèle.',
      icon: Star
    }
  ]

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* ============================ */}
      {/* HERO */}
      {/* ============================ */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1920" 
            alt="Sunset Bar - Vue" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F1A]/80 via-[#0F0F1A]/60 to-[#0F0F1A]" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full text-amber-300 text-sm mb-8">
              <Sparkles size={16} />
              <span>Notre Histoire</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight">
              Plus qu'un bar,
              <br />
              <span className="sunset-gradient bg-clip-text text-transparent">une légende</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Depuis notre création, Sunset redéfinit les nuits de Ouagadougou.
              Un lieu où l'excellence rencontre l'émotion, où chaque soirée
              devient un souvenir gravé à jamais.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================ */}
      {/* STATS */}
      {/* ============================ */}
      <section className="py-16 bg-[#0F0F1A]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-display font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* TIMELINE */}
      {/* ============================ */}
      <section className="py-20 night-gradient">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Notre <span className="sunset-gradient bg-clip-text text-transparent">Parcours</span>
            </h2>
            <p className="text-gray-400 text-lg">Les grandes dates qui ont fait Sunset</p>
          </motion.div>

          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500 via-amber-500/50 to-transparent -translate-x-1/2" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative flex items-start gap-6 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Point sur la timeline */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-amber-500 rounded-full -translate-x-1/2 shadow-lg shadow-amber-500/50 z-10" />

                {/* Contenu */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <item.icon size={20} className="text-amber-400" />
                      </div>
                      <span className="text-amber-400 font-display font-bold text-xl">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* ÉQUIPE */}
      {/* ============================ */}
      <section className="py-20 bg-[#0F0F1A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Les visages de <span className="sunset-gradient bg-clip-text text-transparent">Sunset</span>
            </h2>
            <p className="text-gray-400 text-lg">Celles et ceux qui font battre le cœur de Sunset chaque soir</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 flex flex-col sm:flex-row gap-6"
              >
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur-lg opacity-30" />
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-500/50"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-amber-400 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{member.bio}</p>
                  <div className="flex items-center gap-2 text-amber-500/60 italic text-sm">
                    <Quote size={14} />
                    <span>{member.quote}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* CITATION FINALE */}
      {/* ============================ */}
      <section className="py-20 night-gradient">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 text-8xl text-amber-500/10 select-none">"</div>
            <div className="absolute -bottom-10 -right-10 text-8xl text-amber-500/10 select-none">"</div>
            
            <Award size={40} className="text-amber-400 mx-auto mb-6" />
            
            <p className="text-2xl md:text-3xl font-display font-bold text-white leading-relaxed mb-6">
              "Sunset est plus qu'un lieu.
              <br />
              C'est <span className="sunset-gradient bg-clip-text text-transparent">une émotion</span>,
              une <span className="sunset-gradient bg-clip-text text-transparent">rencontre</span>,
              un <span className="sunset-gradient bg-clip-text text-transparent">souvenir</span>."
            </p>
            
            <p className="text-gray-400 text-lg">
              Venez vivre l'expérience. On vous attend.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link 
                to="/events" 
                className="btn-primary"
              >
                Je réserve ma soirée
              </Link>
              <Link 
                to="/menu" 
                className="btn-outline"
              >
                Je découvre le menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================ */}
      {/* VENIR */}
      {/* ============================ */}
      <section className="py-20 bg-[#0F0F1A]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="glass-card p-8 md:p-12">
            <MapPin size={40} className="text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-6">Venez nous voir</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-amber-400 font-semibold mb-1">Adresse</p>
                <p className="text-gray-400 text-sm">
                  Quartier Ouaga 2000<br />
                  À l'étage, vue panoramique<br />
                  Ouagadougou, Burkina Faso
                </p>
              </div>
              <div>
                <p className="text-amber-400 font-semibold mb-1">Horaires</p>
                <p className="text-gray-400 text-sm">
                  Mardi - Dimanche<br />
                  18h - 02h<br />
                  <span className="text-gray-500">Fermé le Lundi</span>
                </p>
              </div>
              <div>
                <p className="text-amber-400 font-semibold mb-1">Contact</p>
                <p className="text-gray-400 text-sm">
                  <a href="tel:+22600000000" className="hover:text-amber-300 transition">+226 00 00 00 00</a><br />
                  <span className="text-gray-500">Réservations & Événements</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OurStoryPage