import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { BACKEND_URL } from '../../utils/constants'

const Topbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 h-16 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/notifications')}
          className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        <div className="w-px h-6 bg-gray-200" />

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(v => !v)}
            className={`flex items-center gap-2.5 rounded-lg border px-3 h-9 transition-all cursor-pointer ${showProfileMenu
              ? 'border-green-600 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0 overflow-hidden shadow-sm border border-gray-100">
              {user?.profileImage ? (
                <img
                  src={`${BACKEND_URL}/${user.profileImage}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-medium text-gray-900 leading-none truncate max-w-[100px]">
                {user?.name}
              </p>
            </div>
            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg p-1.5 z-50"
              >
                {/* User info */}
                <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-[13px] font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                </div>

                <button
                  onClick={() => { navigate('/profile'); setShowProfileMenu(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <User size={15} className="text-gray-400" />
                  Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setShowProfileMenu(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <Settings size={15} className="text-gray-400" />
                  Settings
                </button>

                <div className="h-px bg-gray-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut size={15} className="text-red-500" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Topbar
