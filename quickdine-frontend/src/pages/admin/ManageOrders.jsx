import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const STATUS_LIST = ["PLACED", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updateMsg, setUpdateMsg] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError("Unable to load customer orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (String(o.id) === String(orderId) ? { ...o, status: newStatus } : o))
      );
      setUpdateMsg(`Order #${orderId} status changed to ${newStatus}`);
      setTimeout(() => setUpdateMsg(""), 3000);
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredOrders = orders.filter((o) =>
    statusFilter === "ALL" ? true : o.status === statusFilter
  );

  return (
    <div className="admin-wrapper">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <Link to="/admin" className="text-decoration-none text-muted small fw-semibold">
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </Link>
            <h2 className="fw-bold mb-0 mt-1">Live Order Management</h2>
            <p className="text-muted small mb-0">Control kitchen workflow and order statuses</p>
          </div>

          {/* Filter Pills */}
          <div className="d-flex flex-wrap gap-1">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`btn btn-sm rounded-pill px-3 ${
                statusFilter === "ALL" ? "btn-dark" : "btn-outline-secondary"
              }`}
            >
              All ({orders.length})
            </button>
            {STATUS_LIST.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm rounded-pill px-3 ${
                  statusFilter === st ? "btn-danger" : "btn-outline-secondary"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {updateMsg && (
          <div className="alert alert-success py-2 small mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <span>{updateMsg}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Loading orders..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadOrders} />
        ) : (
          <div className="admin-table-container">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No orders match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="fw-bold text-danger">#{ord.id}</td>
                        <td>
                          <span className="fw-semibold d-block">{ord.customerName}</span>
                          <small className="text-muted">{ord.customerEmail}</small>
                        </td>
                        <td className="small text-muted">{ord.date}</td>
                        <td className="small">
                          {ord.items?.length || 0} items
                          <small className="text-muted d-block">
                            {ord.items?.map((i) => i.name).slice(0, 2).join(", ")}
                            {ord.items?.length > 2 ? "..." : ""}
                          </small>
                        </td>
                        <td className="fw-bold">
                          ₹{Number(ord.total).toFixed(2)}
                          {ord.paymentMethod && (
                            <span className="badge bg-light text-dark border d-block mt-1 font-monospace" style={{ fontSize: "0.7rem", fontWeight: "normal" }}>
                              {ord.paymentMethod}
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge px-3 py-1 rounded-pill ${
                              ord.status === "COMPLETED"
                                ? "bg-success"
                                : ord.status === "PREPARING"
                                ? "bg-warning text-dark"
                                : ord.status === "READY"
                                ? "bg-info text-dark"
                                : ord.status === "CANCELLED"
                                ? "bg-danger"
                                : "bg-primary"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="form-select form-select-sm"
                            style={{ minWidth: "140px" }}
                          >
                            {STATUS_LIST.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/orders/${ord.id}`}
                            className="btn btn-sm btn-outline-qd rounded-pill px-3"
                          >
                            Inspect
                          </Link>
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

export default ManageOrders;
