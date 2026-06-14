// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard
// Request Status Overview Component
// Connected to live KPI data
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";

// ============================================
// Status Overview Component
// ============================================

export default function StatusOverview({ kpis }) {
  // Total requests from backend KPI
  const total = kpis?.totalRequests || 0;

  // Live status data
  const requestStatusData = [
    {
      status: "Pending",
      count: kpis?.pendingRequests || 0,
      color: "#F59E0B",
    },
    {
      status: "Approved",
      count: kpis?.approvedRequests || 0,
      color: "#22C55E",
    },
    {
      status: "Rejected",
      count: kpis?.rejectedRequests || 0,
      color: "#EF4444",
    },
  ];

  return (
    <Card
      sx={{
        height: "100%",
        minWidth: 0,
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Request Status Overview
        </Typography>

        {requestStatusData.map((item) => {
          const percentage =
            total > 0
              ? Math.round((item.count / total) * 100)
              : 0;

          return (
            <Box key={item.status} mb={2.5}>
              <Box
                display="flex"
                justifyContent="space-between"
                mb={0.8}
              >
                <Typography variant="body2">
                  {item.status}
                </Typography>

                <Typography variant="body2" fontWeight={700}>
                  {item.count}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}