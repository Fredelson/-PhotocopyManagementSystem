// ============================================
// ARAB UNITY SCHOOL
// Printing Analytics Row
//
// Purpose:
// Main analytics row for Printing Admin.
// Wraps the shared DashboardMiddleRow.
// ============================================

import DashboardMiddleRow from "../../../components/layout/DashboardMiddleRow";

export default function PrintingAnalyticsRow({
  printActivity,
  jobStatus,
  inventoryHealth,
  recentJobs,
}) {
  return (
    <DashboardMiddleRow
      platformActivityData={printActivity}
      moduleStatusData={jobStatus}
      systemHealthData={inventoryHealth}
      recentActivityData={recentJobs}
    />
  );
}
