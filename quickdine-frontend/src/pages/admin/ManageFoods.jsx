import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFoods, deleteFood } from "../../services/foodService";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFoods();
      setFoods(data);
    } catch (err) {
      setError("Unable to load foods list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      try {
        await deleteFood(id);
        setActionMessage(`"${name}" was deleted successfully.`);
        setFoods((prev) => prev.filter((f) => f.id !== id));
        setTimeout(() => setActionMessage(""), 3000);
      } catch (err) {
        alert("Failed to delete food item.");
      }
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <Link to="/admin" className="text-decoration-none text-muted small fw-semibold">
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </Link>
            <h2 className="fw-bold mb-0 mt-1">Manage Menu Items</h2>
            <p className="text-muted small mb-0">Add, edit prices, or remove culinary items</p>
          </div>
          <Link to="/admin/foods/add" className="btn btn-primary-qd rounded-pill shadow-sm">
            <i className="bi bi-plus-lg me-1"></i> Add New Food
          </Link>
        </div>

        {actionMessage && (
          <div className="alert alert-success py-2 small mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <span>{actionMessage}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Loading foods list..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadFoods} />
        ) : (
          <div className="admin-table-container">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Food Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No food items available. Click "Add New Food" to create one.
                      </td>
                    </tr>
                  ) : (
                    foods.map((food) => (
                      <tr key={food.id}>
                        <td className="fw-bold text-muted">#{food.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={food.image || "/images/foods/default-food.jpg"}
                              alt={food.name}
                              className="rounded-3 shadow-sm"
                              style={{ width: "45px", height: "45px", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/foods/default-food.jpg";
                              }}
                            />
                            <div>
                              <span className="fw-bold d-block">{food.name}</span>
                              <span className={food.isVeg ? "veg-badge me-1" : "non-veg-badge me-1"}></span>
                              <small className="text-muted">{food.isVeg ? "Veg" : "Non-Veg"}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border px-2 py-1">
                            {food.category}
                          </span>
                        </td>
                        <td className="fw-bold text-danger">₹{food.price}</td>
                        <td>
                          {food.available !== false ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                              Available
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Link
                              to={`/admin/foods/edit/${food.id}`}
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            >
                              <i className="bi bi-pencil me-1"></i> Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(food.id, food.name)}
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            >
                              <i className="bi bi-trash3 me-1"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFoods;
