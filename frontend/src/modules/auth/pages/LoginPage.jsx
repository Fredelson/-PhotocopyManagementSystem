// ============================================
// ARAB UNITY SCHOOL
// Login Page
//
// Handles:
// - User Authentication
// - Role-Based Redirection
// - Error Handling
//
// Role Mapping:
//
// Teacher           -> Teacher Dashboard
// TeachingAssistant -> Teacher Dashboard
// HOD               -> HOD Dashboard
// HOS               -> HOS Dashboard
// Secretary         -> HOS Dashboard
// PrintingAdmin     -> Printing Dashboard
// Admin             -> Printing Dashboard
// SuperAdmin        -> Teacher Dashboard
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import { useAuth } from "../../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ============================================
  // Form State
  // ============================================
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ============================================
  // Redirect User Based On Role
  // ============================================
  const redirectByRole = (role) => {
    switch (role) {
      // ========================================
      // Teacher Level
      // ========================================
      case "Teacher":
      case "TeachingAssistant":
        navigate("/teacher/dashboard");
        break;

      // ========================================
      // HOD Level
      // ========================================
      case "HOD":
        navigate("/hod/dashboard");
        break;

      // ========================================
      // HOS Level
      // Secretary shares HOS permissions
      // ========================================
      case "HOS":
      case "Secretary":
        navigate("/hos/dashboard");
        break;

      // ========================================
      // Printing Admin Level
      // ========================================
      case "PrintingAdmin":
      case "Admin":
        navigate("/printing/dashboard");
        break;

      // ========================================
      // Super Admin
      // ========================================
      case "SuperAdmin":
        navigate("/super-admin/dashboard");
        break;

      // ========================================
      // Unknown Role
      // ========================================
      default:
        navigate("/login");
        break;
    }
  };

  // ============================================
  // Login Handler
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const loggedUser = await login(
        employeeId.trim(),
        password.trim()
      );

      redirectByRole(loggedUser.role);
    } catch (err) {
      console.error(err);

      setError(
        "Invalid employee ID or password"
      );
    }
  };

  // ============================================
  // UI
  // ============================================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: 500,
          borderRadius: 5,
          boxShadow:
            "0px 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            ARAB UNITY SCHOOL
          </Typography>

          <Typography
            sx={{
              fontSize: 18,
              color: "#334155",
              mb: 3,
            }}
          >
            Photocopy Management System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Employee ID"
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(e.target.value)
              }
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                height: 55,
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              LOGIN
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
