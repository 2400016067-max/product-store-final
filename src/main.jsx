import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. IMPORT INI (Pastikan path/lokasi filenya sesuai dengan tempat kamu menyimpan AuthContext)
import { AuthProvider } from './contexts/AuthContext' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. BUNGKUS APP DENGAN PROVIDER */}
    {/* Sekarang seluruh komponen di dalam App bisa mengakses data User */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)