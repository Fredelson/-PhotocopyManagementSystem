// ============================================
// ARAB UNITY SCHOOL
// Authentication Context
// Handles login, logout, user session
// ============================================

import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // ============================================
  // Load Logged-in User on Refresh
  // ============================================
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // ============================================
  // Login User
  // ============================================
  const login = async (employeeId, password) => {
    const data = await loginUser(
      employeeId,
      password
    );

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  // ============================================
  // Logout User
  // ============================================
  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// Custom Hook
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}