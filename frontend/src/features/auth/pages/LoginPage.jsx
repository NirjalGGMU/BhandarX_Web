import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../services/authService'
import { ROLES } from '../../../utils/constants'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Package, BarChart2, ShieldCheck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [formData, setFormData]   = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return toast.error('Please fill in all fields')
    setIsLoading(true)
    try {
      const res = await authService.login(formData)
      const { user, token } = res.data
      login(user, token)
      toast.success('Welcome back!')
      navigate(user.role === ROLES.ADMIN ? '/admin/products' : '/employee/pos')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Package,    text: 'Real-time inventory tracking' },
    { icon: BarChart2,  text: 'Advanced sales analytics' },
    { icon: ShieldCheck,text: 'Role-based access control' },
  ]

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left — Brand Panel */}
      <div className="relative hidden lg:flex flex-col justify-between px-14 py-12 bg-gray-900 overflow-hidden">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #16a34a 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-600 rounded-full opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">BhandarX</p>
            <p className="text-green-400 text-[11px] mt-0.5">Inventory Management</p>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your inventory<br />
            <span className="text-green-400">smarter &amp; faster.</span>
          </h2>
          <p className="text-gray-400 text-[15px] mb-10 leading-relaxed">
            A complete solution for tracking products, managing stock, and analyzing performance in one place.
          </p>
          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-600/30 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-gray-600 text-[12px]">© 2025 BhandarX. All rights reserved.</p>
      </div>

      {/* Right — Login Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-gray-900">BhandarX</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
            <p className="text-[14px] text-gray-500">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full h-11 pl-9 pr-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-[12px] text-green-600 hover:text-green-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full h-11 pl-9 pr-10 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
