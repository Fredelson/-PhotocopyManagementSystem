// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Layout
// Phase 3 Super Admin UI Foundation
// ============================================
//
// Description:
// Layout wrapper for all Super Admin pages.
//
// Responsibilities:
// - Provide Super Admin sidebar
// - Provide top content spacing
// - Keep Super Admin pages visually consistent
// - Separate layout from page content
//
// Future Enhancements:
// - Add Super Admin topbar
// - Add breadcrumbs
// - Add collapsible sidebar
// - Add mobile drawer support
//
// ============================================

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "./SuperAdminSidebar";

// ============================================
// Layout Constants
// ============================================

const SIDEBAR_WIDTH = 280;

// ============================================
// Super Admin Layout Component
// ============================================

export default function SuperAdminLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        display: "flex",
      }}
    >
      {/* Sidebar Area */}
      <SuperAdminSidebar width={SIDEBAR_WIDTH} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          ml: `${SIDEBAR_WIDTH}px`,
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}