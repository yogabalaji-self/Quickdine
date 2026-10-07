import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { cartItems, subtotal, tax, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
        <div className="container text-center py-5">
          <div className="bg-white p-5 rounded-4 shadow-sm mx-auto" style={{ maxWidth: "520px" }}>
            <div className="mb-4">
              <i className="bi bi-cart-x text-danger display-1"></i>
            </div>
            <h3 className="fw-bold mb-2">Your Cart is Empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added anything to your cart yet. Explore our mouthwatering menu!
            </p>
            <Link to="/menu" className="btn btn-primary-qd btn-lg px-4 shadow">
              <i className="bi bi-menu-app me-2"></i> Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Your Food Cart</h2>
            <p className="text-muted small mb-0">Review items and proceed to checkout</p>
          </div>
          <button
            onClick={clearCart}
            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold"
          >
            <i className="bi bi-trash3 me-1"></i> Clear Cart
          </button>
        </div>

        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Link to="/menu" className="btn btn-link text-decoration-none text-danger fw-semibold p-0">
                <i className="bi bi-arrow-left me-1"></i> Add More Delicious Dishes
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold mb-3 pb-2 border-bottom">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Items Subtotal</span>
                <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">GST / Taxes (5%)</span>
                <span className="fw-semibold">₹{tax.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Packaging / Delivery</span>
                <span className="fw-semibold">
                  {deliveryFee === 0 ? (
                    <span className="badge bg-success-subtle text-success">FREE</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {subtotal < 500 && (
                <div className="alert alert-warning py-2 small mb-3">
                  <i className="bi bi-info-circle me-1"></i> Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
                </div>
              )}

              <hr className="my-2" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold text-dark">Grand Total</span>
                <span className="fs-4 fw-bold text-danger">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn btn-primary-qd btn-lg w-100 py-3 shadow"
              >
                Proceed to Checkout <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
