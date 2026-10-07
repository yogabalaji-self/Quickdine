import React from "react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const itemSubtotal = (Number(item.price) * item.quantity).toFixed(2);

  return (
    <div className="card border-0 shadow-sm p-3 mb-3 rounded-4 bg-white">
      <div className="row align-items-center g-3">
        {/* Item Image */}
        <div className="col-auto">
          <img
            src={item.image || "/images/foods/default-food.jpg"}
            alt={item.name}
            className="rounded-3"
            style={{ width: "70px", height: "70px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/foods/default-food.jpg";
            }}
          />
        </div>

        {/* Item Name & Unit Price */}
        <div className="col">
          <h6 className="fw-bold mb-1">{item.name}</h6>
          <span className="text-muted small">₹{item.price} each</span>
        </div>

        {/* Quantity Controls */}
        <div className="col-auto">
          <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: "110px" }}>
            <button
              className="btn btn-light border-0 px-2 text-danger fw-bold"
              type="button"
              onClick={() => decreaseQuantity(item.id)}
            >
              -
            </button>
            <span className="input-group-text bg-white border-0 text-center flex-grow-1 fw-bold">
              {item.quantity}
            </span>
            <button
              className="btn btn-light border-0 px-2 text-success fw-bold"
              type="button"
              onClick={() => increaseQuantity(item.id)}
            >
              +
            </button>
          </div>
        </div>

        {/* Item Subtotal */}
        <div className="col-auto text-end" style={{ minWidth: "90px" }}>
          <span className="fw-bold text-dark fs-6">₹{itemSubtotal}</span>
        </div>

        {/* Remove Button */}
        <div className="col-auto">
          <button
            onClick={() => removeItem(item.id)}
            className="btn btn-link text-danger p-0"
            title="Remove item"
          >
            <i className="bi bi-trash3 fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
