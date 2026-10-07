import React from "react";

const Loading = ({ message = "Loading delicious items..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-danger mb-3"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-semibold">{message}</p>
    </div>
  );
};

export default Loading;
