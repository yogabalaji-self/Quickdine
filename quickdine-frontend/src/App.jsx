import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Customer Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrder";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageFoods from "./pages/admin/ManageFoods";
import AddFood from "./pages/admin/AddFood";
import EditFood from "./pages/admin/EditFood";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageTables from "./pages/admin/ManageTables";
import ManageUsers from "./pages/admin/ManageUsers";

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();
  const isAdmin = role === "ADMIN";

  // Where a logged-in user lands: admin -> dashboard, customer -> home
  const landingPath = isAdmin ? "/admin" : "/home";

  // Hide Navbar and Footer on Login and Signup pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation Header: Hidden on Login and Signup */}
      {!isAuthPage && <Navbar />}

      {/* Main Application Routes */}
      <main className="main-content flex-grow-1">
        <Routes>
          {/* First open the web page with must go with login and signup page, then redirect to home page */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                isAdmin ? <Navigate to="/admin" replace /> : <Home />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/home"
            element={
              isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to={landingPath} replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to={landingPath} replace /> : <Register />
            }
          />

          {/* Customer Routes */}
          <Route
            path="/menu"
            element={
              isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              )
            }
          />
          <Route
            path="/food/:id"
            element={
              <ProtectedRoute>
                <FoodDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Customer Authenticated / Tracking Routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Management Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/foods"
            element={
              <AdminRoute>
                <ManageFoods />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/foods/add"
            element={
              <AdminRoute>
                <AddFood />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/foods/edit/:id"
            element={
              <AdminRoute>
                <EditFood />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <ManageOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <AdminRoute>
                <ManageTables />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Application Footer: Hidden on Login and Signup */}
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
