// ============================================
// ARAB UNITY SCHOOL
// Reusable KPI Grid
// Used by Teacher, HOD, HOS, and Printing dashboards
// Supports both:
// 1. stats + icons
// 2. items with icon already inside
// ============================================

import { Box } from "@mui/material";
import StatCard from "./StatCard";

export default function KPIGrid({
  stats = [],
  icons = [],
  items = [],
}) {
  // ============================================
  // Support old and new prop formats
  // If items is provided, use it.
  // Otherwise build items from stats + icons.
  // ============================================
  const finalItems =
    items.length > 0
      ? items
      : stats.map((stat, index) => ({
          ...stat,
          icon: icons[index],
        }));

  return (
    <Box
      sx={{
        display: "grid",

        // Responsive KPI layout
        // 7 KPI cards stay in one row on very large screens
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
          xl:
            finalItems.length === 7
              ? "repeat(7, 1fr)"
              : finalItems.length === 6
              ? "repeat(6, 1fr)"
              : finalItems.length === 5
              ? "repeat(5, 1fr)"
              : "repeat(4, 1fr)",
        },

        gap: 3,
      }}
    >
      {finalItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </Box>
  );
}