// ============================================
// ARAB UNITY SCHOOL
// Recent Approved Requests Component
// ============================================

// MUI components
import {
  Box,
  Chip,
  Typography,
} from "@mui/material";

// Reusable dashboard card
import DashboardCard from "./DashboardCard";

// HOD data
import { recentApprovedRequests } from "../../data/hodDashboardData";

export default function RecentApprovedRequests() {
  return (
    <DashboardCard title="Recent Approved Requests">
      {/* Approved request list */}
      {recentApprovedRequests.map((request) => (
        <Box
          key={request.id}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Request number and status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography fontWeight={700}>{request.id}</Typography>

            <Chip
              label={request.status}
              color="success"
              size="small"
            />
          </Box>

          {/* Teacher and department */}
          <Typography variant="body2" color="text.secondary">
            Teacher: {request.teacher}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Department: {request.department}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Date: {request.date}
          </Typography>
        </Box>
      ))}
    </DashboardCard>
  );
}