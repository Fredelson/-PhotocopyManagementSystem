// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Reusable Super Admin KPI / Stat Card
// ============================================

import { Box, Card, CardContent, Typography } from "@mui/material";

export default function SuperAdminStatCard({
  title,
  value,
  icon,
  change,
  subtitle,
  bg = "#ecfdf5",
  color = "#047857",
}) {
  return (
    <Card
      sx={{
        height: 130,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
        bgcolor: "#fff",
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: 2.5,
            bgcolor: bg,
            color,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            "& svg": {
              fontSize: 30,
            },
          }}
        >
          {icon}
        </Box>

        {/* Text */}
        <Box>
          <Typography variant="body2" fontWeight={800}>
            {title}
          </Typography>

          <Typography variant="h4" fontWeight={900} lineHeight={1.1}>
            {value}
          </Typography>

          {change && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                color: "#16a34a",
                fontWeight: 800,
              }}
            >
              {change}
            </Typography>
          )}

          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}