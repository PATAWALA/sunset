import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const TestEnv = () => {
  const [status, setStatus] = useState('Test en cours...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (!url || !key) {
          setStatus('❌ Variables manquantes')
          return
        }

        setStatus(`URL: ${url}\nKey: ${key.substring(0, 30)}...`)

        const { error } = await supabase.from('events').select('count', { count: 'exact', head: true })
        
        if (error) {
          setStatus(`❌ Erreur Supabase: ${error.message}`)
        } else {
          setStatus('✅ Connexion Supabase OK !')
        }
      } catch (error: any) {
        setStatus(`❌ Erreur: ${error.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen night-gradient pt-28 p-8">
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Test Environnement</h1>
        <pre className="text-gray-300 whitespace-pre-wrap bg-black/30 p-4 rounded-lg">
          {status}
        </pre>
      </div>
    </div>
  )
}

export default TestEnv