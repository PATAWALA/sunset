import { supabase } from '../lib/supabase'
import type { Event, GalleryItem } from '../types/database'
import { mockEvents, mockGallery } from '../mocks/data'

// Vérifie si Supabase a des clés (donc configuré)
const isSupabaseConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

// Flag pour forcer l'utilisation des mocks (utile en développement)
const FORCE_MOCK = false // Mettre true si vous voulez ignorer Supabase

export const fetchEvents = async (): Promise<Event[]> => {
  // Si mock forcé OU Supabase non configuré → uniquement mocks
  if (FORCE_MOCK || !isSupabaseConfigured()) {
    console.log('📦 [MOCK] fetchEvents')
    return mockEvents
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) throw error

    const realEvents = (data || []) as Event[]
    
    // FUSION : vrais événements + mocks (en évitant les doublons d'ID)
    const combined = [...realEvents]
    
    for (const mockEvent of mockEvents) {
      // N'ajouter le mock que s'il n'existe pas déjà un événement avec le même ID
      if (!combined.some(e => e.id === mockEvent.id)) {
        combined.push(mockEvent)
      }
    }

    // Trier par date croissante
    combined.sort((a, b) => 
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    )

    console.log(`📊 Événements: ${realEvents.length} réels + ${combined.length - realEvents.length} mocks = ${combined.length} total`)
    return combined
  } catch (error) {
    console.error('❌ Erreur fetchEvents:', error)
    return mockEvents
  }
}


export const fetchUpcomingEvents = async (limit: number = 3): Promise<Event[]> => {
  if (FORCE_MOCK || !isSupabaseConfigured()) {
    const upcoming = mockEvents.filter(e => new Date(e.event_date) >= new Date())
    return upcoming.slice(0, limit)
  }

  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(limit)

    if (error) throw error

    const realEvents = (data || []) as Event[]
    
    // Récupérer aussi les mocks à venir
    const upcomingMocks = mockEvents.filter(e => 
      new Date(e.event_date) >= new Date() &&
      !realEvents.some(re => re.id === e.id) // Éviter les doublons
    )
    
    // Fusionner et trier
    const combined = [...realEvents, ...upcomingMocks]
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, limit)

    return combined
  } catch (error) {
    console.error('❌ Erreur fetchUpcomingEvents:', error)
    const upcoming = mockEvents.filter(e => new Date(e.event_date) >= new Date())
    return upcoming.slice(0, limit)
  }
}

export const fetchFeaturedEvent = async (): Promise<Event | null> => {
  if (FORCE_MOCK || !isSupabaseConfigured()) {
    return mockEvents.find(e => e.is_featured) || mockEvents[0] || null
  }

  try {
    // Chercher d'abord un vrai événement "featured"
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .maybeSingle()

    if (error) throw error

    if (data) {
      return data as Event
    }

    // Sinon, chercher un mock "featured"
    const mockFeatured = mockEvents.find(e => e.is_featured)
    if (mockFeatured) {
      return mockFeatured
    }

    // Sinon, prendre le premier vrai événement à venir
    const { data: firstReal } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (firstReal) {
      return firstReal as Event
    }

    // En dernier recours, le premier mock
    return mockEvents[0] || null
  } catch (error) {
    console.error('❌ Erreur fetchFeaturedEvent:', error)
    return mockEvents.find(e => e.is_featured) || mockEvents[0] || null
  }
}

export const fetchEventById = async (id: string): Promise<Event | null> => {
  if (FORCE_MOCK || !isSupabaseConfigured()) {
    return mockEvents.find(e => e.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (data) return data as Event

    return mockEvents.find(e => e.id === id) || null
  } catch (error) {
    console.error('❌ Erreur fetchEventById:', error)
    return mockEvents.find(e => e.id === id) || null
  }
}

// ========== GALERIE ==========

export const fetchGallery = async (): Promise<GalleryItem[]> => {
  // Si on force les mocks ou Supabase non configuré → uniquement les mocks
  if (FORCE_MOCK || !isSupabaseConfigured()) {
    return mockGallery
  }

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw error

    const realGallery = (data || []) as GalleryItem[]
    
    // Fusionner les vraies données avec les mocks (en évitant les doublons d'ID)
    const combined = [...realGallery]
    
    for (const mockItem of mockGallery) {
      // On n'ajoute le mock que s'il n'existe pas déjà un élément avec le même ID
      if (!combined.some(item => item.id === mockItem.id)) {
        combined.push(mockItem)
      }
    }

    // Trier par date d'upload décroissante (les plus récentes en premier)
    combined.sort((a, b) => 
      new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    )

    return combined
  } catch (error) {
    console.error('❌ Erreur fetchGallery:', error)
    // En cas d'erreur, on retourne les mocks seuls
    return mockGallery
  }
}
// ========== RÉSERVATIONS ==========

export const createReservation = async (
  eventId: string,
  reservation: {
    customer_name: string
    customer_phone: string
    customer_email?: string
    number_of_guests: number
    table_preference?: string
    special_request?: string
  }
): Promise<{ success: boolean; error?: string }> => {
  if (FORCE_MOCK || !isSupabaseConfigured()) {
    console.log('📦 [MOCK] Réservation enregistrée (simulation)')
    return { success: true }
  }

  try {
    const { error } = await supabase
      .from('reservations')
      .insert({
        event_id: eventId,
        ...reservation,
        status: 'pending'
      })

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur createReservation:', error)
    return { success: false, error: error.message }
  }
}