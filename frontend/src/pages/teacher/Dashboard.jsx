import DashboardLayout from "../../layouts/DashboardLayout";

import { Typography, Box } from "@mui/material";

import {
  Assignment,
  Print,
  Description,
  Pending,
  CheckCircle,
  TaskAlt,
} from "@mui/icons-material";

import StatCard from "../../components/dashboard/StatCard";
import { dashboardStats } from "../../data/dashboardData";
import MonthlyUsageChart from "../../components/dashboard/MonthlyUsageChart";
import PurposeBreakdownChart from "../../components/dashboard/PurposeBreakdownChart";
import StatusOverview from "../../components/dashboard/StatusOverview";
import RecentRequestsTable from "../../components/dashboard/RecentRequestsTable";
import RequestProgressTracker from "../../components/dashboard/RequestProgressTracker";
import AttachmentSummary from "../../components/dashboard/AttachmentSummary";
import RecentAttachments from "../../components/dashboard/RecentAttachments";
import QuickActions from "../../components/dashboard/QuickActions";
import PurposeUsageTrend from "../../components/dashboard/PurposeUsageTrend";

export default function Dashboard() {
  const icons = [
    <Assignment />,
    <Print />,
    <Description />,
    <Pending />,
    <CheckCircle />,
    <TaskAlt />,
  ];

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Welcome Back, Ahmed Khan! 👋
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: "0.95rem",
            }}
          >
            Here's your request summary and activity overview.
          </Typography>
        </Box>

        {/* Date Filter */}
        <Box
          sx={{
            px: 2,
            py: 1,
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            backgroundColor: "#fff",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          📅 May 1 - May 31, 2025
        </Box>
      </Box>

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
          width: "100%",
        }}
      >
        {dashboardStats.map((item, index) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={icons[index]}
            color={item.color}
          />
        ))}
      </Box>

      {/* Analytics Row */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr 1fr",
          },
          gap: 3,
          width: "100%",
        }}
      >
        <MonthlyUsageChart />
        <PurposeBreakdownChart />
        <StatusOverview />
      </Box>

      {/* Operations Row */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr 1fr",
          },
          gap: 3,
          width: "100%",
        }}
      >
        <RecentRequestsTable />
        <RequestProgressTracker />
        <AttachmentSummary />
      </Box>

      {/* Bottom Row: Recent Attachments + Purpose Trend + Quick Actions */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr 1fr",
          },
          gap: 3,
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <RecentAttachments />
        <PurposeUsageTrend />
        <QuickActions />
      </Box>

    </DashboardLayout>
  );
}