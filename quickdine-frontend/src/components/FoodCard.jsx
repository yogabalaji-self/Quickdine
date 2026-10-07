import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FoodCard = ({ food }) => {
  const { addItem } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    addItem(food, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="card food-card">
      <div className="food-card-img-wrapper">
        <img
          src={food.image || "/images/foods/default-food.jpg"}
          alt={food.name}
          className="food-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/foods/default-food.jpg";
          }}
        />
        {/* Category & Veg indicator */}
        <span
          className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm d-flex align-items-center gap-1 px-2 py-1"
          style={{ borderRadius: "8px", fontSize: "0.78rem" }}
        >
          <span className={food.isVeg ? "veg-badge" : "non-veg-badge"}></span>
          <span className="fw-semibold">{food.category}</span>
        </span>

        {/* Rating */}
        {food.rating && (
          <span
            className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark shadow-sm px-2 py-1 fw-bold"
            style={{ borderRadius: "8px" }}
          >
            <i className="bi bi-star-fill me-1"></i>
            {food.rating}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body p-3 d-flex flex-column">
        <h5 className="card-title fw-bold text-dark mb-1 fs-6">{food.name}</h5>
        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ minHeight: "40px" }}>
          {food.description
            ? food.description.length > 75
              ? `${food.description.substring(0, 75)}...`
              : food.description
            : "Delicious freshly prepared specialty."}
        </p>

        {/* Price & Availability */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <span className="fs-5 fw-bold text-danger">₹{food.price}</span>
            <small className="text-muted ms-1">/ plate</small>
          </div>
          <div>
            {food.available !== false ? (
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                In Stock
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Link
            to={`/food/${food.id}`}
            className="btn btn-sm btn-outline-secondary w-50 py-2 rounded-3 fw-semibold text-center"
          >
            Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={food.available === false}
            className={`btn btn-sm w-50 py-2 rounded-3 fw-bold transition-all ${
              addedAnimation ? "btn-success" : "btn-primary-qd"
            }`}
          >
            {addedAnimation ? (
              <>
                <i className="bi bi-check-circle-fill me-1"></i> Added
              </>
            ) : (
              <>
                <i className="bi bi-cart-plus me-1"></i> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
