// ============================================
// ARAB UNITY SCHOOL
// Super Admin Dashboard Bottom Row
//
// Purpose:
// Displays secondary analytics cards below
// the All Modules section.
//
// Layout:
// Top Print Requests | Tickets By Status | Asset Summary | Pending Approvals
// ============================================

import { Box } from "@mui/material";

import TopPrintRequests from "./TopPrintRequests";
import TicketsByStatus from "./TicketsByStatus";
import AssetSummary from "./AssetSummary";
import PendingApprovals from "./PendingApprovals";

export default function DashboardBottomRow({
  topPrintRequests = [],
  ticketStatus = [],
  assetSummary = [],
  pendingApprovals = [],
}) {
  return (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(4, minmax(0, 1fr))",
        },
        gap: 1.5,

        // Keep cards aligned in the same row
        alignItems: "stretch",

        // Force every direct card wrapper to share same height
        "& > *": {
          height: "100%",
        },
      }}
    >
      <TopPrintRequests items={topPrintRequests} />
      <TicketsByStatus data={ticketStatus} />
      <AssetSummary data={assetSummary} />
      <PendingApprovals subtitle="Awaiting action" items={pendingApprovals} />
    </Box>
  );
}