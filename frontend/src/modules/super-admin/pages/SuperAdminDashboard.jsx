// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Dashboard
// Phase 3 Super Admin UI Foundation
// ============================================

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";                                                                               

import usePageTitle from "../../../hooks/usePageTitle";

const kpis = [
  {
    title: "Active Modules",
    value: 8,
    icon: <AppsOutlinedIcon />,
  },
  {
    title: "Permission Rules",
    value: 42,
    icon: <SecurityOutlinedIcon />,
  },
  {
    title: "System Actions",
    value: 126,
    icon: <AdminPanelSettingsOutlinedIcon />,
  },
  {
    title: "Audit Logs Today",
    value: 18,
    icon: <HistoryOutlinedIcon />,
  },
];

export default function SuperAdminDashboard() {
  usePageTitle("AUS | Super Admin Dashboard");

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={900}>
          Super Admin Dashboard
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Control modules, permissions, menus, actions, widgets, and system settings.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        {kpis.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: "#ecfdf5",
                    color: "#047857",
                    display: "grid",
                    placeItems: "center",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>

                <Typography variant="h4" fontWeight={900}>
                  {item.value}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Foundation Notice */}
      <Card
        sx={{
          mt: 3,
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={800}>
            Platform Control Center
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This dashboard will become the main control center for the entire AUS
            Operations Platform. From here, Super Admin will manage modules,
            sidebar menus, permissions, buttons, widgets, feature flags, audit logs,
            backups, and system-wide settings.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}