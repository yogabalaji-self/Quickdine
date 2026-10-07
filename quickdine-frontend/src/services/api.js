import axios from "axios";

const TOKEN_KEY = "quickdine_token";
const USER_KEY = "quickdine_user";

// Central Axios instance pointing to Spring Boot backend on port 8082
const api = axios.create({
  baseURL: "http://localhost:8082",
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach the JWT to every request: Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server says the token is missing/invalid/expired (401), log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    if (status === 401 && !url.includes("/api/auth/login")) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
