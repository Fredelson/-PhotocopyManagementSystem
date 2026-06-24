// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Dashboard
// Phase 3 Super Admin UI Foundation
// Refactored to use reusable SuperAdminStatCard
// and SuperAdminPageHeader
// ============================================

import { Box, Grid, Typography } from "@mui/material";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

import usePageTitle from "../../../hooks/usePageTitle";
import SuperAdminStatCard from "../../../components/superadmin/SuperAdminStatCard";
import SuperAdminPageHeader from "../../../components/superadmin/SuperAdminPageHeader";
import SuperAdminDashboardCard from "../../../components/superadmin/SuperAdminDashboardCard";
import SuperAdminModuleCard from "../../../components/superadmin/SuperAdminModuleCard";
import { moduleCards } from "../data/superAdminDashboardData.jsx";
import SuperAdminSystemHealthCard from "../../../components/superadmin/SuperAdminSystemHealthCard";

// ============================================
// Temporary KPI Data
// Later this can come from backend API
// ============================================

const kpis = [
  {
    title: "Active Modules",
    value: 8,
    icon: <AppsOutlinedIcon />,
    change: "100%",
    subtitle: "Enabled",
    bg: "#ecfdf5",
    color: "#047857",
  },
  {
    title: "Permission Rules",
    value: 42,
    icon: <SecurityOutlinedIcon />,
    change: "+6",
    subtitle: "Updated this month",
    bg: "#eff6ff",
    color: "#1d4ed8",
  },
  {
    title: "System Actions",
    value: 126,
    icon: <AdminPanelSettingsOutlinedIcon />,
    change: "+12",
    subtitle: "This week",
    bg: "#fff7ed",
    color: "#ea580c",
  },
  {
    title: "Audit Logs Today",
    value: 18,
    icon: <HistoryOutlinedIcon />,
    change: "+4",
    subtitle: "Today",
    bg: "#f5f3ff",
    color: "#7c3aed",
  },
];

export default function SuperAdminDashboard() {
  usePageTitle("AUS | Super Admin Dashboard");

  return (
    <Box>
      {/* Page Header */}
      <SuperAdminPageHeader
        title="Super Admin Dashboard"
        subtitle="Control modules, permissions, menus, actions, widgets, and system settings."
      />

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        {kpis.map((item) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={item.title}>
            <SuperAdminStatCard
              title={item.title}
              value={item.value}
              icon={item.icon}
              change={item.change}
              subtitle={item.subtitle}
              bg={item.bg}
              color={item.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Foundation Notice */}
      <SuperAdminDashboardCard title="Platform Control Center">
        <Typography variant="body2" color="text.secondary">
          This dashboard will become the main control center for the entire
          AUS Operations Platform. From here, Super Admin will manage modules,
          sidebar menus, permissions, buttons, widgets, feature flags, audit
          logs, backups, and system-wide settings.
        </Typography>
      </SuperAdminDashboardCard>

      <Box sx={{ mt: 3 }}>
        <SuperAdminDashboardCard title="All Modules">
          <Grid container spacing={2}>
            {moduleCards.map((module) => (
              <Grid item xs={12} sm={6} md={3} key={module.title}>
                <SuperAdminModuleCard
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  status={module.status}
                  color={module.color}
                />
              </Grid>
            ))}
          </Grid>
        </SuperAdminDashboardCard>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SuperAdminDashboardCard title="System Health">

              <SuperAdminSystemHealthCard
                label="Server Health"
                value={98}
                color="#16a34a"
              />

              <SuperAdminSystemHealthCard
                label="Database Health"
                value={96}
                color="#2563eb"
              />

              <SuperAdminSystemHealthCard
                label="Storage Usage"
                value={72}
                color="#ea580c"
              />

              <SuperAdminSystemHealthCard
                label="Backup Status"
                value={100}
                color="#7c3aed"
              />

            </SuperAdminDashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SuperAdminDashboardCard title="Quick Summary">

              <Typography variant="body2" color="text.secondary">
                Total Users: 70
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Active Roles: 8
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Enabled Modules: 8
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Pending Approvals: 12
              </Typography>

            </SuperAdminDashboardCard>
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
}