// ============================================
// ARAB UNITY SCHOOL
// Reusable Alert Item
//
// Purpose:
// Displays one system alert row.
//
// Reusable:
// - Super Admin
// - Security Center
// - Audit Dashboard
// - Monitoring Dashboard
// ============================================

import { Box, Typography } from "@mui/material";
import { dashboardColors } from "../../../../theme/dashboardColors";

export default function AlertItem({
  title,
  severity,
  time,
}) {
  const colorMap = {
    success: dashboardColors.success,
    warning: dashboardColors.warning,
    danger: dashboardColors.danger,
    info: dashboardColors.info,
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.25,
        alignItems: "flex-start",
        py: 1,
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          mt: "6px",
          bgcolor: colorMap[severity],
          flexShrink: 0,
        }}
      />

      <Box>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: dashboardColors.textPrimary,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 11.5,
            color: dashboardColors.textSecondary,
          }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
}