import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logoImg from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, currentUser, role, logout } = useAuth();
  const { totalItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="qd-navbar">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          {/* Logo / Brand */}
          <Link to={role === "ADMIN" ? "/admin" : "/"} className="qd-brand">
            <img src={logoImg} alt="QuickDine Logo" className="qd-logo-img" />
            <span>Quick<strong>Dine</strong></span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarQuickDine"
            aria-controls="navbarQuickDine"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links & Actions */}
          <div className="collapse navbar-collapse" id="navbarQuickDine">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
              {/* Home & Menu are customer-only; hidden for admin */}
              {role !== "ADMIN" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/" className="qd-nav-link" end>
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/menu" className="qd-nav-link">
                      Menu
                    </NavLink>
                  </li>
                </>
              )}
              {isAuthenticated && role !== "ADMIN" && (
                <li className="nav-item">
                  <NavLink to="/orders" className="qd-nav-link">
                    My Orders
                  </NavLink>
                </li>
              )}
              {role === "ADMIN" && (
                <li className="nav-item">
                  <NavLink to="/admin" className="qd-nav-link text-danger fw-bold">
                    <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                  </NavLink>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3">
              {/* Cart Button (hidden for admin) */}
              {role !== "ADMIN" && (
                <Link to="/cart" className="btn btn-outline-dark rounded-pill cart-btn-link px-3 py-2">
                  <i className="bi bi-cart3 fs-5"></i>
                  <span className="ms-1 d-none d-sm-inline fw-semibold">Cart</span>
                  {totalItemCount > 0 && (
                    <span className="cart-count-badge">{totalItemCount}</span>
                  )}
                </Link>
              )}

              {/* Auth Controls */}
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary rounded-pill dropdown-toggle d-flex align-items-center gap-2 px-3 py-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle fs-5 text-danger"></i>
                    <span className="fw-medium">{currentUser?.name || "User"}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                    <li>
                      <Link className="dropdown-item py-2" to="/profile">
                        <i className="bi bi-person me-2 text-primary"></i> My Profile
                      </Link>
                    </li>
                    {role !== "ADMIN" && (
                      <li>
                        <Link className="dropdown-item py-2" to="/orders">
                          <i className="bi bi-bag-check me-2 text-success"></i> My Orders
                        </Link>
                      </li>
                    )}
                    {role === "ADMIN" && (
                      <li>
                        <Link className="dropdown-item py-2" to="/admin">
                          <i className="bi bi-gear me-2 text-danger"></i> Admin Center
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item py-2 text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/login" className="btn btn-outline-qd">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary-qd">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
