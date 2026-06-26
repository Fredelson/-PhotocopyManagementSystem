// ============================================
// ARAB UNITY SCHOOL
// Super Admin Dashboard Page
//
// Purpose:
// Main render-only dashboard page.
//
// Important:
// Dashboard data should stay inside:
// src/modules/super-admin/data/superAdminDashboardData.jsx
// ============================================

import { Box } from "@mui/material";

import AllModules from "../../../components/dashboard/AllModules";
import KpiGrid from "../../../components/common/KpiGrid";

import DashboardHeader from "../../../components/layout/DashboardHeader";
import DashboardMiddleRow from "../../../components/layout/DashboardMiddleRow";
import DashboardBottomRow from "../../../components/layout/DashboardBottomRow";

import {
  dashboardStats,
  platformActivityData,
  moduleStatus,
  systemHealth,
  recentActivities,
  modulesOverview,
  pendingApprovals,
  topPrintRequests,
  ticketStatus,
  assetSummary,
} from "../data/superAdminDashboardData";

// ============================================
// Component
// ============================================

export default function SuperAdminDashboard() {
  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        bgcolor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <DashboardHeader />

      {/* KPI Cards */}
      <KpiGrid stats={dashboardStats} />

      {/* Platform Analytics */}
      <DashboardMiddleRow
        platformActivityData={platformActivityData}
        moduleStatusData={moduleStatus}
        systemHealthData={systemHealth}
        recentActivityData={recentActivities}
      />

      {/* Platform Modules */}
      <AllModules modules={modulesOverview} />

      {/* Bottom Dashboard Row */}
      <DashboardBottomRow
        topPrintRequests={topPrintRequests}
        ticketStatus={ticketStatus}
        assetSummary={assetSummary}
        pendingApprovals={pendingApprovals}
      />
    </Box>
  );
}
