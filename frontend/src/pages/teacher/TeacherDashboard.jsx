// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard Page
// Connected to Backend KPI API
// ============================================

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DateFilter from "../../components/common/DateFilter";

import { Box } from "@mui/material";

import {
  Assignment,
  Print,
  Description,
  Pending,
  CheckCircle,
  TaskAlt,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import { getTeacherDashboardKpis } from "../../services/teacherDashboardService";

import KPIGrid from "../../components/dashboard/KPIGrid";
import MonthlyUsageChart from "../../components/dashboard/MonthlyUsageChart";
import PurposeBreakdownChart from "../../components/dashboard/PurposeBreakdownChart";
import StatusOverview from "../../components/dashboard/StatusOverview";
import RecentRequestsTable from "../../components/dashboard/RecentRequestsTable";
import RequestProgressTracker from "../../components/dashboard/RequestProgressTracker";
import AttachmentSummary from "../../components/dashboard/AttachmentSummary";
import RecentAttachments from "../../components/dashboard/RecentAttachments";
import QuickActions from "../../components/dashboard/QuickActions";
import PurposeUsageTrend from "../../components/dashboard/PurposeUsageTrend";

export default function TeacherDashboard() {
  const { user } = useAuth();

  const [kpis, setKpis] = useState({
    totalRequests: 0,
    totalSheets: 0,
    totalPages: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  useEffect(() => {
    const loadKpis = async () => {
      try {
        const data = await getTeacherDashboardKpis();
        setKpis(data);
      } catch (error) {
        console.error("Failed to load teacher dashboard KPIs:", error);
      }
    };

    loadKpis();
  }, []);

  const dashboardStats = [
    {
      title: "Total Requests",
      value: kpis.totalRequests,
      change: "Live Data",
      color: "#4f46e5",
    },
    {
      title: "Total Sheets",
      value: kpis.totalSheets,
      change: "Live Data",
      color: "#0ea5e9",
    },
    {
      title: "Total Pages",
      value: kpis.totalPages,
      change: "Live Data",
      color: "#8b5cf6",
    },
    {
      title: "Pending",
      value: kpis.pendingRequests,
      change: "Live Data",
      color: "#f59e0b",
    },
    {
      title: "Approved",
      value: kpis.approvedRequests,
      change: "Live Data",
      color: "#22c55e",
    },
    {
      title: "Rejected",
      value: kpis.rejectedRequests,
      change: "Live Data",
      color: "#ef4444",
    },
  ];

  const icons = [
    <Assignment />,
    <Print />,
    <Description />,
    <Pending />,
    <CheckCircle />,
    <TaskAlt />,
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar role="teacher" />}
      topbar={
        <Topbar
          userName={user?.fullName || "Teacher"}
          role={user?.displayRole || user?.role || "Teacher"}
        />
      }
    >
      <PageHeader
        title={`Welcome Back, ${user?.fullName || "Teacher"}! 👋`}
        subtitle="Here's your request summary and activity overview."
        action={<DateFilter label="Live Dashboard" />}
      />

      {/* Live KPI Cards */}
      <KPIGrid stats={dashboardStats} icons={icons} />

      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        <MonthlyUsageChart />
        <PurposeBreakdownChart />
        <StatusOverview />
      </Box>

      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        <RecentRequestsTable />
        <RequestProgressTracker />
        <AttachmentSummary />
      </Box>

      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        <RecentAttachments />
        <PurposeUsageTrend />
        <QuickActions />
      </Box>
    </DashboardLayout>
  );
}