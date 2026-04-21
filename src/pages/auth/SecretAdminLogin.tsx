import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Sunrise } from 'lucide-react'
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

      if (error) throw error

      // Vérifier si l'utilisateur est bien un admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (adminError || !adminData) {
        await supabase.auth.signOut()
        throw new Error('Accès non autorisé')
      }

      toast.success('Bienvenue dans l\'espace privé 🌅')
      navigate('/admin/dashboard')
    } catch (error: any) {
      toast.error('Accès refusé')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen night-gradient flex items-center justify-center p-4">
      {/* Effet de confidentialité */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D9385E]/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 rounded-full sunset-gradient flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <Sunrise size={36} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-white mb-1">
              Accès Privé
            </h2>
            <p className="text-gray-400 text-sm">
              Sunset Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Mail size={14} className="text-[#F5A623]" />
                Identifiant
              </label>
              <Input
                type="email"
                placeholder="admin@sunset.bf"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-xl py-6"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Lock size={14} className="text-[#F5A623]" />
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-gray-500 rounded-xl py-6 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sunset-gradient text-white py-6 rounded-xl font-bold text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Vérification...
                </>
              ) : (
                'Accéder à l\'espace privé'
              )}
            </Button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            Accès réservé au personnel autorisé
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default SecretAdminLogin