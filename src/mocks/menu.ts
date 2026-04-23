// Types pour le menu
export type MenuItem = {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: 'cocktails' | 'plats' | 'desserts' | 'softs'
  isAvailable: boolean
  tags?: string[] // ex: "Nouveau", "Best-seller", "Épicé"
}

// Types pour les catégories
export type MenuCategory = {
  id: string
  name: string
  icon: string
  description: string
}

// Catégories du menu
export const menuCategories: MenuCategory[] = [
  {
    id: 'cocktails',
    name: 'Cocktails Signature',
    icon: '🍹',
    description: 'Des créations uniques inspirées du coucher de soleil'
  },
  {
    id: 'plats',
    name: 'Plats à partager',
    icon: '🍽️',
    description: 'Une cuisine généreuse aux saveurs locales et internationales'
  },
  {
    id: 'softs',
    name: 'Boissons fraîches',
    icon: '🧃',
    description: 'Jus naturels, sodas et boissons sans alcool'
  },
  {
    id: 'desserts',
    name: 'Douceurs sucrées',
    icon: '🍰',
    description: 'Pour finir la soirée en beauté'
  }
]

// Données du menu
export const menuItems: MenuItem[] = [
  // COCKTAILS
  {
    id: 'cocktail-1',
    name: 'Sunset Splash',
    description: 'Rhum ambré, purée de mangue fraîche, citron vert, sirop de grenadine, glace pilée',
    price: '3 500 F',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600',
    category: 'cocktails',
    isAvailable: true,
    tags: ['Best-seller', 'Fruité']
  },
  {
    id: 'cocktail-2',
    name: 'Ouaga Mule',
    description: 'Vodka premium, gingembre frais, citron jaune, menthe du jardin, eau pétillante',
    price: '3 000 F',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600',
    category: 'cocktails',
    isAvailable: true,
    tags: ['Frais', 'Épicé']
  },
  {
    id: 'cocktail-3',
    name: 'Baobab Breeze',
    description: 'Gin artisanal, pulpe de fruit du baobab, tonic premium, zeste d\'orange',
    price: '4 000 F',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600',
    category: 'cocktails',
    isAvailable: true,
    tags: ['Nouveau', 'Local']
  },
  {
    id: 'cocktail-4',
    name: 'Bissap Mojito',
    description: 'Rhum blanc, infusion de bissap, menthe fraîche, citron vert, sucre de canne',
    price: '3 500 F',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600',
    category: 'cocktails',
    isAvailable: true,
    tags: ['Local', 'Frais']
  },
  {
    id: 'cocktail-5',
    name: 'Passion Sunset',
    description: 'Vodka, fruit de la passion, ananas, citron vert, sirop de vanille',
    price: '3 500 F',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600',
    category: 'cocktails',
    isAvailable: true,
    tags: ['Exotique']
  },
  {
    id: 'cocktail-6',
    name: 'Gingembre Royale',
    description: 'Champagne, liqueur de gingembre, citron vert, feuille d\'or comestible',
    price: '5 000 F',
    image: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?w=600',
    category: 'cocktails',
    isAvailable: true,
    tags: ['Premium', 'Luxe']
  },

  // PLATS
  {
    id: 'plat-1',
    name: 'Brochettes Sunset',
    description: 'Poulet mariné 24h aux épices locales, sauce arachide maison, légumes grillés, riz wolof',
    price: '5 000 F',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    category: 'plats',
    isAvailable: true,
    tags: ['Best-seller', 'Local']
  },
  {
    id: 'plat-2',
    name: 'Planche Mixte VIP',
    description: 'Charcuterie artisanale, fromages affinés, fruits secs, olives marinées, pain grillé',
    price: '8 000 F',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600',
    category: 'plats',
    isAvailable: true,
    tags: ['À partager', 'Premium']
  },
  {
    id: 'plat-3',
    name: 'Burger Ouaga',
    description: 'Steak haché 180g, oignons caramélisés, cheddar fondu, sauce maison, frites de patate douce',
    price: '4 500 F',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    category: 'plats',
    isAvailable: true,
    tags: ['Généreux']
  },
  {
    id: 'plat-4',
    name: 'Poisson Grillé du Marché',
    description: 'Poisson du jour grillé au feu de bois, sauce citron-herbes, légumes sautés, attiéké',
    price: '6 000 F',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
    category: 'plats',
    isAvailable: true,
    tags: ['Léger', 'Local']
  },
  {
    id: 'plat-5',
    name: 'Poulet DG',
    description: 'Poulet braisé, plantains mûrs, légumes croquants, sauce tomate épicée',
    price: '5 500 F',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600',
    category: 'plats',
    isAvailable: true,
    tags: ['Épicé', 'Local']
  },
  {
    id: 'plat-6',
    name: 'Salade Sunset',
    description: 'Salade verte, mangue fraîche, avocat, crevettes grillées, vinaigrette passion',
    price: '4 000 F',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    category: 'plats',
    isAvailable: true,
    tags: ['Léger', 'Frais']
  },

  // BOISSONS FRAÎCHES
  {
    id: 'soft-1',
    name: 'Jus de Bissap',
    description: 'Fleur d\'hibiscus infusée, menthe, vanille, servi bien frais',
    price: '1 500 F',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600',
    category: 'softs',
    isAvailable: true,
    tags: ['Local', 'Frais']
  },
  {
    id: 'soft-2',
    name: 'Jus de Gingembre',
    description: 'Gingembre frais pressé, citron, ananas, miel',
    price: '1 500 F',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600',
    category: 'softs',
    isAvailable: true,
    tags: ['Épicé', 'Énergisant']
  },
  {
    id: 'soft-3',
    name: 'Citronnade Maison',
    description: 'Citrons pressés, menthe fraîche, sucre de canne, eau pétillante',
    price: '2 000 F',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600',
    category: 'softs',
    isAvailable: true,
    tags: ['Classique', 'Frais']
  },

  // DESSERTS
  {
    id: 'dessert-1',
    name: 'Tiramisu Mangue',
    description: 'Mascarpone crémeux, mangue fraîche, biscuits imbibés, coulis de fruits rouges',
    price: '3 000 F',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600',
    category: 'desserts',
    isAvailable: true,
    tags: ['Nouveau', 'Fruité']
  },
  {
    id: 'dessert-2',
    name: 'Fondant Chocolat',
    description: 'Chocolat noir 70%, cœur coulant, glace vanille, éclats de noisettes',
    price: '3 500 F',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600',
    category: 'desserts',
    isAvailable: true,
    tags: ['Best-seller', 'Gourmand']
  }
]