// ============================================
// ARAB UNITY SCHOOL
// Reusable KPI Grid
// Used by Teacher, HOD, HOS, Admin dashboards
// ============================================

import { Box } from "@mui/material";
import StatCard from "./StatCard";

export default function KPIGrid({ stats = [], icons = [] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(6, 1fr)",
        },
        gap: 3,
      }}
    >
      {stats.map((item, index) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={icons[index]}
          color={item.color}
        />
      ))}
    </Box>
  );
}