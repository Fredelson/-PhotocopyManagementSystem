// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard KPI Card
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function StatCard({
  title,
  value,
  icon,
  color,
  growth = "+12%",
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        backgroundColor: "#fff",
        boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",
        transition: "0.25s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 14px 35px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Top row: title and icon */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          <Box>
            {/* Card title */}
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#64748B",
              }}
            >
              {title}
            </Typography>

            {/* Main value */}
            <Typography
              sx={{
                mt: 1,
                fontSize: {
                  xs: 26,
                  md: 28,
                },
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* Icon circle */}
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "16px",
              backgroundColor: color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              flexShrink: 0,

              "& svg": {
                fontSize: 24,
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Growth indicator */}
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          mt={2}
        >
          <TrendingUpIcon
            sx={{
              fontSize: 16,
              color: "#10B981",
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "#10B981",
            }}
          >
            {growth}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "#94A3B8",
            }}
          >
            this month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}