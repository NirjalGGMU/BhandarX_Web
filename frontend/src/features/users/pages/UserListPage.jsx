import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../../../services/userService'
import {
  UserPlus, Search, Edit2, Trash2,
  UserCheck, UserX, Shield, Clock, Mail, Filter, AlertCircle, RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { ROLES, BACKEND_URL } from '../../../utils/constants'

const UserListPage = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', { search: searchTerm, role: roleFilter === 'all' ? undefined : roleFilter }],
    queryFn: () => userService.getAllUsers({
      search: searchTerm,
      role: roleFilter === 'all' ? undefined : roleFilter
    }),
  })

  const toggleStatusMutation = useMutation({
    mutationFn: (id) => userService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('User status updated')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  })

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case ROLES.ADMIN:
        return 'bg-green-50 text-green-700 border-green-200'
      case ROLES.EMPLOYEE:
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (error) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user accounts, roles, and permissions.</p>
        </div>
        <div className="error-state-card">
          <div className="error-icon">
            <AlertCircle className="w-7 h-7" strokeWidth={2} />
          </div>
          <p className="error-message">Could not load users</p>
          <p className="error-detail">{error.message}</p>
          <Button variant="primary" size="sm" onClick={() => queryClient.invalidateQueries(['users'])}>
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Button variant="primary" size="sm" className="shadow-sm">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 shadow-sm" hover={false}>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-green-600" />
            <input
              type="text"
              className="w-full h-10 pl-10 pr-4 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-400"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-green-600 pointer-events-none" />
            <select
              className="h-10 pl-10 pr-8 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value={ROLES.ADMIN}>Administrators</option>
              <option value={ROLES.EMPLOYEE}>Employees</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden rounded-xl shadow-sm" hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full table-premium">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-24 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-8 w-24 bg-gray-100 rounded ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <p className="text-sm font-medium text-gray-500">No users found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                data?.data?.map((user) => (
                  <tr key={user._id}>
                    <td className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-sm border border-gray-100">
                          {user.profileImage ? (
                            <img
                              src={`${BACKEND_URL}/${user.profileImage}`}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-green-600" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getRoleBadgeColor(user.role)}`}>
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {user.isActive ? 'Active' : 'Locked'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleStatusMutation.mutate(user._id)}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 rounded-md transition-colors ${user.isActive ? 'text-gray-500 hover:bg-gray-50' : 'text-emerald-500 hover:bg-emerald-50'
                            }`}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default UserListPage
