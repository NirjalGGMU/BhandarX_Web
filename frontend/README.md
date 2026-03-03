# BhandarX Frontend

BhandarX Frontend is the client-side dashboard for the BhandarX Inventory Management System. It provides the user interface for authentication, inventory monitoring, product management, suppliers, customers, sales, reports, notifications, and other day-to-day operations.

This project is built as a modern React application for users who need a fast and responsive inventory dashboard connected to the BhandarX backend API.

## What This Project Is Used For

This frontend is used to:

- log users into the inventory system
- manage products, categories, suppliers, and customers
- track stock levels and stock movement
- view dashboard insights and reports
- handle sales and transaction-related workflows
- access role-based pages for admin and employee users

## Main Features

- authentication pages for login, register, forgot password, and reset password
- dashboard with quick stats, charts, low-stock alerts, and recent activity
- product listing, product details, and product form pages
- inventory pages for stock monitoring, ledger, and stock adjustment
- supplier and customer management screens
- sales and POS-related interfaces
- reports and analytics pages
- user settings and user management pages
- notification center
- responsive layout for desktop and smaller screens

## Technologies Used

### Core

- React 19
- Vite 7
- JavaScript

### UI and Routing

- Tailwind CSS 4
- React Router 7
- Framer Motion
- Lucide React
- Recharts

### State, Forms, and Data

- Zustand
- TanStack React Query
- Axios
- React Hook Form
- Zod

## Project Structure

```text
frontend/
├── public/                    # Static assets and CSV templates
├── src/
│   ├── components/            # Reusable UI, layout, and shared components
│   ├── features/              # Feature-based pages and components
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── customers/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── notifications/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── sales/
│   │   ├── suppliers/
│   │   ├── transactions/
│   │   └── users/
│   ├── routes/                # App route definitions
│   ├── services/              # API layer and feature services
│   ├── store/                 # Zustand stores
│   ├── utils/                 # Helpers and constants
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Main Screens and Modules

- `auth` for login and password flows
- `dashboard` for overview metrics and activity
- `products` for product CRUD interfaces
- `inventory` for stock ledger and stock adjustments
- `customers` for customer listing and details
- `suppliers` for supplier listing and forms
- `sales` for POS and invoice-related UI
- `transactions` for transaction history
- `reports` for analytics pages
- `notifications` for notification management
- `users` for settings and user administration

## API Integration

The frontend connects to the backend through Axios-based service modules.

Default local API URL:

```text
http://localhost:5001/api/v1
```

Environment variable:

```env
VITE_API_URL=http://localhost:5001/api/v1
```

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 3. Run the app

```bash
npm run dev
```

Default local frontend URL:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
```

## Design and UX

The frontend is designed as a dashboard-style application with:

- responsive layout and sidebar navigation
- role-aware pages and protected routes
- cards, charts, tables, forms, and modal components
- support for animated interactions using Framer Motion

## Summary

BhandarX Frontend is the presentation layer of the inventory system. It is built with React and Vite, organized by features, and designed to work with the BhandarX backend API for complete inventory and business workflow management.
