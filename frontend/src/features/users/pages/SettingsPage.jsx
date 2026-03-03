import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  User, Lock, Bell, Shield, Mail, Phone, Building2,
  Save, Eye, EyeOff, CheckCircle2
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useAuthStore } from '../../../store/authStore'
import { ROLES, BACKEND_URL } from '../../../utils/constants'
import { userService } from '../../../services/userService'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: user?.notificationPreferences?.email ?? true,
    sms: user?.notificationPreferences?.sms ?? false,
    lowStock: user?.notificationPreferences?.lowStock ?? true,
    orders: user?.notificationPreferences?.orders ?? true,
  })

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => userService.updateProfile(user._id, data),
    onSuccess: (response) => {
      updateUser(response.data)
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  // Upload Image Mutation
  const uploadImageMutation = useMutation({
    mutationFn: (formData) => userService.uploadProfileImage(formData),
    onSuccess: (response) => {
      updateUser(response.data)
      toast.success('Profile image updated!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload image')
    }
  })

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB')
        return
      }
      const formData = new FormData()
      formData.append('profileImage', file)
      uploadImageMutation.mutate(formData)
    }
  }

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => userService.changePassword(user._id, data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  })

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
  }

  const handlePreferencesSubmit = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate({
      notificationPreferences: notificationSettings
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6" hover={false}>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg overflow-hidden">
                {user?.profileImage ? (
                  <img
                    src={`${BACKEND_URL}/${user.profileImage}`}
                    alt={user.name}
                    className="w-full h-full object-cover text-center"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                title="Change Image"
              >
                <Eye className="w-4 h-4 text-green-600" />
                <input
                  id="profile-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadImageMutation.isPending}
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 font-medium">{user?.email}</p>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user?.role === 'admin'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
                  }`}>
                  <Shield className="w-3 h-3" />
                  {user?.role?.toUpperCase()}
                </span>
                {uploadImageMutation.isPending && (
                  <span className="text-xs text-green-600 font-medium animate-pulse">Uploading...</span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                icon={User}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="john@example.com"
              />

              <Input
                label="Phone Number"
                icon={Phone}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />

              <Input
                label="Company/Store"
                icon={Building2}
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                placeholder="Store location"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="submit"
                variant="primary"
                loading={updateProfileMutation.isPending}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6" hover={false}>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Change Password
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your password to keep your account secure
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
            <div className="relative">
              <Input
                label="Current Password"
                type={showOldPassword ? 'text' : 'password'}
                icon={Lock}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                icon={Lock}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="submit"
                variant="primary"
                loading={changePasswordMutation.isPending}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                <Lock className="w-4 h-4" />
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-6" hover={false}>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-green-600" />
              Notification Preferences
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose how you want to receive notifications
            </p>
          </div>

          <form onSubmit={handlePreferencesSubmit} className="space-y-4 max-w-2xl">
            {[
              {
                id: 'email',
                label: 'Email Notifications',
                description: 'Receive important updates via email'
              },
              {
                id: 'sms',
                label: 'SMS Notifications',
                description: 'Get instant alerts via text message'
              },
              {
                id: 'lowStock',
                label: 'Low Stock Alerts',
                description: 'Be notified when products are running low'
              },
              {
                id: 'orders',
                label: 'Order Notifications',
                description: 'Receive updates about new orders'
              },
            ].map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-200 hover:bg-green-50/20 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.id]}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [setting.id]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
              <Button
                type="submit"
                variant="primary"
                loading={updateProfileMutation.isPending}
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

export default SettingsPage
