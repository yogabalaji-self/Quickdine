import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      // Role comes from the account itself: ADMIN -> admin dashboard, otherwise customer home
      if (res.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <div className="auth-header">
          <img
            src={logoImg}
            alt="QuickDine Logo"
            className="mb-2 shadow-sm"
            style={{ width: "65px", height: "65px", borderRadius: "50%" }}
          />
          <h3 className="fw-bold mb-1">Welcome to QuickDine</h3>
          <p className="text-muted small">Sign in to start ordering delicious food</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-envelope text-secondary"></i>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control bg-light border-start-0"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock text-secondary"></i>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control bg-light border-start-0"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary-qd w-100 py-2 fs-6 mb-3 shadow"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-top">
          <p className="text-muted small mb-0">
            Don't have an account?{" "}
            <Link to="/register" className="text-danger fw-bold text-decoration-none">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
