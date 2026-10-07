import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const ORDER_STEPS = [
  { key: "PLACED", label: "Order Placed", icon: "bi-check2-circle", desc: "Received by restaurant" },
  { key: "CONFIRMED", label: "Order Confirmed", icon: "bi-receipt", desc: "Kitchen accepted ticket" },
  { key: "PREPARING", label: "Preparing Food", icon: "bi-fire", desc: "Master chef is cooking" },
  { key: "READY", label: "Ready to Serve / Deliver", icon: "bi-bell", desc: "Packed & plated hot" },
  { key: "COMPLETED", label: "Order Completed", icon: "bi-trophy", desc: "Enjoy your delicious meal!" }
];

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError("Unable to find order tracking information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <Loading message="Loading live order status..." />;
  if (error || !order) {
    return (
      <div className="container py-5 text-center">
        <ErrorMessage message={error || "Order not found."} onRetry={fetchOrder} />
        <Link to="/orders" className="btn btn-outline-qd mt-3">
          Back to My Orders
        </Link>
      </div>
    );
  }

  // Find index of current status
  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="mb-4">
          <Link to="/orders" className="text-decoration-none text-muted small fw-semibold">
            <i className="bi bi-arrow-left me-1"></i> Back to Orders
          </Link>
          <div className="d-flex flex-wrap justify-content-between align-items-center mt-2">
            <div>
              <h2 className="fw-bold mb-0">Track Order #{order.id}</h2>
              <p className="text-muted small mb-0">Placed on {order.date}</p>
            </div>
            <div>
              <span className={`badge px-3 py-2 fs-6 rounded-pill fw-bold ${
                isCancelled ? "bg-danger" : "bg-success"
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Timeline */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
          <h5 className="fw-bold mb-4 text-center">Live Preparation Timeline</h5>

          {isCancelled ? (
            <div className="alert alert-danger text-center p-4 rounded-4 mb-0">
              <i className="bi bi-x-circle-fill display-4 mb-2 d-block"></i>
              <h5 className="fw-bold">This Order Was Cancelled</h5>
              <p className="mb-0 small">Please contact customer support if you have any questions.</p>
            </div>
          ) : (
            <div className="timeline-container py-3">
              <div className="row g-3 text-center">
                {ORDER_STEPS.map((step, index) => {
                  const isDone = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.key} className="col">
                      <div className="d-flex flex-column align-items-center position-relative">
                        {/* Step Icon Circle */}
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm mb-2 transition-all ${
                            isCurrent
                              ? "bg-danger text-white border border-4 border-danger-subtle"
                              : isDone
                              ? "bg-success text-white"
                              : "bg-light text-muted border"
                          }`}
                          style={{ width: "54px", height: "54px", fontSize: "1.3rem" }}
                        >
                          <i className={`bi ${step.icon}`}></i>
                        </div>

                        {/* Step Details */}
                        <h6 className={`fw-bold mb-1 small ${isCurrent ? "text-danger" : isDone ? "text-dark" : "text-muted"}`}>
                          {step.label}
                        </h6>
                        <small className="text-muted d-none d-md-block" style={{ fontSize: "0.72rem" }}>
                          {step.desc}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar Line */}
              <div className="progress mt-4" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${Math.max(10, ((currentStepIndex + 1) / ORDER_STEPS.length) * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Summary Card */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3 pb-2 border-bottom">Dining & Customer Details</h5>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                <li>
                  <strong className="text-muted">Customer Name:</strong> {order.customerName}
                </li>
                <li>
                  <strong className="text-muted">Email:</strong> {order.customerEmail}
                </li>
                <li>
                  <strong className="text-muted">Contact Phone:</strong> {order.customerPhone || "N/A"}
                </li>
                <li>
                  <strong className="text-muted">Dining / Location:</strong>{" "}
                  {order.tableNumber ? `Table: ${order.tableNumber}` : order.deliveryAddress}
                </li>
                <li>
                  <strong className="text-muted">Payment:</strong>{" "}
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-semibold">
                    <i className="bi bi-shield-check me-1"></i>
                    {order.paymentMethod || "PAID"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3 pb-2 border-bottom">Ordered Items</h5>
              <ul className="list-unstyled mb-3 small">
                {order.items &&
                  order.items.map((item, idx) => (
                    <li key={idx} className="d-flex justify-content-between py-1 border-bottom">
                      <span>
                        <strong>{item.quantity}×</strong> {item.name}
                      </span>
                      <span className="fw-semibold">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center pt-2">
                <span className="fw-bold">Total Paid:</span>
                <span className="fs-5 fw-bold text-danger">₹{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
