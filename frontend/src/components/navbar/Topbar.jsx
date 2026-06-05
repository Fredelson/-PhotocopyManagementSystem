import {
  AppBar,
  Toolbar,
  TextField,
  Box,
  Avatar,
  Badge,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Topbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #E5E7EB",
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Logo + School Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 44,
                height: 44,
                background:
                  "linear-gradient(135deg,#FF8A00,#2563EB)",
                fontWeight: 700,
              }}
            >
              AUS
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.1,
                }}
              >
                ARAB UNITY SCHOOL
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#64748B",
                }}
              >
                Photocopy Management System
              </Typography>
            </Box>
          </Box>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search requests, documents, attachments..."
            sx={{
              width: 420,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Theme */}
          <IconButton>
            <LightModeIcon />
          </IconButton>

          {/* Notification */}
          <IconButton>
            <Badge
              badgeContent={8}
              color="error"
            >
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          {/* User */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <Avatar
              src=""
              sx={{
                width: 42,
                height: 42,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                Ahmed Khan
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#2563EB",
                }}
              >
                Teacher
              </Typography>
            </Box>

            <KeyboardArrowDownIcon />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}