// ============================================
// ARAB UNITY SCHOOL
// Reusable Page Header
// Used by Teacher, HOD, HOS, Admin dashboards
// ============================================

import { Box, Typography } from "@mui/material";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 4,
        gap: 2,
      }}
    >
      {/* Page title and subtitle */}
      <Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#0F172A",
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              color: "#64748B",
              fontSize: "0.95rem",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Right-side action, example: Date Filter */}
      {action && <Box>{action}</Box>}
    </Box>
  );
}