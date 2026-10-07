import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTables, createTable, updateTable, deleteTable } from "../../services/tableService";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const TABLE_STATUSES = ["AVAILABLE", "OCCUPIED", "RESERVED"];

const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New/Edit table form modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTableId, setCurrentTableId] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: 4,
    status: "AVAILABLE"
  });

  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTables();
      setTables(data);
    } catch (err) {
      setError("Unable to load restaurant tables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentTableId(null);
    setFormData({ tableNumber: `T-0${tables.length + 1}`, capacity: 4, status: "AVAILABLE" });
    setShowModal(true);
  };

  const openEditModal = (t) => {
    setIsEditing(true);
    setCurrentTableId(t.id);
    setFormData({ tableNumber: t.tableNumber, capacity: t.capacity, status: t.status });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await updateTable(currentTableId, formData);
        setTables((prev) => prev.map((t) => (t.id === currentTableId ? updated : t)));
      } else {
        const created = await createTable(formData);
        setTables((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) {
      alert("Failed to save table details.");
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await updateTable(id, { status: newStatus });
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert("Could not update table status.");
    }
  };

  const handleDelete = async (id, tableNumber) => {
    if (window.confirm(`Delete ${tableNumber} from restaurant floor?`)) {
      try {
        await deleteTable(id);
        setTables((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        alert("Could not delete table.");
      }
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
            <h2 className="fw-bold mb-0 mt-1">Restaurant Tables Floor Plan</h2>
            <p className="text-muted small mb-0">Manage dining capacities and seating availability</p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary-qd rounded-pill shadow-sm">
            <i className="bi bi-plus-lg me-1"></i> Add New Table
          </button>
        </div>

        {loading ? (
          <Loading message="Loading tables..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadTables} />
        ) : (
          <div className="row g-4">
            {tables.map((t) => (
              <div key={t.id} className="col-12 col-sm-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-dark fs-6 px-3 py-2 rounded-3">
                      <i className="bi bi-grid-3x3-gap-fill me-1"></i> {t.tableNumber}
                    </span>
                    <span
                      className={`badge px-3 py-2 rounded-pill fw-bold ${
                        t.status === "AVAILABLE"
                          ? "bg-success-subtle text-success border border-success-subtle"
                          : t.status === "OCCUPIED"
                          ? "bg-danger-subtle text-danger border border-danger-subtle"
                          : "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="my-2">
                    <p className="text-muted mb-1 small">
                      <i className="bi bi-person-standing me-1 fs-5 align-middle"></i> Seating Capacity:{" "}
                      <strong className="text-dark fs-5">{t.capacity} Guests</strong>
                    </p>
                  </div>

                  {/* Quick status change buttons */}
                  <div className="mt-3 pt-3 border-top">
                    <label className="small text-muted fw-semibold d-block mb-1">Set Status:</label>
                    <div className="btn-group btn-group-sm w-100 mb-3" role="group">
                      {TABLE_STATUSES.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleQuickStatusChange(t.id, st)}
                          className={`btn ${t.status === st ? "btn-danger fw-bold" : "btn-outline-secondary"}`}
                        >
                          {st.substring(0, 4)}
                        </button>
                      ))}
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.tableNumber)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        <i className="bi bi-trash3 me-1"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add / Edit Table */}
        {showModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    {isEditing ? "Edit Table" : "Add Restaurant Table"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Table Identifier</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. T-01 or Table 5"
                        value={formData.tableNumber}
                        onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Seating Capacity</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="form-control"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 2 })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Current Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        {TABLE_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button
                      type="button"
                      className="btn btn-secondary rounded-pill px-3"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary-qd rounded-pill px-4">
                      {isEditing ? "Save Changes" : "Create Table"}
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

export default ManageTables;
