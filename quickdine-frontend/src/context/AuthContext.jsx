import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { createUser } from "../services/userService";

const AuthContext = createContext();

const TOKEN_KEY = "quickdine_token";
const USER_KEY = "quickdine_user";

// Reads the "exp" claim of the JWT and checks whether the token has expired
const isTokenExpired = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true; // not a valid JWT (e.g. an old mock token) -> treat as logged out
  }
};

// Restores the saved login, but only if it still has a valid (non-expired) JWT
const readSession = () => {
  try {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser && !isTokenExpired(savedToken)) {
      return { user: JSON.parse(savedUser), token: savedToken };
    }
  } catch {
    // fall through to logged-out state
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return { user: null, token: null };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => readSession().user);
  const [token, setToken] = useState(() => readSession().token);

  const isAuthenticated = !!currentUser;
  const role = currentUser ? currentUser.role : null;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  // Login: POST /api/auth/login -> backend checks the BCrypt hash and returns a signed JWT
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token: jwt, user } = res.data || {};
      if (!jwt || !user) {
        throw new Error("Unexpected response from the server.");
      }

      // Save immediately so the very next API call already carries the token
      localStorage.setItem(TOKEN_KEY, jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setToken(jwt);
      setCurrentUser(user);

      return { success: true, user };
    } catch (err) {
      if (err.response) {
        throw new Error(
          err.response.data?.message || "Invalid email or password. Please check your credentials."
        );
      }
      if (err.request) {
        throw new Error("Cannot reach the server. Please make sure the backend is running on port 8082.");
      }
      throw err;
    }
  };

  // Register handler: sends POST to Spring Boot backend /api/users
  const register = async (userData) => {
    // userData: { name, email, password, role: "CUSTOMER" }
    const response = await createUser(userData);
    return response.data;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        role,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
