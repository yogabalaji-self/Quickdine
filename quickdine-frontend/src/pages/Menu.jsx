import React, { useState, useEffect } from "react";
import FoodCard from "../components/FoodCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getFoods } from "../services/foodService";

const CATEGORIES = ["All", "Starters", "Main Course", "Desserts", "Beverages"];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFoods();
      setFoods(data);
    } catch (err) {
      setError("Unable to load food menu. Please check your connection to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Filter foods by Category, Search Keyword, and Vegetarian Preference
  const filteredFoods = foods.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVeg = vegOnly ? item.isVeg === true : true;

    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <div className="menu-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold text-uppercase">
            Gourmet Selection
          </span>
          <h1 className="fw-bold mt-2 display-6">Our Delicious Menu</h1>
          <p className="text-muted">
            Crafted with passion by our master chefs. Choose from our variety of authentic dishes.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="row g-3 justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 shadow-sm mx-0">
          {/* Search box */}
          <div className="col-12 col-md-5">
            <div className="input-group search-input-group">
              <span className="input-group-text bg-transparent border-0 ps-3">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 bg-transparent ps-2"
                placeholder="Search food by name, ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-link text-muted pe-3"
                  type="button"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>

          {/* Veg Only Toggle */}
          <div className="col-12 col-md-auto d-flex align-items-center">
            <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
              <input
                className="form-check-input fs-5"
                type="checkbox"
                role="switch"
                id="vegSwitch"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
              />
              <label className="form-check-label fw-semibold small" htmlFor="vegSwitch">
                <span className="veg-badge me-1"></span> Veg Only
              </label>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <Loading message="Loading fresh menu items..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchMenu} />
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
            <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
            <h4 className="fw-bold text-dark">No dishes found</h4>
            <p className="text-muted">
              We couldn't find any dishes matching "{searchQuery}". Try selecting another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setVegOnly(false);
              }}
              className="btn btn-outline-qd mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredFoods.map((food) => (
              <div key={food.id} className="col-12 col-sm-6 col-lg-3">
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
