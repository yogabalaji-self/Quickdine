import React from "react";
import { Link } from "react-router-dom";

const OrderCard = ({ order }) => {
  // Returns appropriate Bootstrap badge styling depending on order status
  const getBadgeClass = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-info text-dark";
      case "CONFIRMED":
        return "bg-primary text-white";
      case "PREPARING":
        return "bg-warning text-dark";
      case "READY":
        return "bg-success text-white";
      case "COMPLETED":
        return "bg-secondary text-white";
      case "CANCELLED":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
      <div className="d-flex flex-wrap justify-content-between align-items-center pb-2 border-bottom mb-3 gap-2">
        <div>
          <span className="fw-bold text-dark fs-6">Order #{order.id}</span>
          <small className="text-muted d-block">{order.date}</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge px-3 py-2 rounded-pill fw-bold ${getBadgeClass(order.status)}`}>
            {order.status}
          </span>
          <Link
            to={`/orders/${order.id}`}
            className="btn btn-sm btn-outline-qd rounded-pill px-3"
          >
            Track Status
          </Link>
        </div>
      </div>

      <div className="mb-3">
        <ul className="list-unstyled mb-0 small text-secondary">
          {order.items &&
            order.items.map((item, idx) => (
              <li key={idx} className="d-flex justify-content-between py-1">
                <span>
                  <strong>{item.quantity}x</strong> {item.name}
                </span>
                <span>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
        </ul>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border small">
            <i className="bi bi-geo-alt me-1 text-danger"></i>
            {order.tableNumber && order.tableNumber !== "Delivery"
              ? `Table: ${order.tableNumber}`
              : order.orderType === "DINE_IN"
              ? "Dine-in"
              : "Doorstep Delivery"}
          </span>
          {order.paymentMethod && (
            <span className="badge bg-danger-subtle text-danger small">
              <i className="bi bi-credit-card me-1"></i>
              {order.paymentMethod}
            </span>
          )}
        </div>
        <span className="fw-bold text-danger fs-5">
          ₹{Number(order.total).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
