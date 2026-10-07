import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getFoods } from "../services/foodService";

const Home = () => {
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFoods();
      // Pick top 4 items as popular
      setPopularFoods(data.slice(0, 4));
    } catch (err) {
      setError("Unable to connect to QuickDine server to fetch popular items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedFoods();
  }, []);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold mb-3">
                <i className="bi bi-stars me-1"></i> Authentic Fresh Cuisine
              </span>
              <h1 className="hero-title">
                Delicious Food. <br />
                <span className="highlight">Delivered with Love.</span>
              </h1>
              <p className="hero-subtitle">
                Experience gourmet restaurant dining from the comfort of your seat.
                Handcrafted recipes, freshest ingredients, and swift tableside or doorstep delivery.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <Link to="/menu" className="btn btn-primary-qd btn-lg px-4 shadow">
                  <i className="bi bi-bag-heart me-2"></i> Order Now
                </Link>
                <Link to="/menu" className="btn btn-outline-dark btn-lg px-4 rounded-pill">
                  Explore Menu
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="d-flex align-items-center gap-4 mt-4 pt-3 border-top justify-content-center justify-content-lg-start">
                <div>
                  <h4 className="fw-bold mb-0 text-danger">30 Min</h4>
                  <small className="text-muted">Swift Prep Time</small>
                </div>
                <div className="vr"></div>
                <div>
                  <h4 className="fw-bold mb-0 text-success">100%</h4>
                  <small className="text-muted">Fresh & Hygienic</small>
                </div>
                <div className="vr"></div>
                <div>
                  <h4 className="fw-bold mb-0 text-warning">4.9 ★</h4>
                  <small className="text-muted">Customer Rating</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-image-wrapper">
                <img
                  src="/images/hero.jpg"
                  alt="Delicious Cuisine"
                  className="hero-main-img img-fluid"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/foods/default-food.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR FOODS SECTION */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold text-uppercase">
              Customer Favorites
            </span>
            <h2 className="fw-bold mt-2 display-6">Popular Culinary Delights</h2>
            <p className="text-muted">Hand-picked dishes most loved by our food connoisseurs</p>
          </div>

          {loading ? (
            <Loading message="Fetching customer favorites..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchFeaturedFoods} />
          ) : (
            <div className="row g-4">
              {popularFoods.map((food) => (
                <div key={food.id} className="col-12 col-sm-6 col-lg-3">
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/menu" className="btn btn-outline-qd px-4 py-2">
              Browse All Dishes <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE QUICKDINE SECTION */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill fw-bold text-uppercase">
              Our Promise
            </span>
            <h2 className="fw-bold mt-2 display-6">Why Choose QuickDine?</h2>
            <p className="text-muted">Built for restaurant food lovers who demand excellence</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <div className="feature-icon-circle">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <h5 className="fw-bold">Fast Delivery</h5>
                <p className="text-muted small mb-0">
                  Hot and fresh meals straight from the kitchen to your table or doorstep in record time.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <div className="feature-icon-circle">
                  <i className="bi bi-egg-fried"></i>
                </div>
                <h5 className="fw-bold">Fresh Food</h5>
                <p className="text-muted small mb-0">
                  Every dish is cooked fresh upon order using premium farm ingredients and certified spices.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <div className="feature-icon-circle">
                  <i className="bi bi-phone"></i>
                </div>
                <h5 className="fw-bold">Easy Ordering</h5>
                <p className="text-muted small mb-0">
                  Simple and seamless digital menu, instant cart, and real-time live order tracking.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <div className="feature-icon-circle">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 className="fw-bold">Secure Payment</h5>
                <p className="text-muted small mb-0">
                  Multiple safe checkout methods including UPI, cards, and convenient cash on delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESTAURANT CTA BANNER */}
      <div className="container">
        <div className="cta-banner text-center">
          <h2 className="fw-bold mb-3 display-6">Ready to Experience Great Taste?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            Explore our mouthwatering menu with delicious starters, authentic curries, and heavenly desserts.
          </p>
          <Link to="/menu" className="btn btn-light btn-lg text-danger fw-bold px-5 rounded-pill shadow-sm">
            <i className="bi bi-menu-button-wide me-2"></i> View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
