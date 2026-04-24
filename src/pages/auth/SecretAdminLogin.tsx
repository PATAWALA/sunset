import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, UtensilsCrossed } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

const SecretAdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erreur login:', error.message)
        toast.error('Email ou mot de passe incorrect')
        setIsLoading(false)
        return
      }

      console.log('Utilisateur connecté:', data.user)

      // Vérifier si admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .single()

      console.log('Admin data:', adminData)
      console.log('Admin error:', adminError)

      if (adminError || !adminData) {
        console.error('Pas admin:', adminError)
        await supabase.auth.signOut()
        toast.error("Accès refusé - Vous n'êtes pas administrateur")
        setIsLoading(false)
        return
      }

      toast.success('Bienvenue ✨')
      navigate('/admin/dashboard')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error('Erreur: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      {/* Effet de confidentialité */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terracotta-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white border border-cream-200 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-sage-500 to-terracotta-500 flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <UtensilsCrossed size={36} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-sage-800 mb-1">
              Accès Privé
            </h2>
            <p className="text-gray-500 text-sm">
              L'Imprévu Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <Mail size={14} className="text-sage-600" />
                Identifiant
              </label>
              <Input
                type="email"
                placeholder="admin@limprevu.bj"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-cream-50 border-sage-200 text-sage-800 placeholder:text-sage-400 rounded-xl py-6 focus:border-sage-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <Lock size={14} className="text-sage-600" />
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-cream-50 border-sage-200 text-sage-800 placeholder:text-sage-400 rounded-xl py-6 pr-12 focus:border-sage-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-sage-600 to-terracotta-500 hover:from-sage-700 hover:to-terracotta-600 text-white py-6 rounded-xl font-bold text-base shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Vérification...
                </>
              ) : (
                "Accéder à l'espace privé"
              )}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            Accès réservé au personnel autorisé
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default SecretAdminLogin