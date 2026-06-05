import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";

const KpiCard = ({
  title,
  value,
  icon,
  color = "#1976d2",
  subtitle,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: "100%",
        border: "1px solid #E2E8F0",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontWeight: 500,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: "#94A3B8",
                  mt: 1,
                  display: "block",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              backgroundColor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KpiCard;