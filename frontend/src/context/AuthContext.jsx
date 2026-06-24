// ============================================
// ARAB UNITY SCHOOL
// Authentication Context
// Handles login, logout, user session,
// and user permissions
// ============================================

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, getCurrentUser } from "../services/authService";
import { getMyPermissions } from "../services/permissionService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const loadPermissions = async () => {
    try {
      const data = await getMyPermissions();
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error("Failed to load permissions:", error);
      setPermissions([]);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const currentUser = await getCurrentUser();

        setUser(currentUser);
        await loadPermissions();
      } catch (error) {
        console.error("Failed to load user:", error);

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (employeeId, password) => {
    const data = await loginUser(employeeId, password);

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    await loadPermissions();

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
    setPermissions([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        loading,
        login,
        logout,
        reloadPermissions: loadPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}