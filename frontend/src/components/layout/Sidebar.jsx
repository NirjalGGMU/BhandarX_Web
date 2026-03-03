import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard,
  Package,
  Tag,
  Warehouse,
  ArrowLeftRight,
  Users,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Zap,
  Bell,
  Activity,
  BarChart2
} from 'lucide-react'
import { ROLES, BACKEND_URL } from '../../utils/constants'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuthStore()

  // Sidebar items for each role
  let navGroups = [];
  if (user?.role === ROLES.ADMIN) {
    navGroups = [
      {
        label: 'Overview',
        items: [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Point of Sale', path: '/employee/pos', icon: Zap },
        ]
      },
      {
        label: 'Inventory',
        items: [
          { name: 'Products', path: '/admin/products', icon: Package },
          { name: 'Categories', path: '/admin/categories', icon: Tag },
          { name: 'Suppliers', path: '/admin/suppliers', icon: Truck },
          { name: 'Users', path: '/admin/users', icon: UserCircle },
        ]
      },
      {
        label: 'Analytics',
        items: [
          { name: 'Customers', path: '/customers', icon: Users },
          { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
          { name: 'Stock Adjustments', path: '/inventory/adjust', icon: Activity },
          { name: 'Notifications', path: '/notifications', icon: Bell },
          { name: 'Settings', path: '/settings', icon: Settings },
        ]
      }
    ];
  } else if (user?.role === ROLES.EMPLOYEE) {
    navGroups = [
      {
        label: 'Overview',
        items: [
          { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
          { name: 'Point of Sale', path: '/employee/pos', icon: Zap },
        ]
      },
      {
        label: 'Operations',
        items: [
          { name: 'Stock View', path: '/employee/products', icon: Warehouse },
        ]
      },
      {
        label: 'Analytics',
        items: [
          { name: 'Customers', path: '/customers', icon: Users },
          { name: 'Notifications', path: '/notifications', icon: Bell },
          { name: 'Settings', path: '/settings', icon: Settings },
        ]
      }
    ];
  }

  // No filtering needed; navGroups are already role-specific
  const filteredGroups = navGroups;

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'
  const roleLabel = user?.role === ROLES.ADMIN ? 'Administrator' : 'Employee'

  return (
    <aside
      className={`
        ${collapsed ? 'w-[68px]' : 'w-60'}
        bg-white border-r border-gray-200 flex flex-col shrink-0
        transition-all duration-300 ease-in-out h-screen z-50
      `}
    >
      {/* Brand */}
      <div className={`flex items-center h-16 border-b border-gray-100 shrink-0 ${collapsed ? 'justify-center px-0' : 'px-5 gap-3'}`}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-600 text-white font-bold text-lg shrink-0">
          B
        </div>
        {!collapsed && (
          <div className="leading-none min-w-0">
            <p className="font-bold text-gray-900 text-[15px] tracking-tight truncate">BhandarX</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Inventory System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto no-scrollbar">
        {filteredGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400 px-4 mb-1.5 mt-4 first:mt-2">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5 px-2">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium
                    transition-all duration-150 group
                    ${collapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={18}
                        className={`shrink-0 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3 shrink-0">
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            w-full h-8 flex items-center rounded-lg text-gray-400
            hover:text-green-600 hover:bg-green-50 transition-all mb-3
            ${collapsed ? 'justify-center' : 'justify-between px-3'}
          `}
        >
          {!collapsed && <span className="text-[11.5px] font-medium text-gray-500">Collapse</span>}
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* User info */}
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-1'}`}>
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm overflow-hidden shadow-sm border border-gray-100">
              {user?.profileImage ? (
                <img
                  src={`${BACKEND_URL}/${user.profileImage}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                initial
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-400">{roleLabel}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
