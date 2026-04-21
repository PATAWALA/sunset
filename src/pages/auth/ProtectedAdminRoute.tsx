import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const ProtectedAdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      // Vérifier dans la table admins
      const { data: adminData, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setIsAdmin(!!adminData && !error)
    } catch (error) {
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen night-gradient flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedAdminRoute