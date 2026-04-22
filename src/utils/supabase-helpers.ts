import { supabase } from '../lib/supabase'
import type { Event } from '../types/database'
import { mockGallery } from '../mocks/data'
import type { GalleryItem } from '../types/database'
// CORRECTION : Importer depuis le bon chemin
import { mockEvents } from '../mocks/data'

// Vérifier si Supabase est configuré
const isSupabaseConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

// Fetch all events
export const fetchEvents = async (): Promise<Event[]> => {
  if (!isSupabaseConfigured()) {
    console.log('📦 Using mock data')
    return mockEvents
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) throw error
    return data as Event[]
  } catch (error) {
    console.error('Error fetching events:', error)
    return mockEvents
  }
}

// Fetch upcoming events
export const fetchUpcomingEvents = async (limit: number = 3): Promise<Event[]> => {
  if (!isSupabaseConfigured()) {
    return mockEvents.slice(0, limit)
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data as Event[]
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    return mockEvents.slice(0, limit)
  }
}

// Fetch featured event
export const fetchFeaturedEvent = async (): Promise<Event | null> => {
  if (!isSupabaseConfigured()) {
    return mockEvents.find(e => e.is_featured) || mockEvents[0]
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .single()

    if (error) throw error
    return data as Event
  } catch (error) {
    console.error('Error fetching featured event:', error)
    return mockEvents.find(e => e.is_featured) || mockEvents[0]
  }
}

// Fetch event by ID
export const fetchEventById = async (id: string): Promise<Event | null> => {
  if (!isSupabaseConfigured()) {
    return mockEvents.find(e => e.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Event
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error)
    return mockEvents.find(e => e.id === id) || null
  }
}

// Create reservation
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
  if (!isSupabaseConfigured()) {
    console.log('📦 Mock reservation:', reservation)
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
    console.error('Error creating reservation:', error)
    return { success: false, error: error.message }
  }
}

// Fetch gallery
export const fetchGallery = async (): Promise<GalleryItem[]> => {
  if (!isSupabaseConfigured()) {
    console.log('📦 Using mock gallery')
    return mockGallery
  }

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data as GalleryItem[]
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return mockGallery
  }
}