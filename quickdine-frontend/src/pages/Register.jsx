import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";
import logoImg from "../assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // 1. Validation checks
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setErrorMessage("Password must be at least 4 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      // 2. Prepare payload for Spring Boot backend
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "CUSTOMER"
      };

      // 3. Send POST request to Spring Boot: http://localhost:8082/api/users
      await createUser(payload);

      setSuccessMessage("Account created successfully! Redirecting to login...");

      // 4. Redirect after short delay so user sees success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === "ERR_NETWORK") {
        setErrorMessage(
          "Unable to connect to QuickDine server (http://localhost:8082). Please ensure Spring Boot is running."
        );
      } else if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please check your connection and try again.");
      }
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
          <h3 className="fw-bold mb-1">Create Account</h3>
          <p className="text-muted small">Join QuickDine and enjoy fast, gourmet dining</p>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success py-2 small mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-person text-secondary"></i>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control bg-light border-start-0"
                placeholder="e.g. Yoga Balaji"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-envelope text-secondary"></i>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control bg-light border-start-0"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock text-secondary"></i>
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control bg-light border-start-0"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-shield-check text-secondary"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control bg-light border-start-0"
                placeholder="Re-type password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary-qd w-100 py-2 fs-6 mb-3 shadow"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-top">
          <p className="text-muted small mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-danger fw-bold text-decoration-none">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
