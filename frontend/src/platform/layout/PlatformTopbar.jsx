// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Platform Topbar
//
// Purpose:
// Shared responsive topbar for platform roles.
//
// Responsive Behavior:
// - Desktop:
//   Shows logo, title, search, actions, and user info.
//
// - Tablet / Mobile:
//   Shows hamburger button, smaller logo, title,
//   notification, and avatar.
// ============================================

import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import { useAuth } from "../../context/AuthContext";

// ============================================
// Helper: Topbar Text By Role
// ============================================

const getTopbarContext = (role) => {
  switch (role) {
    case "SuperAdmin":
      return {
        title: "Dashboard",
        subtitle: "Super Admin Control Center",
      };

    case "PrintingAdmin":
      return {
        title: "Printing Management",
        subtitle: "Operations Control Center",
      };

    default:
      return {
        title: "Dashboard",
        subtitle: "Operations Platform",
      };
  }
};

// ============================================
// Component
// ============================================

export default function PlatformTopbar({
  height = 78,
  onMenuClick,
}) {
  const { user } = useAuth();

  const role = user?.role || user?.Role;
  const context = getTopbarContext(role);

  const displayName =
    user?.fullName ||
    user?.FullName ||
    "User";

  const displayRole =
    user?.displayRole ||
    user?.DisplayRole ||
    (role === "SuperAdmin"
      ? "Super Administrator"
      : role === "PrintingAdmin"
      ? "Printing Administrator"
      : role || "User");

  const initial =
    displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <Box
      sx={{
        height,
        px: {
          xs: 1,
          sm: 1.5,
          md: 3,
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        color: "#fff",
        background:
          "linear-gradient(90deg, #008a3d 0%, #003b46 38%, #061B52 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",

        // Fixed so content always starts below it.
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,

        // Higher than drawer backdrop/top layout.
        zIndex: 1300,

        overflow: "hidden",
      }}
    >
      {/* Left Area */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: {
            xs: 0.6,
            sm: 1,
            md: 2,
          },
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {/* Hamburger Button: visible below desktop */}
        <IconButton
          onClick={onMenuClick}
          sx={{
            color: "#fff",
            display: {
              xs: "inline-flex",
              lg: "none",
            },
            flexShrink: 0,
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>

        {/* School Logo */}
        <Box
          component="img"
          src="/arab-unity-logo.jpg"
          alt="Arab Unity School Logo"
          sx={{
            width: {
              xs: 56,
              sm: 72,
              md: 100,
            },
            height: {
              xs: 42,
              sm: 50,
              md: 60,
            },
            objectFit: "contain",
            bgcolor: "#fff",
            borderRadius: 2,
            p: 0.5,
            flexShrink: 0,
          }}
        />

        {/* Page Title */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            fontWeight={900}
            sx={{
              fontSize: {
                xs: 13.5,
                sm: 16,
                md: 18,
              },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {context.title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              opacity: 0.75,
              display: {
                xs: "none",
                sm: "block",
              },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {context.subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Search Box: hidden on small screens */}
      <Box
        sx={{
          width: {
            md: 280,
            xl: 420,
          },
          height: 44,
          px: 2,
          display: {
            xs: "none",
            md: "flex",
          },
          alignItems: "center",
          gap: 1,
          borderRadius: 3,
          bgcolor: "rgba(6, 27, 82, 0.35)",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(10px)",
          flexShrink: 1,
        }}
      >
        <InputBase
          fullWidth
          placeholder="Search anything..."
          sx={{
            color: "#fff",
            fontSize: 14,
            "& input::placeholder": {
              color: "rgba(255,255,255,0.72)",
              opacity: 1,
            },
          }}
        />

        <SearchOutlinedIcon sx={{ color: "#fff" }} />
      </Box>

      {/* Right Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: {
            xs: 0,
            sm: 0.5,
            md: 1,
          },
          flexShrink: 0,
        }}
      >
        {/* Notifications */}
        <IconButton sx={{ color: "#fff" }}>
          <Badge badgeContent={12} color="error">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>

        {/* Mail: hidden on extra small */}
        <IconButton
          sx={{
            color: "#fff",
            display: {
              xs: "none",
              sm: "inline-flex",
            },
          }}
        >
          <Badge badgeContent={5} color="error">
            <MailOutlineOutlinedIcon />
          </Badge>
        </IconButton>

        {/* Settings: desktop/tablet only */}
        <IconButton
          sx={{
            color: "#fff",
            display: {
              xs: "none",
              md: "inline-flex",
            },
          }}
        >
          <SettingsOutlinedIcon />
        </IconButton>

        {/* Help: desktop/tablet only */}
        <IconButton
          sx={{
            color: "#fff",
            display: {
              xs: "none",
              md: "inline-flex",
            },
          }}
        >
          <HelpOutlineOutlinedIcon />
        </IconButton>

        {/* User Profile */}
        <Box
          sx={{
            ml: {
              xs: 0.25,
              md: 1,
            },
            pl: {
              xs: 0,
              md: 1.5,
            },
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderLeft: {
              xs: "none",
              md: "1px solid rgba(255,255,255,0.18)",
            },
          }}
        >
          <Avatar
            sx={{
              width: {
                xs: 36,
                md: 42,
              },
              height: {
                xs: 36,
                md: 42,
              },
              bgcolor: "#fff",
              color: "#061B52",
              fontWeight: 900,
              border: "2px solid rgba(255,255,255,0.45)",
            }}
          >
            {initial}
          </Avatar>

          {/* User text only on large screens */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography fontWeight={900} fontSize={13.5}>
              {displayName}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {displayRole}
            </Typography>
          </Box>

          <KeyboardArrowDownOutlinedIcon
            sx={{
              opacity: 0.8,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

// ============================================
// End Component
// ============================================