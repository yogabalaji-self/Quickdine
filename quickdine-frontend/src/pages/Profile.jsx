import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: "600px" }}>
          <div className="text-center mb-4 pb-3 border-bottom">
            <div
              className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
              style={{ width: "80px", height: "80px", fontSize: "2.5rem" }}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3 className="fw-bold mb-1">{currentUser?.name || "QuickDine Customer"}</h3>
            <p className="text-muted small mb-2">{currentUser?.email || "customer@example.com"}</p>
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 rounded-pill fw-bold">
              {role || "CUSTOMER"}
            </span>
          </div>

          <div className="mb-4">
            <h6 className="text-uppercase fw-bold text-muted small mb-3">Quick Navigation</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/orders" className="btn btn-outline-secondary d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-start">
                <span><i className="bi bi-receipt me-2 text-danger"></i> View My Past Orders</span>
                <i className="bi bi-chevron-right small text-muted"></i>
              </Link>
              <Link to="/menu" className="btn btn-outline-secondary d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-start">
                <span><i className="bi bi-egg-fried me-2 text-warning"></i> Order Food from Menu</span>
                <i className="bi bi-chevron-right small text-muted"></i>
              </Link>
              {role === "ADMIN" && (
                <Link to="/admin" className="btn btn-outline-danger d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-start">
                  <span><i className="bi bi-shield-lock me-2"></i> Go to Admin Dashboard</span>
                  <i className="bi bi-chevron-right small"></i>
                </Link>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 py-2 rounded-pill fw-bold"
          >
            <i className="bi bi-box-arrow-right me-2"></i> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
