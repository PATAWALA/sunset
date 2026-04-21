import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Event, Reservation } from '../types/database'
import { mockEvents } from '../mocks/data'

// ============================================
// HELPERS POUR LES ÉVÉNEMENTS
// ============================================

export const fetchEvents = async (): Promise<Event[]> => {
  // Si Supabase n'est pas configuré, retourner les mocks
  if (!isSupabaseConfigured()) {
    console.log('📦 [MOCK] Fetching events...')
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

export const fetchUpcomingEvents = async (limit: number = 3): Promise<Event[]> => {
  if (!isSupabaseConfigured()) {
    console.log('📦 [MOCK] Fetching upcoming events...')
    return mockEvents
      .filter(e => new Date(e.event_date) >= new Date())
      .slice(0, limit)
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

export const fetchFeaturedEvent = async (): Promise<Event | null> => {
  if (!isSupabaseConfigured()) {
    console.log('📦 [MOCK] Fetching featured event...')
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

export const fetchEventById = async (id: string): Promise<Event | null> => {
  if (!isSupabaseConfigured()) {
    console.log(`📦 [MOCK] Fetching event ${id}...`)
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

// ============================================
// HELPERS POUR LES RÉSERVATIONS
// ============================================

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
    console.log('📦 [MOCK] Creating reservation...', reservation)
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

export const fetchReservations = async (eventId?: string): Promise<Reservation[]> => {
  if (!isSupabaseConfigured()) {
    console.log('📦 [MOCK] Fetching reservations...')
    return []
  }

  try {
    let query = supabase.from('reservations').select('*')
    
    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data as Reservation[]
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return []
  }
}

// ============================================
// HELPERS POUR LA GALERIE
// ============================================

export const fetchGallery = async (): Promise<any[]> => {
  const { mockGallery } = await import('../mocks/data')
  
  if (!isSupabaseConfigured()) {
    console.log('📦 [MOCK] Fetching gallery...')
    return mockGallery
  }

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return mockGallery
  }
}