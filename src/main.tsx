import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-center"
        richColors
        expand={true}
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B3E 100%)',
            color: '#FFF',
            border: '1px solid #F5A623',
            borderRadius: '12px',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)