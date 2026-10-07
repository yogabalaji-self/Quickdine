import React from "react";

const ErrorMessage = ({ message = "Unable to connect to QuickDine server.", onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 my-3 shadow-sm rounded-3">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm btn-outline-danger ms-3 px-3 fw-bold"
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button> 
      )}
    </div>
  );
};

export default ErrorMessage;
