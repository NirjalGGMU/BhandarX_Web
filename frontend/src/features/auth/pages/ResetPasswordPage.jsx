import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../../../services/authService'
import { ResetPasswordSchema } from '../schema'
import Button from '../../../components/ui/Button'

const ResetPasswordPage = () => {
  const { token: pathToken } = useParams()
  const [searchParams] = useSearchParams()
  const token = pathToken || searchParams.get('token')

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3) // Adjusted to 3s as per report

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  })

  const mutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      setIsSuccess(true)
      toast.success('Password reset successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may be expired.')
    },
  })

  useEffect(() => {
    let timer
    if (isSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isSuccess && countdown === 0) {
      navigate('/login')
    }
    return () => clearInterval(timer)
  }, [isSuccess, countdown, navigate])

  const onSubmit = (data) => {
    mutation.mutate({ token, ...data })
  }

  if (!token) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h2>
        <p className="text-gray-600 mb-8">This reset link is invalid or has expired.</p>
        <Link to="/forgot-password">
          <Button className="w-full">Request new link</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="reset-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">New Password</h2>
              <p className="text-gray-500">
                Please enter a new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('newPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full h-12 pl-10 pr-12 bg-white border rounded-xl text-sm focus:outline-none focus:ring-4 transition-all ${errors.newPassword
                      ? 'border-red-300 focus:ring-red-50'
                      : 'border-gray-200 focus:ring-green-500/10 focus:border-green-600'
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
                {errors.newPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-sm focus:outline-none focus:ring-4 transition-all ${errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-50'
                      : 'border-gray-200 focus:ring-green-500/10 focus:border-green-600'
                      }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="reset-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">All set!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your password has been reset successfully. You will be redirected to the sign in page in {countdown} seconds.
            </p>
            <Link to="/login" className="block w-full">
              <Button className="w-full h-12 flex items-center justify-center gap-2">
                Go to Sign In
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResetPasswordPage
