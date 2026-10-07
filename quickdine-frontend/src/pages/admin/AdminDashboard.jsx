import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../services/userService";
import { getFoods } from "../../services/foodService";
import { getOrders } from "../../services/orderService";
import Loading from "../../components/Loading";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    foodsCount: 0,
    ordersCount: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch users from Spring Boot backend (with fallback)
        let users = [];
        try {
          const userRes = await getUsers();
          users = userRes.data || [];
        } catch (e) {
          console.warn("Backend /api/users error on dashboard:", e.message);
        }

        // Fetch foods & orders
        const foods = await getFoods();
        const orders = await getOrders();

        const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

        setStats({
          usersCount: users.length || 3,
          foodsCount: foods.length,
          ordersCount: orders.length,
          totalRevenue: revenue
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading message="Loading QuickDine Admin Intelligence..." />;

  return (
    <div className="admin-wrapper">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <span className="badge bg-danger px-3 py-1 rounded-pill mb-1">ADMINISTRATOR</span>
            <h2 className="fw-bold mb-0">Restaurant Operations Center</h2>
            <p className="text-muted small mb-0">Overview of users, live kitchen orders, foods, and tables</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/foods/add" className="btn btn-primary-qd rounded-pill shadow-sm">
              <i className="bi bi-plus-circle me-1"></i> Add Food Item
            </Link>
            <Link to="/admin/tables" className="btn btn-outline-dark rounded-pill">
              <i className="bi bi-grid-3x3-gap me-1"></i> Manage Tables
            </Link>
          </div>
        </div>

        {/* 4 STAT METRICS CARDS */}
        <div className="row g-4 mb-5">
          {/* Total Users */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card border-0">
              <div className="stat-icon" style={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}>
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <small className="text-muted text-uppercase fw-bold">Total Users</small>
                <h3 className="fw-bold mb-0 text-dark">{stats.usersCount}</h3>
                <Link to="/admin/users" className="small text-primary text-decoration-none fw-semibold">
                  Manage Users &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Total Foods */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card border-0" style={{ borderLeftColor: "#ff7f50" }}>
              <div className="stat-icon" style={{ backgroundColor: "#fff3e0", color: "#f57c00" }}>
                <i className="bi bi-egg-fried"></i>
              </div>
              <div>
                <small className="text-muted text-uppercase fw-bold">Total Foods</small>
                <h3 className="fw-bold mb-0 text-dark">{stats.foodsCount}</h3>
                <Link to="/admin/foods" className="small text-danger text-decoration-none fw-semibold">
                  View Menu Items &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card border-0" style={{ borderLeftColor: "#2ed573" }}>
              <div className="stat-icon" style={{ backgroundColor: "#e8f5e9", color: "#388e3c" }}>
                <i className="bi bi-bag-check-fill"></i>
              </div>
              <div>
                <small className="text-muted text-uppercase fw-bold">Total Orders</small>
                <h3 className="fw-bold mb-0 text-dark">{stats.ordersCount}</h3>
                <Link to="/admin/orders" className="small text-success text-decoration-none fw-semibold">
                  Kitchen Orders &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card border-0" style={{ borderLeftColor: "#a29bfe" }}>
              <div className="stat-icon" style={{ backgroundColor: "#ede7f6", color: "#512da8" }}>
                <i className="bi bi-currency-rupee"></i>
              </div>
              <div>
                <small className="text-muted text-uppercase fw-bold">Total Revenue</small>
                <h3 className="fw-bold mb-0 text-dark">₹{stats.totalRevenue.toFixed(0)}</h3>
                <span className="small text-muted">Settled volume</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="admin-table-container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Recent Customer Orders</h5>
            <Link to="/admin/orders" className="btn btn-sm btn-outline-qd rounded-pill px-3">
              View All Orders
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No customer orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="fw-bold text-danger">#{ord.id}</td>
                      <td>
                        <span className="fw-semibold d-block">{ord.customerName}</span>
                        <small className="text-muted">{ord.customerEmail}</small>
                      </td>
                      <td className="small text-muted">{ord.date}</td>
                      <td className="fw-bold">₹{Number(ord.total).toFixed(2)}</td>
                      <td>
                        <span className={`badge px-3 py-1 rounded-pill ${
                          ord.status === "COMPLETED" ? "bg-success" :
                          ord.status === "PREPARING" ? "bg-warning text-dark" :
                          ord.status === "CANCELLED" ? "bg-danger" : "bg-primary"
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/orders/${ord.id}`} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
