// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Layout
//
// Purpose:
// Shared responsive layout for all Super Admin pages.
//
// Layout Behavior:
// - Desktop:
//   Fixed topbar + fixed sidebar.
//   Content starts beside the sidebar and below the topbar.
//
// - Tablet / Mobile:
//   Fixed topbar only.
//   Sidebar becomes a drawer opened by hamburger button.
//   Content uses full width and starts below the topbar.
// ============================================

import { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

import PlatformSidebar from "./PlatformSidebar";
import PlatformTopbar from "./PlatformTopbar";

// ============================================
// Layout Constants
// ============================================

const SIDEBAR_WIDTH = 340;
const MOBILE_SIDEBAR_WIDTH = 300;
const TOPBAR_HEIGHT = 78;

// ============================================
// Component
// ============================================

export default function SuperAdminLayout() {
  const theme = useTheme();

  // Desktop starts at lg and above.
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // Controls mobile/tablet drawer.
  const [mobileOpen, setMobileOpen] = useState(false);

  // Opens mobile sidebar drawer.
  const handleOpenMobileSidebar = () => {
    setMobileOpen(true);
  };

  // Closes mobile sidebar drawer.
  const handleCloseMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",

        // Prevent horizontal scrolling from layout itself.
        overflowX: "hidden",
      }}
    >
      {/* Fixed Topbar */}
      <PlatformTopbar
        height={TOPBAR_HEIGHT}
        onMenuClick={() => setMobileOpen((prev) => !prev)}
      />

      {/* Desktop Fixed Sidebar */}
      {isDesktop && (
        <PlatformSidebar
          width={SIDEBAR_WIDTH}
          topOffset={TOPBAR_HEIGHT}
        />
      )}

      {/* Mobile / Tablet Sidebar Drawer */}
      {!isDesktop && (
        <Drawer
          open={mobileOpen}
          onClose={handleCloseMobileSidebar}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: MOBILE_SIDEBAR_WIDTH,
              maxWidth: "85vw",
              bgcolor: "#061B52",
              overflowX: "hidden",
            },
          }}
        >
          <PlatformSidebar
            width={MOBILE_SIDEBAR_WIDTH}
            topOffset={0}
            isMobile
            onNavigate={handleCloseMobileSidebar}
          />
        </Drawer>
      )}

      {/* Main Page Content */}
      <Box
        component="main"
        sx={{
          // Desktop content starts after sidebar.
          ml: {
            xs: 0,
            lg: `${SIDEBAR_WIDTH}px`,
          },

          // Content starts below fixed topbar.
          pt: `${TOPBAR_HEIGHT}px`,

          // Full width on mobile, remaining width on desktop.
          width: {
            xs: "100%",
            lg: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          },

          bgcolor: "#f8fafc",
          minHeight: "100vh",
          maxWidth: "100%",
          overflowX: "hidden",

          // Page components already control their own padding.
          p: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

// ============================================
// End Component
// ============================================