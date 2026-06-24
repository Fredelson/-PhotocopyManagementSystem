// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Sidebar
// Phase 3 Super Admin UI Foundation
// ============================================
//
// Description:
// Dedicated sidebar for Super Admin.
//
// Responsibilities:
// - Render Super Admin navigation
// - Highlight active route
// - Centralize navigation logic
// - Use sidebarConfig.js as source
//
// Future Enhancements:
// - Dynamic menu loading
// - Permission filtering
// - Feature flag filtering
// - Collapsible sidebar
// - Mobile drawer
//
// ============================================

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import { NavLink } from "react-router-dom";

import { superAdminSidebarItems } from "../../../config/sidebarConfig.jsx";

// ============================================
// Component
// ============================================

export default function SuperAdminSidebar({
  width = 280,
}) {
  return (
    <Box
      sx={{
        width,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,

        bgcolor: "#061B52",
        color: "#fff",

        borderRight: "1px solid rgba(255,255,255,0.08)",

        overflowY: "auto",
      }}
    >
      {/* ========================================
          Logo Area
      ======================================== */}

      <Box
        sx={{
          p: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{
            color: "#4CAF50",
          }}
        >
          AUS
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
          }}
        >
          Operations Platform
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      />

      {/* ========================================
          Navigation
      ======================================== */}

      <List
        sx={{
          p: 2,
        }}
      >
        {superAdminSidebarItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 3,
              mb: 1,

              "&.active": {
                bgcolor: "#4CAF50",

                "&:hover": {
                  bgcolor: "#43A047",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#fff",
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}