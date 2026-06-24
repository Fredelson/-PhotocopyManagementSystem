// ============================================
// ARAB UNITY SCHOOL
// Printing Management Dashboard Page
//
// Purpose:
// Main dashboard for Printing Admin / Platform Admin.
//
// Access:
// - Super Admin
// - Printing Admin
//
// Architecture:
// Reuses Super Admin dashboard components
// and adds printing-specific widgets.
// ============================================

import { Box } from "@mui/material";

import PageHeader from "../../../components/common/PageHeader";

import DashboardKpis from "../../super-admin/components/dashboard/DashboardKpis";
import DashboardMiddleRow from "../../super-admin/components/dashboard/DashboardMiddleRow";
import TopPrintRequests from "../../super-admin/components/dashboard/TopPrintRequests";
import ModuleStatusChart from "../../super-admin/components/dashboard/ModuleStatusChart";
import PendingApprovals from "../../super-admin/components/dashboard/PendingApprovals";

import InventorySummaryCard from "../components/InventorySummaryCard";

import {
  printingDashboardStats,
  printActivityData,
  printJobStatus,
  inventoryHealth,
  recentPrintJobs,
  topPrintingDepartments,
  paperUsageStatus,
  printingPendingActions,
  paperInventorySummary,
} from "../data/printingDashboardData";

// ============================================
// Component
// ============================================

export default function PrintingAdminDashboard() {
  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        bgcolor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <PageHeader
        title="Printing Management"
        subtitle="Manage print jobs, paper inventory, usage, and operational alerts"
      />

      {/* KPI Cards */}
      <DashboardKpis stats={printingDashboardStats} />

      {/* 
        Main Analytics Row:
        Print Activity | Job Status | Inventory Health | Recent Print Jobs
      */}
      <DashboardMiddleRow
        platformActivityData={printActivityData}
        moduleStatusData={printJobStatus}
        systemHealthData={inventoryHealth}
        recentActivityData={recentPrintJobs}
      />

      {/* 
        Printing Bottom Row:
        Top Departments | Paper Usage | Inventory Summary | Inventory Alerts
      */}
      <Box
        sx={{
          mt: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1,
          alignItems: "stretch",
        }}
      >
        {/* Top Departments */}
        <TopPrintRequests
          title="Top Departments"
          subtitle="This Month"
          items={topPrintingDepartments}
        />

        {/* Paper Usage */}
        <ModuleStatusChart
          title="Paper Usage"
          subtitle="Current paper consumption"
          data={paperUsageStatus}
        />

        {/* Inventory Summary */}
        <InventorySummaryCard items={paperInventorySummary} />

        {/* Inventory Alerts */}
        <PendingApprovals
          title="Inventory Alerts"
          subtitle="Items requiring attention"
          items={printingPendingActions}
        />
      </Box>
    </Box>
  );
}