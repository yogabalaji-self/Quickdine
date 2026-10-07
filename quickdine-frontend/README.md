# QuickDine – Restaurant Order Management System (Frontend)

A modern, responsive, beginner-friendly React.js web application for restaurant food ordering and table management. It connects to the Spring Boot REST backend running on **`http://localhost:8082`**.

---

## 🌟 Project Overview

**QuickDine** is designed for modern restaurant dining and online delivery:
- **Customers can:**
  - Register and sign in with immediate validation.
  - Browse food menus with categories (Starters, Main Course, Desserts, Beverages) and dietary filters (Veg / Non-Veg).
  - Search dishes by keyword.
  - View detailed dish views with preparation info and reviews.
  - Add items to an interactive cart with live quantity management.
  - Choose between **Doorstep Delivery** and **Dine-in at Restaurant Table**.
  - Track live order progress through a 5-step status timeline (`PLACED` &rarr; `CONFIRMED` &rarr; `PREPARING` &rarr; `READY` &rarr; `COMPLETED`).
- **Admins can:**
  - Access a dedicated Operations Dashboard with real-time business metrics (Total Users, Foods, Orders, Revenue).
  - Manage menu items (Add new dishes, Edit prices/availability, Delete items).
  - Manage live kitchen orders and update status in real time.
  - Manage restaurant floor tables (Capacity, status: `AVAILABLE`, `OCCUPIED`, `RESERVED`).
  - View and manage registered users directly in MySQL via the Spring Boot `/api/users` endpoint.

---

## 🛠️ Technology Stack

- **Frontend Library:** React.js (Functional components & Hooks: `useState`, `useEffect`, `useContext`)
- **Build Tool:** Vite
- **Language:** JavaScript (ES6+) — *No TypeScript*
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios
- **CSS Framework:** Bootstrap 5 & Bootstrap Icons
- **State Management:** React Context API (`AuthContext`, `CartContext`)

---

## 🌐 Architecture & Backend Connection

```
┌─────────────────────────┐
│     QuickDine React     │
│  http://localhost:5173  │
└────────────┬────────────┘
             │  Axios Central Client
             ↓  (src/services/api.js)
┌─────────────────────────┐
│   Spring Boot Backend   │
│  http://localhost:8082  │
└────────────┬────────────┘
             │  Spring Data JPA
             ↓
┌─────────────────────────┐
│      MySQL Database     │
│   localhost:3306/quickdine
└─────────────────────────┘
```

> **Backend URL:** All requests route through the centralized Axios client at `http://localhost:8082`.

---

## 🚀 Installation & Running

### 1. Prerequisites
- Node.js (v18+)
- Spring Boot backend running on `http://localhost:8082`
- MySQL running on `localhost:3306` with database `quickdine`

### 2. Frontend Setup
From the `quickdine-frontend` directory:

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server (Port 5173)
npm run dev
```

Open your browser at:
```
http://localhost:5173
```

---

## 📁 Folder Structure

```
quickdine-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── components/
    │   ├── Navbar.jsx          # Responsive navbar with cart badge & role dropdown
    │   ├── Footer.jsx          # Restaurant branding, links, opening hours
    │   ├── FoodCard.jsx        # Dish card with veg indicator, price & Add to Cart
    │   ├── Loading.jsx         # Loading spinner
    │   ├── ErrorMessage.jsx    # User-friendly error alert with retry
    │   ├── ProtectedRoute.jsx  # Route guard for logged-in customers
    │   ├── AdminRoute.jsx      # Route guard for admins
    │   ├── OrderCard.jsx       # Order summary card with status badges
    │   └── CartItem.jsx        # Cart row with quantity controls
    │
    ├── pages/
    │   ├── Home.jsx            # Hero, Popular foods, Features, CTA banner
    │   ├── Login.jsx           # Sign in with quick-fill demo credentials
    │   ├── Register.jsx        # Connected to Spring Boot POST /api/users
    │   ├── Menu.jsx            # Food search, category pills & grid
    │   ├── FoodDetails.jsx     # Full dish info, quantity & direct buy
    │   ├── Cart.jsx            # Cart item list & tax calculation
    │   ├── Checkout.jsx        # Delivery address / Dine-in table & Place Order
    │   ├── MyOrders.jsx        # Order history
    │   ├── TrackOrder.jsx      # Visual 5-step preparation timeline
    │   ├── Profile.jsx         # User account summary
    │   │
    │   └── admin/
    │       ├── AdminDashboard.jsx  # Metrics, revenue, and recent orders
    │       ├── ManageFoods.jsx     # Food table with edit/delete
    │       ├── AddFood.jsx         # Add new dish form
    │       ├── EditFood.jsx        # Edit dish form
    │       ├── ManageOrders.jsx    # Kitchen order status controller
    │       ├── ManageTables.jsx    # Seating capacity & table status
    │       └── ManageUsers.jsx     # MySQL user list via GET /api/users
    │
    ├── services/
    │   ├── api.js              # Central Axios instance (http://localhost:8082)
    │   ├── userService.js      # CRUD methods for /api/users
    │   ├── foodService.js      # Mock catalogue + hooks for /api/foods
    │   ├── cartService.js      # Local persistence & sync hooks
    │   ├── orderService.js     # Order placement & status updates
    │   └── tableService.js     # Table floor management
    │
    ├── context/
    │   ├── AuthContext.jsx     # Authentication, roles, token handling
    │   └── CartContext.jsx     # Global cart state, totals, taxes
    │
    ├── css/
    │   ├── global.css          # Color palette, buttons, badges
    │   ├── navbar.css          # Sticky header styling
    │   ├── home.css            # Hero and feature banners
    │   ├── menu.css            # Food cards and category pills
    │   ├── auth.css            # Login/Register layout
    │   └── admin.css           # Admin metrics and tables
    │
    ├── App.jsx                 # Routing configuration
    └── main.jsx                # Bootstrap 5 & root mounting
```

---

## 📡 API Endpoints (Spring Boot: `http://localhost:8082`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users` | Register a new user |
| `GET` | `/api/users` | Retrieve all users from MySQL |
| `GET` | `/api/users/{id}` | Retrieve single user by ID |
| `PUT` | `/api/users/{id}` | Update existing user details |
| `DELETE` | `/api/users/{id}` | Remove user by ID |
| `POST` | `/api/auth/login` | *(Planned)* JWT Authentication |
| `GET` | `/api/foods` | *(Planned)* Get food menu catalogue |
| `POST` | `/api/orders` | *(Planned)* Place and persist customer order |
| `GET` | `/api/tables` | *(Planned)* Restaurant table management |

---

## 🔑 Demo Accounts for Quick Testing

- **Admin Account:**
  - Email: `admin@quickdine.com`
  - Password: `admin123`
  - *Redirects to `/admin` Operations Center*
- **Customer Account:**
  - Email: `yoga@gmail.com`
  - Password: `12345`
  - *Redirects to `/menu`*
