import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../../../services/authService'
import { ForgotPasswordSchema, ResetPasswordSchema } from '../schema'
import Button from '../../../components/ui/Button'
import { useAuthStore } from '../../../store/authStore'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [step, setStep] = useState('email') // 'email', 'success', 'reset'
  const [devToken, setDevToken] = useState(null)

  // Reset Password State
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(3)

  // Forgot Password Form
  const forgotForm = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  // Reset Password Form
  const resetForm = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  })

  const forgotMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      if (data.devResetLink) {
        // Extract token from link: .../reset-password/TOKEN
        const token = data.devResetLink.split('/').pop()
        setDevToken(token)
        setStep('reset')
        toast.success('Magic link intercepted! Please set your new password.')
      } else {
        setStep('success')
        toast.success('Reset link sent successfully')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong')
    },
  })

  const resetMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      setStep('final-success')
      // Auto-login!
      login(data.user, data.token)
      toast.success('Password reset & logged in successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password.')
    },
  })

  useEffect(() => {
    let timer
    if (step === 'final-success' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000)
    } else if (step === 'final-success' && countdown === 0) {
      navigate('/dashboard')
    }
    return () => clearInterval(timer)
  }, [step, countdown, navigate])

  const onForgotSubmit = (data) => {
    forgotMutation.mutate(data.email)
  }

  const onResetSubmit = (data) => {
    resetMutation.mutate({ token: devToken, ...data })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.div
            key="forgot-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 group transition-colors"
            >
              <ArrowLeft size={16} className="text-green-600 group-hover:-translate-x-1 transition-transform" />
              Back to sign in
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Enter your email and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...forgotForm.register('email')}
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-sm focus:outline-none focus:ring-4 transition-all ${forgotForm.formState.errors.email
                      ? 'border-red-300 focus:ring-red-50'
                      : 'border-gray-200 focus:ring-green-500/10 focus:border-green-600'
                      }`}
                  />
                </div>
                {forgotForm.formState.errors.email && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1 pl-1">
                    <AlertCircle size={12} />
                    {forgotForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={forgotMutation.isPending}
              >
                {forgotMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking account...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {step === 'reset' && (
          <motion.div
            key="reset-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold uppercase tracking-wider mb-4">
                <CheckCircle2 size={12} />
                Magic Link Intercepted
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h2>
              <p className="text-gray-500 leading-relaxed">
                Found your account! Please choose a strong new password below.
              </p>
            </div>

            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...resetForm.register('newPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full h-12 pl-10 pr-12 bg-white border rounded-xl text-sm focus:outline-none focus:ring-4 transition-all ${resetForm.formState.errors.newPassword ? 'border-red-300 focus:ring-red-50' : 'border-gray-200 focus:ring-green-500/10 focus:border-green-600'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-600 mt-1 pl-1">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...resetForm.register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-sm focus:outline-none focus:ring-4 transition-all ${resetForm.formState.errors.confirmPassword ? 'border-red-300 focus:ring-red-50' : 'border-gray-200 focus:ring-green-500/10 focus:border-green-600'
                      }`}
                  />
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1 pl-1">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating security...
                  </>
                ) : (
                  'Reset My Password'
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We've sent a password reset link to your email. Please check your inbox to continue.
            </p>
            <div className="space-y-4">
              <Button variant="outline" className="w-full" onClick={() => setStep('email')}>
                Try a different email
              </Button>
              <Link to="/login" className="block text-sm font-semibold text-green-600 hover:text-green-700">
                Back to sign in
              </Link>
            </div>
          </motion.div>
        )}

        {step === 'final-success' && (
          <motion.div
            key="final-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">All set!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your password has been updated securely. Redirecting to login in {countdown} seconds...
            </p>
            <Link to="/login" className="block w-full">
              <Button className="w-full h-12 flex items-center justify-center gap-2">
                Continue to Dashboard
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ForgotPasswordPage
