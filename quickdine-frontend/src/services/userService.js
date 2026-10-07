import api from "./api";

// Fetch all users from Spring Boot backend
export const getUsers = () => {
  return api.get("/api/users");
};

// Fetch single user by ID
export const getUserById = (id) => {
  return api.get(`/api/users/${id}`);
};

// Register/create a new user (POST /api/users)
export const createUser = (user) => {
  return api.post("/api/users", user);
};

// Update existing user
export const updateUser = (id, user) => {
  return api.put(`/api/users/${id}`, user);
};

// Delete user by ID
export const deleteUser = (id) => {
  return api.delete(`/api/users/${id}`);
};
