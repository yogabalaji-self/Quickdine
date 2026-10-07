    import React from "react";
    import { Link } from "react-router-dom";
    import { useAuth } from "../context/AuthContext";
    import logoImg from "../assets/logo.png";

    const Footer = () => {
      const { role } = useAuth();
      const isAdmin = role === "ADMIN";

      return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
          <div className="container">
            <div className="row g-4">
              {/* Brand Info */}
              <div className="col-lg-4 col-md-6">
                <h4 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                  <img src={logoImg} alt="QuickDine" style={{ width: "32px", height: "32px", borderRadius: "50%" }} /> QuickDine
                </h4>
                <p className="text-secondary small leading-relaxed">
                  Delicious Food Delivered with Love. Order fresh starters, gourmet main courses,
                  delightful desserts, and chilled beverages right to your table or doorstep.
                </p>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6">
                <h6 className="text-uppercase fw-bold text-white mb-3">Explore</h6>
                <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                  {isAdmin ? (
                    <>
                      <li><Link to="/admin" className="text-secondary text-decoration-none">Dashboard</Link></li>
                      <li><Link to="/admin/orders" className="text-secondary text-decoration-none">Manage Orders</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                      <li><Link to="/menu" className="text-secondary text-decoration-none">Food Menu</Link></li>
                      <li><Link to="/cart" className="text-secondary text-decoration-none">My Cart</Link></li>
                      <li><Link to="/orders" className="text-secondary text-decoration-none">Order Tracking</Link></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Opening Hours */}
              <div className="col-lg-3 col-md-6">
                <h6 className="text-uppercase fw-bold text-white mb-3">Operating Hours</h6>
                <ul className="list-unstyled text-secondary small d-flex flex-column gap-1">
                  <li>Mon - Fri: 11:00 AM – 11:00 PM</li>
                  <li>Sat - Sun: 10:30 AM – 11:30 PM</li>
                  <li className="mt-2 text-warning">
                    <i className="bi bi-clock-history me-1"></i> Dine-in & Takeaway Open
                  </li>
                </ul>
              </div>

              {/* Contact Details */}
              <div className="col-lg-3 col-md-6">
                <h6 className="text-uppercase fw-bold text-white mb-3">Contact Us</h6>
                <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                  <li><i className="bi bi-geo-alt-fill text-danger me-2"></i> 100 Feet Road, Indiranagar, Bangalore</li>
                  <li><i className="bi bi-telephone-fill text-danger me-2"></i> +91 98765 43210</li>
                  <li><i className="bi bi-envelope-fill text-danger me-2"></i> support@quickdine.com</li>
                </ul>
              </div>
            </div>

            <hr className="my-4 border-secondary opacity-25" />

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-secondary small">
              <p className="mb-0">© {new Date().getFullYear()} QuickDine Restaurant Systems. All rights reserved.</p>
              <p className="mb-0">Powered by Spring Boot + React</p>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;
