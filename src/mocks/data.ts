import type { Event, GalleryItem } from '../types/database'

// ============================================
// ÉVÉNEMENTS MOCK
// ============================================

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Soirée Live - Abou Diarra',
    description: 'Une soirée exceptionnelle avec le maître du Kamale N\'Goni. Venez vibrer au son du blues mandingue dans une ambiance unique au cœur de Ouagadougou.',
    event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '20:00:00',
    end_time: '02:00:00',
    cover_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
    is_featured: true,
    max_capacity: 150,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Ladies Night - Cocktails & Dance',
    description: 'Soirée 100% féminine ! Cocktails offerts pour les filles jusqu\'à 22h. DJ Set by Lady K. Tenue chic exigée.',
    event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '19:00:00',
    end_time: '01:00:00',
    cover_image_url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=1200',
    is_featured: false,
    max_capacity: 200,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Samedi Groove - Spécial Années 2000',
    description: 'Revivez les plus grands hits des années 2000 ! RnB, Hip-Hop et Dancefloor avec DJ Mike. Une nuit de nostalgie garantie.',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '21:00:00',
    end_time: '03:00:00',
    cover_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
    is_featured: false,
    max_capacity: 180,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Brunch Jazz du Dimanche',
    description: 'Un brunch raffiné accompagné de jazz live. Buffet à volonté, mimosas et ambiance feutrée. Le rendez-vous dominical incontournable.',
    event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '11:00:00',
    end_time: '15:00:00',
    cover_image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
    is_featured: false,
    max_capacity: 100,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Soirée Afrobeat - Spécial Fally Ipupa',
    description: 'La plus grande soirée Afrobeat de Ouaga ! Sonorisation premium, light show et ambiance de folie.',
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '22:00:00',
    end_time: '04:00:00',
    cover_image_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200',
    is_featured: false,
    max_capacity: 250,
    created_at: new Date().toISOString()
  }
]

// ============================================
// GALERIE MOCK
// ============================================

export const mockGallery: GalleryItem[] = [
  {
    id: 'g1',
    image_url: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600',
    caption: 'Ambiance Sunset - Soirée Live',
    event_id: '1',
    uploaded_at: new Date().toISOString()
  },
  {
    id: 'g2',
    image_url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=600',
    caption: 'Ladies Night - Cocktails signatures',
    event_id: '2',
    uploaded_at: new Date().toISOString()
  },
  {
    id: 'g3',
    image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600',
    caption: 'Notre terrasse au coucher du soleil',
    event_id: null,
    uploaded_at: new Date().toISOString()
  },
  {
    id: 'g4',
    image_url: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=600',
    caption: 'Cuisine signature - Plats raffinés',
    event_id: null,
    uploaded_at: new Date().toISOString()
  },
  {
    id: 'g5',
    image_url: 'https://images.unsplash.com/photo-1575444758708-4f13a3f48c1d?w=600',
    caption: 'DJ Set - Ambiance dancefloor',
    event_id: '3',
    uploaded_at: new Date().toISOString()
  },
  {
    id: 'g6',
    image_url: 'https://images.unsplash.com/photo-1519671482749-fd09f7ddce7f?w=600',
    caption: 'Soirée VIP - Service premium',
    event_id: null,
    uploaded_at: new Date().toISOString()
  }
]

// ============================================
// STATISTIQUES MOCK POUR DASHBOARD
// ============================================

export const mockStats = {
  todayReservations: 12,
  activeEvents: 8,
  occupancyRate: 85,
  nextEventIn: '2h'
}