import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll immédiat
    window.scrollTo(0, 0)
    
    // Scroll après un court délai (pour les images qui chargent)
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    
    // Scroll après que tout soit chargé
    const handleLoad = () => {
      window.scrollTo(0, 0)
    }
    
    window.addEventListener('load', handleLoad)
    
    // Observer pour détecter quand le DOM est stable
    const observer = new MutationObserver(() => {
      window.scrollTo(0, 0)
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    })
    
    // Arrêter l'observer après 500ms
    const observerTimeout = setTimeout(() => {
      observer.disconnect()
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(observerTimeout)
      window.removeEventListener('load', handleLoad)
      observer.disconnect()
    }
  }, [pathname])

  return null
}