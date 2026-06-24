// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Main React Entry Point
// ============================================
//
// Description:
// Application bootstrap.
// Registers all global providers.
//
// Provider Order:
// BrowserRouter
// AuthProvider
// PermissionProvider
// FeatureFlagProvider
// ThemeProvider
//
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App";
import theme from "./theme/theme";

import { AuthProvider } from "./context/AuthContext";
import { PermissionProvider } from "./context/PermissionContext";
import { FeatureFlagProvider } from "./providers/FeatureFlagProvider";

import "./index.css";

// ============================================
// Render Application
// ============================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PermissionProvider>
          <FeatureFlagProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </FeatureFlagProvider>
        </PermissionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);