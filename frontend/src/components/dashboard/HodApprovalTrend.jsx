// ============================================
// ARAB UNITY SCHOOL
// HOD Approval Trend Chart
// ============================================

// MUI components
import { Card, CardContent, Typography } from "@mui/material";

// Recharts components
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// HOD approval trend data
import { hodApprovalTrendData } from "../../data/hodDashboardData";

export default function HodApprovalTrend() {
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
          Monthly Approval Trend
        </Typography>

        {/* Responsive chart container */}
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={hodApprovalTrendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Approved requests */}
            <Bar dataKey="approved" fill="#10B981" radius={[6, 6, 0, 0]} />

            {/* Rejected requests */}
            <Bar dataKey="rejected" fill="#EF4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}