// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// System Health Card
// ============================================

import { Box, LinearProgress, Typography } from "@mui/material";

export default function SuperAdminSystemHealthCard({
  label,
  value,
  color = "#16a34a",
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          mb: 0.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2">
          {label}
        </Typography>

        <Typography variant="body2" fontWeight={700}>
          {value}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 99,
          bgcolor: "#e5e7eb",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );
}