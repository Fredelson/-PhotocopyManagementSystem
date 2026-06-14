// ============================================
// ARAB UNITY SCHOOL
// Reusable Topbar
// Navy + AUS Green Theme
// Logo redirects to current user's dashboard
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Avatar,
  Badge,
  IconButton,
  Typography,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../context/AuthContext";

const NAVY = "#071B4D";
const NAVY_DARK = "#041338";
const GREEN = "#2E8B3C";
const GREEN_LIGHT = "#4CAF50";
const WHITE = "#FFFFFF";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const userName = user?.fullName || user?.FullName || "Unknown User";
  const role = user?.displayRole || user?.role || user?.Role || "Guest";

  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  // Role-based dashboard route
  const goToDashboard = () => {
    const roleValue = role.toLowerCase();

    if (roleValue.includes("teacher")) navigate("/teacher/dashboard");
    else if (roleValue.includes("hod")) navigate("/hod/dashboard");
    else if (roleValue.includes("hos")) navigate("/hos/dashboard");
    else if (roleValue.includes("printing")) navigate("/printing/dashboard");
    else navigate("/teacher/dashboard");
  };

  // Role-based profile route
  const goToProfile = () => {
    handleMenuClose();

    const roleValue = role.toLowerCase();

    if (roleValue.includes("teacher")) navigate("/teacher/profile");
    else if (roleValue.includes("hod")) navigate("/hod/profile");
    else if (roleValue.includes("hos")) navigate("/hos/profile");
    else if (roleValue.includes("printing")) navigate("/printing/profile");
    else navigate("/teacher/profile");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "86px",
        background: `linear-gradient(90deg, ${NAVY_DARK}, ${NAVY})`,
        color: WHITE,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 3 },
        zIndex: 2000,
        boxShadow: "0 4px 18px rgba(4,19,56,0.25)",
      }}
    >
      {/* Left section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: "flex", md: "none" },
            color: WHITE,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
              color: GREEN_LIGHT,
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and title */}
        <Box
          onClick={goToDashboard}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            borderRadius: 3,
            px: 1,
            py: 0.7,
            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: "rgba(255,255,255,0.06)",
            },
          }}
        >
          <Box
            sx={{
              width: 76,
              height: 76,
              bgcolor: WHITE,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0.5,
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/arab-unity-logo.png"
              alt="Arab Unity School"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              sx={{
                fontSize: { sm: 21, md: 23 },
                fontWeight: 900,
                color: GREEN_LIGHT,
                lineHeight: 1.05,
                letterSpacing: "0.4px",
              }}
            >
              ARAB UNITY SCHOOL
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                fontSize: { sm: 13, md: 15 },
                color: WHITE,
                fontWeight: 600,
              }}
            >
              Photocopy Management System
            </Typography>
          </Box>
        </Box>

        {/* Search bar */}
        <TextField
          size="small"
          placeholder="Search requests..."
          sx={{
            width: 420,
            ml: { md: 4 },
            display: { xs: "none", md: "block" },

            "& .MuiOutlinedInput-root": {
              height: 46,
              borderRadius: 3,
              color: WHITE,
              bgcolor: "rgba(255,255,255,0.08)",

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.14)",
              },

              "&:hover fieldset": {
                borderColor: GREEN_LIGHT,
              },

              "&.Mui-focused fieldset": {
                borderColor: GREEN_LIGHT,
                borderWidth: "1.5px",
              },
            },

            "& input::placeholder": {
              color: "rgba(255,255,255,0.75)",
              opacity: 1,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: WHITE }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Right section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          sx={{
            color: WHITE,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
              color: GREEN_LIGHT,
            },
          }}
        >
          <LightModeIcon />
        </IconButton>

        <IconButton
          sx={{
            color: WHITE,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
              color: GREEN_LIGHT,
            },
          }}
        >
          <Badge badgeContent={8} color="success">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        {/* Profile */}
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            cursor: "pointer",
            borderRadius: 3,
            px: 1,
            py: 0.8,

            "&:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 54,
              height: 54,
              bgcolor: WHITE,
              color: GREEN,
              fontWeight: 900,
              fontSize: 20,
              border: `2px solid ${GREEN_LIGHT}`,
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: GREEN_LIGHT }}>
              {userName}
            </Typography>

            <Typography sx={{ fontSize: 13, color: WHITE, fontWeight: 600 }}>
              {role}
            </Typography>
          </Box>

          <KeyboardArrowDownIcon sx={{ display: { xs: "none", md: "block" } }} />
        </Box>

        {/* Dropdown */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={800}>{userName}</Typography>
            <Typography fontSize={13} color={GREEN}>
              {role}
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={goToProfile}>
            <PersonIcon sx={{ mr: 1.5, color: GREEN }} />
            My Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/settings");
            }}
          >
            <SettingsIcon sx={{ mr: 1.5, color: GREEN }} />
            Settings
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LogoutIcon sx={{ mr: 1.5 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}