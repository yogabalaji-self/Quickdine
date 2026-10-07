import React from "react";
import ReactDOM from "react-dom/client";

// Bootstrap 5 & Bootstrap Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Custom CSS Modular Styles
import "./css/global.css";
import "./css/navbar.css";
import "./css/home.css";
import "./css/menu.css";
import "./css/auth.css";
import "./css/admin.css";

import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
