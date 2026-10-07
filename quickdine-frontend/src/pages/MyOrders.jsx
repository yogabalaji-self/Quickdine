import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders, getOrdersByEmail } from "../services/orderService";
import OrderCard from "../components/OrderCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch orders matching customer email or general orders
      const data = currentUser?.email
        ? await getOrdersByEmail(currentUser.email)
        : await getOrders();
      setOrders(data);
    } catch (err) {
      setError("Unable to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [currentUser]);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Orders</h2>
            <p className="text-muted small mb-0">Track your current meals and past orders</p>
          </div>
          <Link to="/menu" className="btn btn-outline-qd rounded-pill px-3">
            <i className="bi bi-plus-lg me-1"></i> New Order
          </Link>
        </div>

        {loading ? (
          <Loading message="Fetching your orders history..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchUserOrders} />
        ) : orders.length === 0 ? (
          <div className="bg-white p-5 rounded-4 shadow-sm text-center my-4 mx-auto" style={{ maxWidth: "500px" }}>
            <i className="bi bi-clock-history text-muted display-3 mb-3 d-block"></i>
            <h4 className="fw-bold">No Orders Yet</h4>
            <p className="text-muted">You haven't placed any orders with QuickDine yet.</p>
            <Link to="/menu" className="btn btn-primary-qd mt-2">
              Explore Our Menu
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8 mx-auto">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
