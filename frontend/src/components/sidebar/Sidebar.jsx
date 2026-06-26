// ============================================
// ARAB UNITY SCHOOL
// Shared Role-Based Sidebar
//
// Purpose:
// - Displays sidebar menu based on logged-in user role
// - Uses shared navigation config from getSidebarItemsByRole
// - Uses MUI theme colors instead of hardcoded colors
//
// Notes:
// - Old hardcoded role menu arrays were removed
// - Sidebar is now cleaner and easier to maintain
// ============================================

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";

import {
  Settings,
  Logout,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getSidebarItemsByRole } from "../../platform/navigation/sidebar/getSidebarItemsByRole";

// ============================================
// Component
// ============================================

export default function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  // Support both backend casing styles
  const role = user?.role || user?.Role;

  // Centralized sidebar config
  const menuItems = getSidebarItemsByRole(role);

  // ============================================
  // Helpers
  // ============================================

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getSettingsPath = () => {
    if (role === "SuperAdmin") return "/super-admin/settings";
    if (role === "PrintingAdmin") return "/printing/settings";
    if (role === "HOD") return "/hod/settings";
    if (role === "HOS") return "/hos/settings";
    if (role === "Admin") return "/admin/settings";

    return "/teacher/settings";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ============================================
  // Theme-based styles
  // ============================================

  const sidebarBg = `linear-gradient(
    180deg,
    ${theme.palette.primary.dark} 0%,
    ${theme.palette.primary.main} 100%
  )`;

  const activeBg = `linear-gradient(
    135deg,
    ${theme.palette.success.dark},
    ${theme.palette.success.main}
  )`;

  // ============================================
  // Render
  // ============================================

  return (
    <Box
      sx={{
        width: 240,
        height: "100%",
        color: theme.palette.common.white,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: sidebarBg,
        borderRight: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
      }}
    >
      {/* Decorative background glow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(
            circle at 20% 20%,
            ${alpha(theme.palette.success.main, 0.14)},
            transparent 35%
          )`,
          pointerEvents: "none",
        }}
      />

      {/* Main Navigation */}
      <List
        sx={{
          position: "relative",
          zIndex: 1,
          px: 1.8,
          pt: 4,
        }}
      >
        {menuItems.map((item) => {
          const active = isActiveRoute(item.path);

          return (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1.1,
                minHeight: 50,
                px: 1.8,
                color: active
                  ? theme.palette.common.white
                  : alpha(theme.palette.common.white, 0.9),
                background: active ? activeBg : "transparent",
                boxShadow: active
                  ? `0 8px 18px ${alpha(theme.palette.success.dark, 0.35)}`
                  : "none",
                transition: theme.transitions.create(
                  ["background", "transform", "box-shadow"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),

                "&:hover": {
                  background: active
                    ? activeBg
                    : alpha(theme.palette.success.main, 0.14),
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: active
                    ? theme.palette.common.white
                    : alpha(theme.palette.common.white, 0.9),
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 900 : 700,
                  noWrap: true,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Push settings/logout to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider
        sx={{
          mx: 2,
          borderColor: alpha(theme.palette.common.white, 0.16),
        }}
      />

      {/* Bottom Actions */}
      <List
        sx={{
          position: "relative",
          zIndex: 1,
          px: 1.8,
          py: 2,
        }}
      >
        {/* Settings */}
        <ListItemButton
          onClick={() => navigate(getSettingsPath())}
          sx={{
            borderRadius: 2,
            mb: 1,
            minHeight: 50,
            color: theme.palette.common.white,
            transition: theme.transitions.create(["background", "transform"], {
              duration: theme.transitions.duration.short,
            }),

            "&:hover": {
              background: alpha(theme.palette.success.main, 0.14),
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
              color: theme.palette.common.white,
            }}
          >
            <Settings />
          </ListItemIcon>

          <ListItemText
            primary="Settings"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 700,
              noWrap: true,
            }}
          />
        </ListItemButton>

        {/* Logout */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            minHeight: 50,
            color: theme.palette.common.white,
            transition: theme.transitions.create(["background", "transform"], {
              duration: theme.transitions.duration.short,
            }),

            "&:hover": {
              background: alpha(theme.palette.error.main, 0.16),
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
              color: theme.palette.common.white,
            }}
          >
            <Logout />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 700,
              noWrap: true,
            }}
          />
        </ListItemButton>
      </List>

      {/* Bottom accent bar */}
      <Box
        sx={{
          height: 4,
          width: "100%",
          bgcolor: theme.palette.success.main,
        }}
      />
    </Box>
  );
}