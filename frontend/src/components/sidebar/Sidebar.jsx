// ============================================
// ARAB UNITY SCHOOL
// Teacher Sidebar
// Navy + AUS Green Theme
// Exact active route highlight
// ============================================

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  Dashboard,
  Description,
  AddCircle,
  AttachFile,
  Assessment,
  History,
  Settings,
  Logout,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Theme colors
const NAVY = "#071B4D";
const NAVY_DARK = "#041338";
const GREEN = "#2E8B3C";
const GREEN_LIGHT = "#4CAF50";
const WHITE = "#FFFFFF";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Teacher menu
  const menuItems = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      path: "/teacher/dashboard",
    },
    {
      label: "My Requests",
      icon: <Description />,
      path: "/teacher/my-requests",
    },
    {
      label: "Create Request",
      icon: <AddCircle />,
      path: "/teacher/create-request",
    },
    {
      label: "Attachments",
      icon: <AttachFile />,
      path: "/teacher/attachments",
    },
    {
      label: "Reports",
      icon: <Assessment />,
      path: "/teacher/reports",
    },
    {
      label: "History",
      icon: <History />,
      path: "/teacher/history",
    },
  ];

  // Exact active checker
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 240,
        height: "100%",
        color: WHITE,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Soft green glow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(76,175,80,0.14), transparent 35%)",
          pointerEvents: "none",
        }}
      />

      {/* Main menu */}
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
                color: active ? WHITE : "rgba(255,255,255,0.9)",
                background: active
                  ? `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`
                  : "transparent",
                boxShadow: active
                  ? "0 8px 18px rgba(46,139,60,0.35)"
                  : "none",
                transition: "all 0.2s ease",

                "&:hover": {
                  background: active
                    ? `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`
                    : "rgba(76,175,80,0.14)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: active ? WHITE : "rgba(255,255,255,0.9)",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 900 : 700,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2, borderColor: "rgba(255,255,255,0.16)" }} />

      {/* Bottom actions */}
      <List sx={{ position: "relative", zIndex: 1, px: 1.8, py: 2 }}>
        <ListItemButton
          onClick={() => navigate("/settings")}
          sx={{
            borderRadius: 2,
            mb: 1,
            minHeight: 50,
            color: WHITE,
            transition: "all 0.2s ease",

            "&:hover": {
              background: "rgba(76,175,80,0.14)",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: WHITE }}>
            <Settings />
          </ListItemIcon>

          <ListItemText
            primary="Settings"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 700,
            }}
          />
        </ListItemButton>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            minHeight: 50,
            color: WHITE,
            transition: "all 0.2s ease",

            "&:hover": {
              background: "rgba(239,68,68,0.16)",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: WHITE }}>
            <Logout />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 700,
            }}
          />
        </ListItemButton>
      </List>

      <Box sx={{ height: 4, width: "100%", bgcolor: GREEN_LIGHT }} />
    </Box>
  );
}