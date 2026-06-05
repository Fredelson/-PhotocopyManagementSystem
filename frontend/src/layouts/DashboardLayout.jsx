// ============================================
// Dashboard Layout
// Fixed Topbar + Fixed Sidebar
// ============================================

import { Box } from "@mui/material";

import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/navbar/Topbar";

const topbarHeight = 78;
const sidebarWidth = 240;

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Topbar />

      <Sidebar />

      <Box
        component="main"
        sx={{
          marginTop: `${topbarHeight}px`,
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          minHeight: `calc(100vh - ${topbarHeight}px)`,
          p: 3,
          pr: 5,
          boxSizing: "border-box",
          backgroundColor: "#F8FAFC",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}