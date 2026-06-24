// ============================================
// ARAB UNITY SCHOOL
// Reusable Modern KPI / Stat Card
//
// Purpose:
// Displays KPI numbers across dashboards.
//
// Used By:
// - Teacher
// - HOD
// - HOS
// - Printing Admin
// - Super Admin
// - Admin
// ============================================

import { Card, CardContent, Box, Typography } from "@mui/material";
import { dashboardColors } from "../../../../../theme/dashboardColors";

export default function StatCard({
  title,
  value,
  icon,
  color = dashboardColors.info,
}) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        background: `linear-gradient(135deg, ${dashboardColors.cardBackground} 0%, ${dashboardColors.background} 100%)`,
        border: `1px solid ${dashboardColors.border}`,
        boxShadow: `0 10px 30px ${dashboardColors.shadow}`,
        transition: "all 0.25s ease",
        overflow: "hidden",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(15,23,42,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Top Row: KPI text + icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          {/* KPI Text */}
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: dashboardColors.textSecondary,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                fontSize: 34,
                fontWeight: 900,
                color: dashboardColors.textPrimary,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* Icon Container */}
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 4,
              bgcolor: `${color}15`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,

              "& svg": {
                fontSize: 30,
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Bottom Accent Line */}
        <Box
          sx={{
            mt: 3,
            height: 5,
            borderRadius: 999,
            bgcolor: `${color}30`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: color,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}