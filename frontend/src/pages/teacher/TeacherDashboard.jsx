// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard Page
// Connected to Backend Dashboard API
// Uses responsive DashboardLayout
// ============================================

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import Sidebar from "../../components/sidebar/Sidebar";
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
import { getTeacherDashboardData } from "../../services/teacherDashboardService";

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
  // Logged-in user
  const { user } = useAuth();

  // KPI state from backend
  const [kpis, setKpis] = useState({
    totalRequests: 0,
    totalSheets: 0,
    totalPages: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  // Recent requests state from backend
  const [recentRequests, setRecentRequests] = useState([]);
  const [purposeBreakdown, setPurposeBreakdown] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState([]);
  const [purposeTrend, setPurposeTrend] = useState([]);

  // ============================================
  // Load Teacher Dashboard Data
  // Loads KPI cards and recent requests from same API
  // ============================================
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getTeacherDashboardData();

        const stats = data.stats || {};

        // Convert backend PascalCase fields
        // into frontend camelCase state
        setKpis({
          totalRequests: stats.TotalRequests || 0,
          totalSheets: stats.TotalSheets || 0,
          totalPages: stats.TotalPages || 0,
          pendingRequests: stats.PendingRequests || 0,
          approvedRequests: stats.ApprovedRequests || 0,
          rejectedRequests: stats.RejectedRequests || 0,
        });

        // Store recent requests for table
        setRecentRequests(data.recentRequests || []);
        setPurposeBreakdown(data.purposeBreakdown || []);
        setMonthlyUsage(data.monthlyUsage || []);
        setPurposeTrend(data.purposeTrend || []);
      } catch (error) {
        console.error(
          "Failed to load teacher dashboard data:",
          error
        );
      }
    };

    loadDashboardData();
  }, []);

  // KPI card data
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

  // KPI icons
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

      // IMPORTANT:
      // DashboardLayout sends handleMenuClick into Topbar.
      // This makes the hamburger menu work on small screens.
      topbar={(handleMenuClick) => (
        <Topbar onMenuClick={handleMenuClick} />
      )}
    >
      {/* Page Header */}
      <PageHeader
        title={`Welcome Back, ${user?.fullName || "Teacher"}! 👋`}
        subtitle="Here's your request summary and activity overview."
        action={<DateFilter label="Live Dashboard" />}
      />

      {/* Live KPI Cards */}
      <KPIGrid stats={dashboardStats} icons={icons} />

      {/* First Analytics Row */}
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
        <MonthlyUsageChart data={monthlyUsage} />
        <PurposeBreakdownChart data={purposeBreakdown} />
        <StatusOverview kpis={kpis} />
      </Box>

      {/* Second Analytics Row */}
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
        <RecentRequestsTable requests={recentRequests} />
        <RequestProgressTracker request={recentRequests[0]} />
        <AttachmentSummary />
      </Box>

      {/* Bottom Analytics Row */}
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
        <PurposeUsageTrend data={purposeTrend} />
        <QuickActions />
      </Box>
    </DashboardLayout>
  );
}