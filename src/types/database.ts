// ============================================
// TYPES POUR LA BASE DE DONNÉES SUPABASE
// ============================================

export type Event = {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string
  end_time: string | null
  cover_image_url: string | null
  is_featured: boolean
  max_capacity: number | null
  created_at: string
}

export type Reservation = {
  id: string
  event_id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  number_of_guests: number
  special_request: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  table_preference: string | null
  created_at: string
}

export type GalleryItem = {
  id: string
  image_url: string
  caption: string | null
  event_id: string | null
  uploaded_at: string
}

export type Admin = {
  id: string
  full_name: string | null
  role: 'admin' | 'manager'
  created_at: string
}

// ============================================
// TYPES POUR LES FORMULAIRES
// ============================================

export type ReservationForm = {
  name: string
  phone: string
  email: string
  guests: number
  preference: string
  request: string
}

export type EventForm = {
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  is_featured: boolean
  max_capacity: number
  cover_image?: File
}