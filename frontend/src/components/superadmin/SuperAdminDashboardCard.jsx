// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Reusable Dashboard Section Card
// ============================================

import { Card, CardContent, Typography, Box } from "@mui/material";

export default function SuperAdminDashboardCard({
  title,
  action,
  children,
  height = "100%",
}) {
  return (
    <Card
      sx={{
        height,
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={800}>
            {title}
          </Typography>

          {action}
        </Box>

        {/* Content */}
        {children}
      </CardContent>
    </Card>
  );
}