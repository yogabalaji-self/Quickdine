import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getFoodById } from "../services/foodService";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFoodById(id);
      setFood(data);
    } catch (err) {
      setError("Unable to find or load the requested dish details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    addItem(food, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loading message="Loading dish details..." />;
  if (error || !food) {
    return (
      <div className="container py-5 text-center">
        <ErrorMessage message={error || "Dish not found."} onRetry={fetchDetails} />
        <Link to="/menu" className="btn btn-outline-qd mt-3">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/menu" className="text-decoration-none text-muted">Menu</Link>
            </li>
            <li className="breadcrumb-item active text-danger fw-bold" aria-current="page">
              {food.name}
            </li>
          </ol>
        </nav>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="row g-0">
            {/* Food Image */}
            <div className="col-lg-6">
              <img
                src={food.image || "/images/foods/default-food.jpg"}
                alt={food.name}
                className="img-fluid h-100 w-100 object-fit-cover"
                style={{ minHeight: "380px", maxHeight: "500px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/foods/default-food.jpg";
                }}
              />
            </div>

            {/* Food Info */}
            <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className={food.isVeg ? "veg-badge" : "non-veg-badge"}></span>
                  <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill fw-semibold">
                    {food.category}
                  </span>
                  {food.rating && (
                    <span className="badge bg-warning text-dark px-2 py-1 rounded-pill fw-bold">
                      <i className="bi bi-star-fill me-1"></i>
                      {food.rating}
                    </span>
                  )}
                </div>

                <h1 className="fw-bold text-dark display-6 mb-3">{food.name}</h1>

                <h3 className="text-danger fw-bold mb-4">
                  ₹{food.price} <small className="fs-6 text-muted fw-normal">/ serving</small>
                </h3>

                <h6 className="fw-bold text-dark mb-2">Description</h6>
                <p className="text-muted leading-relaxed mb-4">
                  {food.description || "Freshly cooked specialty prepared with the finest ingredients."}
                </p>

                {/* Additional metadata */}
                <div className="bg-light p-3 rounded-3 mb-4 border d-flex gap-4">
                  <div>
                    <small className="text-muted d-block">Preparation</small>
                    <span className="fw-semibold">15-20 Mins</span>
                  </div>
                  <div className="vr"></div>
                  <div>
                    <small className="text-muted d-block">Dietary</small>
                    <span className="fw-semibold">{food.isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}</span>
                  </div>
                  <div className="vr"></div>
                  <div>
                    <small className="text-muted d-block">Availability</small>
                    <span className={food.available !== false ? "text-success fw-semibold" : "text-danger fw-semibold"}>
                      {food.available !== false ? "In Stock" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity selector & Add to cart */}
              <div>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div className="d-flex align-items-center border rounded-pill p-1 bg-light">
                    <button
                      className="btn btn-sm btn-link text-dark fw-bold text-decoration-none px-3"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="px-3 fw-bold fs-6">{quantity}</span>
                    <button
                      className="btn btn-sm btn-link text-dark fw-bold text-decoration-none px-3"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={food.available === false}
                    className={`btn px-4 py-2 rounded-pill fw-bold shadow-sm ${
                      added ? "btn-success" : "btn-primary-qd"
                    }`}
                  >
                    {added ? (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i> Added to Cart!
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2"></i> Add to Cart (₹{(food.price * quantity).toFixed(2)})
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      addItem(food, quantity);
                      navigate("/cart");
                    }}
                    className="btn btn-outline-dark px-4 py-2 rounded-pill fw-semibold"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
