// ============================================
// ARAB UNITY SCHOOL
// Printing Operations Row
//
// Purpose:
// Displays Printing Admin bottom dashboard row.
//
// Contains:
// - Top Departments
// - Paper Usage
// - Inventory Summary
// - Inventory Alerts
// ============================================

import { Box } from "@mui/material";

import TopPrintRequests from "../../../components/dashboard/TopPrintRequests";
import ModuleStatusChart from "../../../components/charts/ModuleStatusChart";
import PendingApprovals from "../../../components/dashboard/PendingApprovals";

import InventorySummaryCard from "./InventorySummaryCard";

// ============================================
// Component
// ============================================

export default function PrintingOperationsRow({
  topDepartments = [],
  paperUsage = [],
  inventorySummary = [],
  pendingActions = [],
}) {
  return (
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
      <TopPrintRequests
        title="Top Departments"
        subtitle="This Month"
        items={topDepartments}
      />

      <ModuleStatusChart
        title="Paper Usage"
        subtitle="Current paper consumption"
        data={paperUsage}
      />

      <InventorySummaryCard items={inventorySummary} />

      <PendingApprovals
        title="Inventory Alerts"
        subtitle="Items requiring attention"
        items={pendingActions}
      />
    </Box>
  );
}