import { Routes, Route } from 'react-router-dom'
import {AnimatePresence } from 'framer-motion'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'

// Pages publiques
import HomePage from './pages/public/HomePage'
import EventsPage from './pages/public/EventsPage'
import EventDetailsPage from './pages/public/EventDetailsPage'
import GalleryPage from './pages/public/GalleryPage'
import OurStoryPage from './pages/public/OurStoryPage'

// Pages admin (protégées)
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEvents from './pages/admin/AdminEvents'
import AdminReservations from './pages/admin/AdminReservations'
import AdminGallery from './pages/admin/AdminGallery'

// Pages auth
import AdminLogin from './pages/auth/AdminLogin'

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="our-story" element={<OurStoryPage />} />
        </Route>

        {/* Routes admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="gallery" element={<AdminGallery />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App