import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'

// Pages publiques
import HomePage from './pages/public/HomePage'
import EventsPage from './pages/public/EventsPage'
import EventDetailsPage from './pages/public/EventDetailsPage'
import GalleryPage from './pages/public/GalleryPage'
import OurStoryPage from './pages/public/OurStoryPage'


// Page de connexion secrète
import SecretAdminLogin from './pages/auth/SecretAdminLogin'

// Pages admin (protégées)
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEvents from './pages/admin/AdminEvents'
import AdminReservations from './pages/admin/AdminReservations'
import AdminGallery from './pages/admin/AdminGallery'

// Composant de protection des routes admin
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute'

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

        {/* URL SECRÈTE pour la connexion admin */}
        <Route path="/portal" element={<SecretAdminLogin />} />

        {/* Routes admin PROTÉGÉES */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App