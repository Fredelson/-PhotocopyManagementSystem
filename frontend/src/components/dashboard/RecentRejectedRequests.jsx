// ============================================
// ARAB UNITY SCHOOL
// Recent Rejected Requests Component
// ============================================

// MUI components
import { Box, Chip, Typography } from "@mui/material";

// Reusable dashboard card
import DashboardCard from "./DashboardCard";

// Temporary rejected requests data
const recentRejectedRequests = [
  {
    id: "REQ-2026-201",
    teacher: "Ms. Lina",
    department: "Primary",
    reason: "Incorrect attachment uploaded.",
    rejectedBy: "Primary HOD",
    date: "2026-06-04",
  },
  {
    id: "REQ-2026-202",
    teacher: "Mr. Omar",
    department: "Secondary",
    reason: "Number of copies needs confirmation.",
    rejectedBy: "Secondary HOD",
    date: "2026-06-03",
  },
  {
    id: "REQ-2026-203",
    teacher: "Ms. Sara",
    department: "FS",
    reason: "Request details are incomplete.",
    rejectedBy: "FS HOD",
    date: "2026-06-02",
  },
];

export default function RecentRejectedRequests() {
  return (
    <DashboardCard title="Recent Rejected Requests">
      {recentRejectedRequests.map((request) => (
        <Box
          key={request.id}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Request ID and status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography fontWeight={700}>{request.id}</Typography>

            <Chip label="Rejected" color="error" size="small" />
          </Box>

          {/* Rejected request details */}
          <Typography variant="body2" color="text.secondary">
            Teacher: {request.teacher}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Department: {request.department}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Reason: {request.reason}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            By: {request.rejectedBy} • {request.date}
          </Typography>
        </Box>
      ))}
    </DashboardCard>
  );
}