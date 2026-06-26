// ============================================
// ARAB UNITY SCHOOL
// Printing Admin Dashboard Page
//
// Purpose:
// Main dashboard for Printing Admin / Platform Admin.
//
// Access:
// - Super Admin
// - Printing Admin
//
// Architecture:
// - Page stays mostly render-only
// - Data comes from backend when available
// - Static demo data is used as fallback
// - Printing-specific widgets stay inside printing-admin module
//
// Backend:
// GET /api/printing/dashboard
// ============================================

import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import PageHeader from "../../../components/common/PageHeader";
import KpiGrid from "../../../components/common/KpiGrid";

import {
  PrintingAnalyticsRow,
  PrintingOperationsRow,
} from "../components";

import { getPrintingDashboard } from "../../../services/printingService";

import {
  defaultPrintingDashboardData,
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
  const [dashboardData, setDashboardData] = useState(
    defaultPrintingDashboardData
  );

  const [loading, setLoading] = useState(false);

  // ============================================
  // Load Dashboard Data
  // Uses backend data when available.
  // Falls back to static demo data if backend fails.
  // ============================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const data = await getPrintingDashboard();

        setDashboardData({
          stats: data?.stats || printingDashboardStats,
          printActivity: data?.printActivity || printActivityData,
          jobStatus: data?.jobStatus || printJobStatus,
          inventoryHealth: data?.inventoryHealth || inventoryHealth,
          recentJobs: data?.recentJobs || recentPrintJobs,
          topDepartments: data?.topDepartments || topPrintingDepartments,
          paperUsage: data?.paperUsage || paperUsageStatus,
          pendingActions: data?.pendingActions || printingPendingActions,
          inventorySummary: data?.inventorySummary || paperInventorySummary,
        });
      } catch (error) {
        console.error("Failed to load printing dashboard:", error);
        setDashboardData(defaultPrintingDashboardData);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

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
        subtitle={
          loading
            ? "Loading dashboard data..."
            : "Manage print jobs, paper inventory, usage, and operational alerts"
        }
      />

      {/* KPI Cards */}
      <KpiGrid stats={dashboardData.stats} />

      {/* Printing Analytics Row */}
      <PrintingAnalyticsRow
        printActivity={dashboardData.printActivity}
        jobStatus={dashboardData.jobStatus}
        inventoryHealth={dashboardData.inventoryHealth}
        recentJobs={dashboardData.recentJobs}
      />

      {/* Printing Operations Row */}
      <PrintingOperationsRow
        topDepartments={dashboardData.topDepartments}
        paperUsage={dashboardData.paperUsage}
        inventorySummary={dashboardData.inventorySummary}
        pendingActions={dashboardData.pendingActions}
      />
    </Box>
  );
}
