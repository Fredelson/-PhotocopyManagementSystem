// ============================================
// ARAB UNITY SCHOOL
// Department Distribution Chart
// ============================================

// MUI components
import { Card, CardContent, Typography } from "@mui/material";

// Recharts components
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// Department chart data
import { departmentDistributionData } from "../../data/hodDashboardData";

// Chart colors
const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function DepartmentDistributionChart() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      <CardContent>
        {/* Chart title */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Department Distribution
        </Typography>

        {/* Responsive chart container */}
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={departmentDistributionData}
              dataKey="value"
              nameKey="name"
              outerRadius={85}
              label
            >
              {departmentDistributionData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
