// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Coming Soon Page
//
// Purpose:
// - Temporary reusable placeholder for planned modules
// - Prevents sidebar links from redirecting to login
// - Later replaced by real module pages connected to backend
// ============================================

import { Box, Typography } from "@mui/material";

import SuperAdminPageHeader from "../../../components/superadmin/SuperAdminPageHeader";
import SuperAdminDashboardCard from "../../../components/superadmin/SuperAdminDashboardCard";

export default function SuperAdminComingSoon({ title }) {
  return (
    <Box>
      <SuperAdminPageHeader
        title={title}
        subtitle="This module is planned for the AUS Operations Platform."
      />

      <SuperAdminDashboardCard title="Coming Soon">
        <Typography variant="body2" color="text.secondary">
          This page is currently a placeholder. Later, this module will be
          connected to backend permissions, reports, workflows, and live data.
        </Typography>
      </SuperAdminDashboardCard>
    </Box>
  );
}