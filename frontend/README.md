# BhandarX - Inventory Management System (Frontend)

A modern, responsive, role-based Inventory Management Dashboard built with React, TailwindCSS, and cutting-edge web technologies.

## 🚀 Tech Stack

- **React 19** - Latest React with improved performance
- **Vite 7** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework with @tailwindcss/vite
- **React Router 7** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Data fetching & caching
- **Axios** - HTTP client
- **Recharts** - Beautiful, composable charts
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icon library

## ✨ Features

### Core Features
- ✅ **Authentication System**
  - Login / Register
  - Forgot Password / Reset Password
  - JWT-based authentication
  - Role-based access control (Admin/User)
  
- ✅ **Dashboard**
  - Real-time statistics
  - Revenue & sales charts
  - Category distribution
  - Recent activity feed
  - Low stock alerts

- ✅ **Product Management**
  - Product list (table & grid views)
  - Add/Edit/Delete products
  - Product details with variants
  - Inventory tracking
  - Barcode support

- ✅ **Inventory Management**
  - Stock level monitoring
  - Stock adjustments
  - Low stock alerts
  - Inventory valuation

- ✅ **Transactions**
  - Transaction history
  - Stock IN/OUT tracking
  - Detailed transaction logs

- ✅ **Customer Management**
  - Customer list & details
  - Customer analytics
  - Purchase history

- ✅ **Supplier Management**
  - Supplier list & details
  - Supplier analytics
  - Purchase orders

- ✅ **Reports & Analytics**
  - Dashboard analytics
  - Sales reports
  - Inventory reports
  - Custom date ranges

- ✅ **User Management** (Admin only)
  - User list & management
  - Role assignment
  - User statistics

- ✅ **Notifications**
  - Real-time notifications
  - Notification center
  - Alert system

### UI/UX Features
- ✅ **Dark Mode** - Complete dark mode support
- ✅ **Responsive Design** - Mobile, tablet, and desktop
- ✅ **Smooth Animations** - Framer Motion animations
- ✅ **Modern UI** - Clean, professional design
- ✅ **Role-based Navigation** - Dynamic sidebar
- ✅ **Search Functionality** - Global search
- ✅ **Profile Management** - User profile & settings

## 📁 Project Structure

```
src/
├── app/                    # Application setup
│   └── app.css            # Global styles with TailwindCSS
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   │   └── pages/
│   ├── dashboard/        # Dashboard & analytics
│   │   └── pages/
│   ├── products/         # Product management
│   │   └── pages/
│   ├── inventory/        # Inventory management
│   │   └── pages/
│   ├── transactions/     # Transaction history
│   │   └── pages/
│   ├── customers/        # Customer management
│   │   └── pages/
│   ├── suppliers/        # Supplier management
│   │   └── pages/
│   ├── reports/          # Reports & analytics
│   │   └── pages/
│   ├── users/            # User management (Admin)
│   │   └── pages/
│   └── notifications/    # Notifications center
│       └── pages/
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   │   ├── AuthLayout.jsx
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── ui/               # UI components
│   └── shared/           # Shared components
├── hooks/                # Custom React hooks
├── services/             # API services
│   ├── api.js           # Axios instance & interceptors
│   └── authService.js   # Authentication API
├── routes/               # Route configuration
│   └── AppRoutes.jsx    # Main routing setup
├── store/                # Zustand stores
│   └── authStore.js     # Authentication state
├── utils/                # Utility functions
│   ├── helpers.js       # Helper functions
│   └── constants.js     # Constants & configs
├── App.jsx               # Root component
└── main.jsx             # Application entry point
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Dark Mode**: Gray scale (#1f2937, #111827)

### Typography
- **Font Family**: System fonts (Inter, -apple-system, BlinkMacSystemFont)
- **Headings**: Bold, responsive sizes
- **Body**: Regular weight, optimal line height

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Multiple variants (primary, secondary, danger)
- **Forms**: Clean inputs with focus states
- **Tables**: Striped rows, hover effects
- **Modals**: Centered, backdrop blur

## 🔐 Authentication Flow

1. **Login**: User enters credentials → API validates → JWT token stored in Zustand (persisted to localStorage)
2. **Protected Routes**: Check `isAuthenticated` from Zustand store
3. **API Requests**: Axios interceptor automatically adds JWT Bearer token
4. **Token Expiry**: Interceptor handles 401 errors → redirect to login

## 🗺️ Routing Structure

```
/login              # Login page (public)
/register           # Register page (public)
/forgot-password    # Forgot password (public)
/reset-password     # Reset password (public)

/                   # Protected routes (requires auth)
  ├── /dashboard          # Dashboard
  ├── /products           # Product list
  ├── /products/add       # Add product
  ├── /products/:id       # Product details
  ├── /products/:id/edit  # Edit product
  ├── /inventory          # Inventory overview
  ├── /inventory/adjust   # Stock adjustment
  ├── /transactions       # Transaction list
  ├── /customers          # Customer list
  ├── /customers/:id      # Customer details
  ├── /suppliers          # Supplier list
  ├── /suppliers/:id      # Supplier details
  ├── /reports            # Reports dashboard
  ├── /users              # User management (Admin only)
  └── /notifications      # Notifications center
```

## 🔌 API Integration

The app connects to the backend API via Axios:

- **Base URL**: `http://localhost:5000/api/v1` (configurable via `.env`)
- **Authentication**: JWT Bearer token in `Authorization` header
- **Error Handling**: Centralized error interceptor
- **Auto-retry**: Failed requests retry once

Example API call:
```javascript
import apiClient from '@/services/api'

const { data } = await apiClient.get('/products')
```

## 🌙 Dark Mode

Dark mode is implemented using:
- TailwindCSS `dark:` variants
- Zustand store for state persistence
- `dark` class on `<html>` element

Toggle dark mode:
```javascript
const { toggleDarkMode } = useAuthStore()
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

## 🔧 Configuration Files

- **vite.config.js** - Vite configuration with React plugin & TailwindCSS
- **tailwind.config.js** - TailwindCSS configuration with custom theme
- **postcss.config.js** - PostCSS configuration
- **.env** - Environment variables

## 📝 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use ES6+ features
- Implement proper error handling
- Add loading states for async operations

### Component Structure
```javascript
// imports
import { useState } from 'react'

// component
const ComponentName = () => {
  // state & hooks
  const [state, setState] = useState()

  // handlers
  const handleAction = () => {}

  // render
  return <div>...</div>
}

export default ComponentName
```

### API Calls
- Use React Query for data fetching
- Implement proper error handling
- Show loading states
- Handle edge cases

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Vite cache issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite
```

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Team

Developed by **BhandarX Team**

---

**Happy Coding! 🚀**
