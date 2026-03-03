import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../../../services/notificationService'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2,
  CheckCheck,
  Package,
  ShoppingCart,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { Link } from 'react-router-dom'

const NotificationsPage = () => {
  const queryClient = useQueryClient()

  const { data: response, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getUserNotifications()
  })

  const notifications = response?.data?.notifications || []
  const unreadCount = response?.data?.unreadCount || 0

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
    }
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('All notifications marked as read')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Notification deleted')
    }
  })

  const getIcon = (type) => {
    switch (type) {
      case 'LOW_STOCK':
        return <Package className="w-5 h-5 text-amber-500" />
      case 'SALE_COMPLETED':
        return <ShoppingCart className="w-5 h-5 text-green-500" />
      case 'PURCHASE_RECEIVED':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'ROLE_CHANGED':
        return <ShieldCheck className="w-5 h-5 text-purple-500" />
      case 'ALERT':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-100'
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-green-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with system alerts and inventory changes
          </p>
        </div>
        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            loading={markAllReadMutation.isPending}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white h-24 rounded-xl border border-gray-200 animate-pulse" />
          ))
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center" hover={false}>
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-semibold text-lg">No notifications yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              When something important happens, it'll show up here.
            </p>
          </Card>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`
                group relative bg-white rounded-xl border p-4 transition-all
                ${notif.isRead ? 'border-gray-100' : 'border-green-100 bg-green-50/20 shadow-sm'}
                hover:border-green-200 hover:shadow-md
              `}
            >
              <div className="flex gap-4">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                  ${notif.isRead ? 'bg-gray-50' : 'bg-green-100/50'}
                `}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 pr-12">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-bold ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notif.title}
                    </h4>
                    {notif.priority !== 'LOW' && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border ${getPriorityColor(notif.priority)}`}>
                        {notif.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>

                    {notif.actionUrl && (
                      <Link
                        to={notif.actionUrl}
                        className="flex items-center gap-1 text-[11px] font-bold text-green-600 hover:text-green-700"
                        onClick={() => !notif.isRead && markReadMutation.mutate(notif._id)}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Details
                      </Link>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(notif._id)}
                      className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(notif._id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!notif.isRead && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r-full" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
