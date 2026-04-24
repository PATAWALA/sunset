import { motion } from 'framer-motion'
import { 
  Star, 
  Heart, 
  MapPin, 
  Award, 
  Quote, 
  Sparkles,
  Coffee,
  Calendar,
  Eye,
  Bed,
  UtensilsCrossed
} from 'lucide-react'
import { Link } from 'react-router-dom'

const OurStoryPage = () => {
  const stats = [
    { icon: Calendar, value: '1000+', label: 'Événements traiteur', color: 'from-sage-500 to-sage-600' },
    { icon: Heart, value: '15 000+', label: 'Clients conquis', color: 'from-terracotta-500 to-terracotta-600' },
    { icon: Coffee, value: '2', label: 'Adresses à Cotonou', color: 'from-sage-600 to-sage-700' },
    { icon: Star, value: '4.8', label: 'Note moyenne', color: 'from-gold-500 to-gold-600' },
  ]

  const team = [
    {
      name: 'La Direction',
      role: 'Fondateurs',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      bio: 'Passionnés d\'hospitalité et de gastronomie, ils ont créé L\'Imprévu pour offrir à Cotonou un lieu unique où se mêlent café, bistrot et guesthouse. Leur vision : un accueil chaleureux et une cuisine authentique.',
      quote: '"L\'Imprévu, c\'est l\'art de recevoir à la béninoise."'
    },
    {
      name: 'Chef Exécutif',
      role: 'Chef Cuisinier',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80',
      bio: 'Formé aux saveurs locales et internationales, il sublime les produits du terroir. Ses pâtes fraîches, tajines et plats signatures font la réputation de L\'Imprévu bien au-delà de Cotonou.',
      quote: '"Chaque assiette est un voyage gustatif."'
    },
    {
      name: 'Équipe Traiteur',
      role: 'Service Traiteur Sur-Mesure',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
      bio: 'Du choix des mets à la qualité du service, notre équipe traiteur sublime vos événements. Inaugurations, réceptions, mariages : chaque détail est pensé pour vos moments précieux.',
      quote: '"Vos événements méritent l\'exceptionnel."'
    },
    {
      name: 'Équipe Guesthouse',
      role: 'Accueil & Hébergement',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80',
      bio: 'Deux adresses pour vous accueillir : Ganhi et Fidjrossè. Des chambres confortables, un service attentionné, et le meilleur de la cuisine béninoise à votre porte, que ce soit pour un séjour d\'affaires ou touristique.',
      quote: '"Votre chez-vous à Cotonou."'
    }
  ]

  const timeline = [
    {
      year: '2019',
      title: 'La Vision',
      description: 'L\'idée naît : créer un lieu unique à Cotonou, mêlant café, bistrot et guesthouse, où l\'on se sent comme à la maison.',
      icon: Eye
    },
    {
      year: '2020',
      title: 'L\'Ouverture',
      description: 'L\'Imprévu ouvre ses portes à Ganhi, face au siège d\'Ecobank. Le bistrot devient rapidement une adresse prisée.',
      icon: Sparkles
    },
    {
      year: '2022',
      title: 'L\'Expansion',
      description: 'Ouverture de L\'Annexe guesthouse à Fidjrossè. Le service traiteur se développe pour les événements privés.',
      icon: Award
    },
    {
      year: '2024',
      title: 'La Référence',
      description: 'L\'Imprévu est devenu une institution à Cotonou. Bistrot, guesthouse et traiteur : l\'art de recevoir à la béninoise.',
      icon: Star
    }
  ]

  return (
    <div className="bg-cream-50">
      {/* ============================ */}
      {/* HERO - Image nette, overlay léger */}
      {/* ============================ */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920" 
            alt="L'Imprévu - Bistrot" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-full text-sage-700 text-sm mb-8 shadow-sm">
              <Sparkles size={16} />
              <span>Notre Histoire</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight drop-shadow-lg">
              L'art de
              <br />
              <span className="text-gold-300">recevoir</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Depuis notre création, L'Imprévu redéfinit l'hospitalité à Cotonou.
              Un bistrot chaleureux, une guesthouse confortable, et un service traiteur
              d'exception pour sublimer vos événements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================ */}
      {/* STATS */}
      {/* ============================ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-cream-50 border border-cream-200 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-display font-bold text-sage-800 mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* TIMELINE */}
      {/* ============================ */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sage-800 mb-4">
              Notre <span className="text-terracotta-500">Parcours</span>
            </h2>
            <p className="text-gray-600 text-lg">Les grandes dates qui ont fait L'Imprévu</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sage-500 via-sage-500/50 to-transparent -translate-x-1/2" />

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
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-sage-500 rounded-full -translate-x-1/2 shadow-lg shadow-sage-500/50 z-10" />

                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white border border-cream-200 rounded-2xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
                        <item.icon size={20} className="text-sage-600" />
                      </div>
                      <span className="text-sage-600 font-display font-bold text-xl">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-sage-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sage-800 mb-4">
              Les visages de <span className="text-terracotta-500">L'Imprévu</span>
            </h2>
            <p className="text-gray-600 text-lg">Celles et ceux qui font vivre L'Imprévu chaque jour</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-cream-50 border border-cream-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm"
              >
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sage-500 to-terracotta-500 rounded-2xl blur-lg opacity-20" />
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-sage-300"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-sage-800 mb-1">{member.name}</h3>
                  <p className="text-terracotta-500 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{member.bio}</p>
                  <div className="flex items-center gap-2 text-sage-500 italic text-sm">
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
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-cream-200 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-lg"
          >
            <div className="absolute -top-10 -left-10 text-8xl text-sage-200 select-none">"</div>
            <div className="absolute -bottom-10 -right-10 text-8xl text-sage-200 select-none">"</div>
            
            <Award size={40} className="text-gold-500 mx-auto mb-6" />
            
            <p className="text-2xl md:text-3xl font-display font-bold text-sage-800 leading-relaxed mb-6">
              "L'Imprévu est plus qu'un restaurant.
              <br />
              C'est <span className="text-terracotta-500">une rencontre</span>,
              une <span className="text-terracotta-500">parenthèse</span>,
              un <span className="text-terracotta-500">art de vivre</span>."
            </p>
            
            <p className="text-gray-600 text-lg">
              Venez vivre l'expérience. On vous attend à Ganhi.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link 
                to="/events" 
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg"
              >
                Je réserve une table
              </Link>
              <Link 
                to="/menu" 
                className="border-2 border-sage-400 text-sage-700 hover:bg-sage-50 px-8 py-4 rounded-full font-bold text-lg transition"
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-8 md:p-12 shadow-sm">
            <MapPin size={40} className="text-terracotta-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-sage-800 mb-6">Venez nous voir</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-terracotta-500 font-semibold mb-1">Adresses</p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Ganhi</span>, face à Ecobank<br />
                  <span className="font-medium">Annexe</span>, Fidjrossè<br />
                  Cotonou, Bénin 🇧🇯
                </p>
              </div>
              <div>
                <p className="text-terracotta-500 font-semibold mb-1">Horaires</p>
                <p className="text-gray-600 text-sm">
                  Lundi - Samedi<br />
                  Midi & Soir<br />
                  <span className="text-gray-400">Menu de la semaine</span>
                </p>
              </div>
              <div>
                <p className="text-terracotta-500 font-semibold mb-1">Contact</p>
                <p className="text-gray-600 text-sm">
                  <a href="tel:+22966974040" className="hover:text-terracotta-500 transition font-medium">+229 66 97 40 40</a><br />
                  <span className="text-gray-400">Réservations & Traiteur</span>
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