import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getFoodById, updateFood } from "../../services/foodService";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const CATEGORIES = ["Starters", "Main Course", "Desserts", "Beverages"];

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    image: "",
    isVeg: true,
    available: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        const data = await getFoodById(id);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "Main Course",
          image: data.image || "",
          isVeg: data.isVeg !== undefined ? data.isVeg : true,
          available: data.available !== undefined ? data.available : true
        });
      } catch (err) {
        setError("Failed to load food details for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.price) {
      setError("Please fill in Food Name and Price.");
      return;
    }

    setSaving(true);

    try {
      await updateFood(id, {
        ...formData,
        price: parseFloat(formData.price)
      });
      navigate("/admin/foods");
    } catch (err) {
      setError("Failed to update food item.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading food details..." />;

  return (
    <div className="admin-wrapper">
      <div className="container" style={{ maxWidth: "700px" }}>
        <div className="mb-4">
          <Link to="/admin/foods" className="text-decoration-none text-muted small fw-semibold">
            <i className="bi bi-arrow-left me-1"></i> Back to Food List
          </Link>
          <h2 className="fw-bold mb-0 mt-1">Edit Dish #{id}</h2>
          <p className="text-muted small">Update dish information, pricing or availability</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Food Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Price (INR ₹) *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Image Path or URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-control"
                placeholder="/images/foods/paneer-tikka.jpg"
              />
            </div>

            <div className="row g-3 mb-4 pt-2">
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isVeg"
                    id="isVegSwitchEdit"
                    checked={formData.isVeg}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="isVegSwitchEdit">
                    <span className="veg-badge me-1"></span> Vegetarian Item
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="available"
                    id="availableSwitchEdit"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="availableSwitchEdit">
                    Available in Kitchen
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary-qd flex-grow-1 py-2 fw-bold"
              >
                {saving ? "Saving Changes..." : "Save Updates"}
              </button>
              <Link to="/admin/foods" className="btn btn-outline-secondary px-4 py-2">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFood;
