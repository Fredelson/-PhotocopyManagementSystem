// ============================================
// ARAB UNITY SCHOOL
// Approval History Component
// ============================================

import { Box, Chip, Typography } from "@mui/material";
import DashboardCard from "./DashboardCard";

// Temporary data
const approvalHistory = [
  {
    id: "REQ-2026-001",
    action: "Approved by HOD",
    comment: "Approved for printing.",
    approvedBy: "Primary HOD",
    date: "2026-06-06",
  },
  {
    id: "REQ-2026-002",
    action: "Forwarded to HOS",
    comment: "More than 500 sheets.",
    approvedBy: "Primary HOD",
    date: "2026-06-06",
  },
  {
    id: "REQ-2026-003",
    action: "Returned for Revision",
    comment: "Please upload the correct attachment.",
    approvedBy: "Primary HOD",
    date: "2026-06-05",
  },
];

export default function ApprovalHistory() {
  return (
    <DashboardCard title="Approval History">
      {approvalHistory.map((item) => (
        <Box
          key={item.id}
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography fontWeight={700}>{item.id}</Typography>
            <Chip label={item.action} size="small" color="primary" />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Comment: {item.comment}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            By: {item.approvedBy} • {item.date}
          </Typography>
        </Box>
      ))}
    </DashboardCard>
  );
}