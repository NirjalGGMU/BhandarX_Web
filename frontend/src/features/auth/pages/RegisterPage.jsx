import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../../../services/authService'
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck,
  Loader2, User, Briefcase, CheckCircle2
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../../components/ui/Button'
import { ROLES } from '../../../utils/constants'

const RegisterPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.EMPLOYEE,
  })
  const [showPassword, setShowPassword] = useState(false)

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Account created successfully. Please sign in.')
      navigate('/login')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    const { confirmPassword, ...registerData } = formData
    registerMutation.mutate(registerData)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden">
      {/* Left Pane */}
      <div className="relative hidden lg:flex flex-col justify-center px-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle, #16a34a 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BhandarX</h1>
              <p className="text-green-400 text-xs mt-0.5">Inventory Management</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Join your team<br />on BhandarX.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Create your account to start managing inventory, tracking orders, and collaborating with your team.
          </p>
          <div className="mt-10 space-y-3">
            {['Real-time inventory tracking', 'Automated low stock alerts', 'Sales & purchase analytics'].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <span className="text-gray-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h3>
            <p className="text-gray-500 text-sm">Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-gray-600">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-gray-600">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full h-11 pl-10 pr-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: ROLES.EMPLOYEE, label: 'Employee', desc: 'Standard access', icon: Briefcase },
                  { id: ROLES.ADMIN, label: 'Administrator', desc: 'Full access', icon: ShieldCheck }
                ].map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border-2 transition-all text-left ${
                      formData.role === role.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      formData.role === role.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <role.icon size={15} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${
                        formData.role === role.id ? 'text-green-700' : 'text-gray-700'
                      }`}>{role.label}</p>
                      <p className="text-xs text-gray-400">{role.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {registerMutation.isPending ? (
                  <><Loader2 size={17} className="animate-spin" /> Creating account...</>
                ) : (
                  <>Create account <ArrowRight size={17} /></>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
