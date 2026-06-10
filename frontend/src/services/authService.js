// ============================================
// ARAB UNITY SCHOOL
// Authentication Service
// ============================================

import api from "./api";

// Login User
export const loginUser = async (employeeId, password) => {
  const response = await api.post("/auth/login", {
    employeeId,
    password,
  });

  return response.data;
};

// Get Logged-in User
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};