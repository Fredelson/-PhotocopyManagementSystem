// ============================================
// ARAB UNITY SCHOOL
// Reusable Dashboard Card
//
// Purpose:
// Shared card wrapper for dashboard sections,
// summaries, forms, and table containers.
//
// Used By:
// - Super Admin
// - Printing Admin
// - HOD
// - HOS
// - Admin
// - Teacher
// ============================================

import { Card, CardContent, Typography, Box } from "@mui/material";
import { dashboardColors } from "../../theme/dashboardColors";

export default function DashboardCard({
  title,
  subtitle,
  action,
  children,
  sx = {},
  contentSx = {},
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${dashboardColors.border}`,
        background: `linear-gradient(180deg, ${dashboardColors.cardBackground} 0%, ${dashboardColors.background} 100%)`,
        boxShadow: `0 14px 35px ${dashboardColors.shadow}`,
        overflow: "hidden",
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5, ...contentSx }}>
        {/* Card Header */}
        {(title || subtitle || action) && (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            {/* Title and subtitle */}
            <Box>
              {title && (
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: dashboardColors.navy,
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography
                  sx={{
                    fontSize: 13,
                    color: dashboardColors.textSecondary,
                    mt: 0.3,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            {/* Optional action */}
            {action && <Box>{action}</Box>}
          </Box>
        )}

        {/* Card Body */}
        {children}
      </CardContent>
    </Card>
  );
}