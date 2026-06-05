// ============================================
// ARAB UNITY SCHOOL
// Reusable Dashboard Layout
// Controls fixed Topbar, fixed Sidebar, and page spacing
// ============================================

import { Box } from "@mui/material";

// Global layout sizes
const TOPBAR_HEIGHT = 80;
const SIDEBAR_WIDTH = 260;

export default function DashboardLayout({ children, sidebar, topbar }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      {/* Fixed Topbar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: `${TOPBAR_HEIGHT}px`,
          zIndex: 2000,
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        {topbar}
      </Box>

      {/* Fixed Sidebar below Topbar */}
      <Box
        sx={{
          position: "fixed",
          top: `${TOPBAR_HEIGHT}px`,
          left: 0,
          width: `${SIDEBAR_WIDTH}px`,
          height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          zIndex: 1500,
          bgcolor: "#0F172A",
          overflowY: "auto",
        }}
      >
        {sidebar}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          paddingTop: `${TOPBAR_HEIGHT + 32}px`,
          paddingLeft: 4,
          paddingRight: 4,
          paddingBottom: 4,
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}