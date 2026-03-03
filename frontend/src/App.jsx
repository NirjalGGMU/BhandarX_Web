import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
    document.documentElement.classList.remove('dark')
  }, [initAuth])

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Toaster position="top-center" />
      <AppRoutes />
    </div>
  )
}

export default App
