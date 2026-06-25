// ============================================
// ARAB UNITY SCHOOL
// Platform Sidebar
//
// Purpose:
// Shared desktop sidebar for platform roles.
// Mobile drawer can be added later.
// ============================================

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getSidebarItemsByRole } from "../navigation/sidebar/getSidebarItemsByRole";

export default function PlatformSidebar({ width = 340, topOffset = 78 }) {
  const { user } = useAuth();

  const role = user?.role || user?.Role;
  const sidebarSections = getSidebarItemsByRole(role);

  return (
    <Box
      sx={{
        width,
        height: `calc(100vh - ${topOffset}px)`,
        position: "fixed",
        left: 0,
        top: `${topOffset}px`,
        bgcolor: "#061B52",
        color: "#fff",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 15,
      }}
    >
      <Box sx={{ px: 2.5, pt: 2, pb: 2 }}>
        {sidebarSections.map((section) => (
          <Box key={section.title} sx={{ mb: 2.4 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                px: 2,
                mb: 0.9,
                color: "rgba(255,255,255,0.42)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 0.9,
              }}
            >
              {section.title}
            </Typography>

            <List disablePadding>
              {section.items.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    minHeight: 46,
                    borderRadius: 2.8,
                    mb: 0.45,
                    px: 2,
                    color: "rgba(255,255,255,0.78)",
                    transition: "all 0.2s ease",

                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: "#fff",
                    },

                    "&.active": {
                      bgcolor: "#4CAF50",
                      color: "#fff",
                      boxShadow: "0 10px 24px rgba(76,175,80,0.25)",

                      "& .MuiListItemIcon-root": {
                        color: "#fff",
                      },

                      "&:hover": {
                        bgcolor: "#43A047",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 44,

                      "& svg": {
                        fontSize: 21,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14.5,
                      fontWeight: 750,
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
}