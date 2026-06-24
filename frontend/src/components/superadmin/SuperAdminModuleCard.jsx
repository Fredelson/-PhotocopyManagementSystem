// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Reusable Module Card
// Used for:
// - Printing
// - IT Tickets
// - Assets
// - HR
// - Academic Operations
// - Communication
// - Future Modules
// ============================================

import { Box, Chip, Typography } from "@mui/material";

export default function SuperAdminModuleCard({
  title,
  description,
  icon,
  status = "Active",
  color = "#16a34a",
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        bgcolor: "#fff",
        transition: "all .2s ease",
        cursor: "pointer",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: `${color}15`,
          color,
          display: "grid",
          placeItems: "center",
          mb: 2,
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography fontWeight={800}>
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        {description}
      </Typography>

      {/* Status */}
      <Chip
        size="small"
        label={status}
        sx={{
          mt: 2,
          bgcolor: `${color}15`,
          color,
          fontWeight: 700,
        }}
      />
    </Box>
  );
}