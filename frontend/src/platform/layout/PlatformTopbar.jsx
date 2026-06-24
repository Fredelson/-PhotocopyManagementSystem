// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Platform Topbar
//
// Purpose:
// Shared topbar for Super Admin, Printing Admin,
// and future platform roles.
//
// Important:
// Do not hardcode user name or role here.
// User details come from AuthContext.
// ============================================

import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import { useAuth } from "../../context/AuthContext";

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

export default function PlatformTopbar() {
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
        height: 78,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
        background:
          "linear-gradient(90deg, #008a3d 0%, #003b46 38%, #061B52 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left Area */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          component="img"
          src="/arab-unity-logo.jpg"
          alt="Arab Unity School Logo"
          sx={{
            width: 100,
            height: 60,
            objectFit: "contain",
            bgcolor: "#fff",
            borderRadius: 2,
            p: 0.5,
          }}
        />

        <Box>
          <Typography fontWeight={900} fontSize={18}>
            {context.title}
          </Typography>

          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            {context.subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Search */}
      <Box
        sx={{
          width: 420,
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton sx={{ color: "#fff" }}>
          <Badge badgeContent={12} color="error">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton sx={{ color: "#fff" }}>
          <Badge badgeContent={5} color="error">
            <MailOutlineOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton sx={{ color: "#fff" }}>
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton sx={{ color: "#fff" }}>
          <HelpOutlineOutlinedIcon />
        </IconButton>

        {/* User Profile */}
        <Box
          sx={{
            ml: 1,
            pl: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            borderLeft: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#fff",
              color: "#061B52",
              fontWeight: 900,
              border: "2px solid rgba(255,255,255,0.45)",
            }}
          >
            {initial}
          </Avatar>

          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography fontWeight={900} fontSize={13.5}>
              {displayName}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {displayRole}
            </Typography>
          </Box>

          <KeyboardArrowDownOutlinedIcon sx={{ opacity: 0.8 }} />
        </Box>
      </Box>
    </Box>
  );
}