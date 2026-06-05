import { useState } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/navbar/Topbar";

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,

          ml: {
            xs: 0,
            md: `${drawerWidth}px`,
          },

          width: {
            xs: "100%",
            md: `calc(100% - ${drawerWidth}px)`,
          },

          minHeight: "100vh",
        }}
      >
        {/* Topbar */}
        <Topbar handleDrawerToggle={handleDrawerToggle} />

        {/* Page Content */}
        <Box
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}