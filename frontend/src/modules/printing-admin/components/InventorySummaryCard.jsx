// ============================================
// ARAB UNITY SCHOOL
// Printing Management - Inventory Summary Card
//
// Purpose:
// Displays A4 and A3 paper inventory summary
// on the Printing Management Dashboard.
//
// Reusable:
// Can later be reused by:
// - Paper Inventory Page
// - Paper Purchase Module
// - Inventory Reports
// ============================================

import { Box, Typography, LinearProgress } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import DashboardCard from "../../../components/common/DashboardCard";
import { dashboardColors } from "../../../theme/dashboardColors";

// ============================================
// Component
// ============================================

export default function InventorySummaryCard({
  title = "Inventory Summary",
  subtitle = "Paper stock overview",
  items = [],
}) {
  return (
    <DashboardCard title={title} subtitle={subtitle}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {items.map((item) => {
          const percent =
            item.total > 0
              ? Math.round((item.current / item.total) * 100)
              : 0;

          const isLow = percent <= 35;

          return (
            <Box
              key={item.paperType}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${dashboardColors.border}`,
                backgroundColor: dashboardColors.cardBackground,
              }}
            >
              {/* Top row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  mb: 1.5,
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    bgcolor: isLow
                      ? dashboardColors.dangerLight
                      : dashboardColors.successLight,
                    color: isLow
                      ? dashboardColors.danger
                      : dashboardColors.success,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Inventory2OutlinedIcon sx={{ fontSize: 22 }} />
                </Box>

                {/* Paper title */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: dashboardColors.textPrimary,
                    }}
                  >
                    {item.paperType}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: dashboardColors.textSecondary,
                    }}
                  >
                    {item.current.toLocaleString()} /{" "}
                    {item.total.toLocaleString()} sheets
                  </Typography>
                </Box>

                {/* Percentage */}
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: isLow
                      ? dashboardColors.danger
                      : dashboardColors.success,
                  }}
                >
                  {percent}%
                </Typography>
              </Box>

              {/* Progress bar */}
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 8,
                  borderRadius: 99,
                  bgcolor: dashboardColors.border,

                  "& .MuiLinearProgress-bar": {
                    borderRadius: 99,
                    bgcolor: isLow
                      ? dashboardColors.danger
                      : dashboardColors.success,
                  },
                }}
              />

              {/* Bottom row */}
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: dashboardColors.textSecondary,
                  }}
                >
                  Minimum: {item.minimum.toLocaleString()}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: isLow
                      ? dashboardColors.danger
                      : dashboardColors.success,
                  }}
                >
                  {isLow ? "Low Stock" : "Good Stock"}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </DashboardCard>
  );
}