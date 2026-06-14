// ============================================
// ARAB UNITY SCHOOL
// Modern KPI Card
// Used by Teacher / HOD / HOS / Printing
// ============================================

import {
  Card,
  CardContent,
  Box,
  Typography,
} from "@mui/material";

export default function StatCard({
  title,
  value,
  icon,
  color = "#2563EB",
}) {
  return (
    <Card
      sx={{
        borderRadius: 5,

        background:
          "linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)",

        border: "1px solid #E2E8F0",

        boxShadow:
          "0 10px 30px rgba(15,23,42,0.06)",

        transition: "all 0.25s ease",

        overflow: "hidden",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 20px 40px rgba(15,23,42,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Top Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* KPI Text */}
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#64748B",
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
                color: "#0F172A",
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