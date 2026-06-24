// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Layout
// ============================================
//
// Purpose:
// - Provides one shared layout for all Super Admin pages
// - Keeps the topbar fixed at the top
// - Keeps the sidebar fixed below the topbar
// - Renders page content using React Router Outlet
//
// Layout:
// Topbar: full width, fixed top
// Sidebar: fixed left, starts below topbar
// Content: starts beside sidebar and below topbar
//
// ============================================

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";

// ============================================
// Layout Constants
// ============================================

const SIDEBAR_WIDTH = 360;
const TOPBAR_HEIGHT = 78;

// ============================================
// Super Admin Layout Component
// ============================================

export default function SuperAdminLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      {/* Fixed Topbar */}
      <SuperAdminTopbar height={TOPBAR_HEIGHT} />

      {/* Fixed Sidebar Below Topbar */}
      <SuperAdminSidebar
        width={SIDEBAR_WIDTH}
        topOffset={TOPBAR_HEIGHT}
      />

      {/* Main Page Content */}
      <Box
        component="main"
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          pt: `${TOPBAR_HEIGHT}px`,
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}