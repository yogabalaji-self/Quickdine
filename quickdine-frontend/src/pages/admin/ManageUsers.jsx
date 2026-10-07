import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser, createUser } from "../../services/userService";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Quick Add user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "12345",
    role: "CUSTOMER"
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Calls Spring Boot backend: GET http://localhost:8082/api/users
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("ManageUsers fetch error:", err);
      setError(
        "Unable to fetch users from Spring Boot backend (http://localhost:8082/api/users). Please verify your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        // Calls Spring Boot backend: DELETE http://localhost:8082/api/users/{id}
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setMessage(`User "${name}" was deleted successfully.`);
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        alert("Failed to delete user from server.");
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // Calls Spring Boot backend: POST http://localhost:8082/api/users
      const res = await createUser(newUser);
      setUsers((prev) => [...prev, res.data]);
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "12345", role: "CUSTOMER" });
      setMessage("New user created successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Failed to create user on backend.");
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
            <h2 className="fw-bold mb-0 mt-1">Manage Users & Customers</h2>
            <p className="text-muted small mb-0">
              Directly connected to Spring Boot endpoint:{" "}
              <code className="bg-white px-2 py-1 rounded text-danger">/api/users</code>
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary-qd rounded-pill shadow-sm"
          >
            <i className="bi bi-person-plus-fill me-1"></i> Add User
          </button>
        </div>

        {message && (
          <div className="alert alert-success py-2 small mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Fetching users from Spring Boot backend..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchUsers} />
        ) : (
          <div className="admin-table-container">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No registered users found in MySQL database.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td className="fw-bold text-danger">#{u.id}</td>
                        <td className="fw-semibold text-dark">{u.name}</td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          <span
                            className={`badge px-3 py-1 rounded-pill ${
                              u.role === "ADMIN"
                                ? "bg-danger text-white"
                                : "bg-primary-subtle text-primary border border-primary-subtle"
                            }`}
                          >
                            {u.role || "CUSTOMER"}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          >
                            <i className="bi bi-trash3 me-1"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">Create User in MySQL</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <form onSubmit={handleCreateUser}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Arun Kumar"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="arun@gmail.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Role</label>
                      <select
                        className="form-select"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button
                      type="button"
                      className="btn btn-secondary rounded-pill px-3"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary-qd rounded-pill px-4">
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
