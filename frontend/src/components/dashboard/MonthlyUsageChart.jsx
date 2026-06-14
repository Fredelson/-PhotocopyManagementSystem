// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard
// Monthly Usage Chart
// Connected to live backend dashboard data
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// ============================================
// Monthly Usage Chart Component
// ============================================

export default function MonthlyUsageChart({ data = [] }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        height: "100%",
        minWidth: 0,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Monthly Usage
        </Typography>

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            height: 320,
          }}
        >
          {data.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              No monthly usage data available.
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="pages"
                  name="Pages"
                  fill="#2563EB"
                  radius={[8, 8, 0, 0]}
                />

                <Bar
                  dataKey="sheets"
                  name="Sheets"
                  fill="#8B5CF6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}