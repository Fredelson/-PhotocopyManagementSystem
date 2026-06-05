// ============================================
// ARAB UNITY SCHOOL
// Reusable Role-Based Sidebar
// Buttons change based on user role
// ============================================

import { NavLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { navigationConfig } from "../../config/navigation";

export default function Sidebar({ role = "teacher" }) {
  const menuItems = navigationConfig[role] || navigationConfig.teacher;

  return (
    <Box
      sx={{
        width: "260px",
        minWidth: "260px",
        maxWidth: "260px",
        height: "100%",
        bgcolor: "#0F172A",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        pt: 2,
      }}
    >
      {/* Main sidebar navigation menu */}
      <Box sx={{ flexGrow: 1, px: 2 }}>
        {menuItems
          .filter((item) => item.label !== "Settings")
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                {({ isActive }) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      py: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      color: "#fff",
                      bgcolor: isActive ? "#2563EB" : "transparent",
                      "&:hover": {
                        bgcolor: isActive
                          ? "#2563EB"
                          : "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    <Icon />

                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </Box>
                )}
              </NavLink>
            );
          })}
      </Box>

      {/* Bottom settings button */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <NavLink to={`/${role}/settings`} style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                color: "#fff",
                bgcolor: isActive ? "#2563EB" : "transparent",
                "&:hover": {
                  bgcolor: isActive
                    ? "#2563EB"
                    : "rgba(255,255,255,0.08)",
                },
              }}
            >
              <SettingsIcon />

              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                Settings
              </Typography>
            </Box>
          )}
        </NavLink>
      </Box>
    </Box>
  );
}