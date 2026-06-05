// ============================================
// ARAB UNITY SCHOOL
// Reusable Dashboard Card
// Used for dashboard sections, summaries, forms, and tables
// ============================================

import { Card, CardContent, Typography, Box } from "@mui/material";

export default function DashboardCard({
  title,
  subtitle,
  action,
  children,
  sx = {},
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        ...sx,
      }}
    >
      <CardContent>
        {(title || subtitle || action) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
              gap: 2,
            }}
          >
            <Box>
              {title && (
                <Typography variant="h6" fontWeight={700}>
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: 13,
                    mt: 0.5,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            {action && <Box>{action}</Box>}
          </Box>
        )}

        {children}
      </CardContent>
    </Card>
  );
}