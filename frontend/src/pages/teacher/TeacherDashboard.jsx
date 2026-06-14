// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard Page
// Connected to Backend Dashboard API
// Includes Completed KPI
// Uses reusable KPIGrid component
// ============================================

import { useEffect, useState } from "react";

// Layout components
import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DateFilter from "../../components/common/DateFilter";

// MUI components
import { Box } from "@mui/material";

// MUI icons
import {
  Assignment,
  Print,
  Description,
  Pending,
  CheckCircle,
  TaskAlt,
} from "@mui/icons-material";

// Auth context
import { useAuth } from "../../context/AuthContext";

// Teacher dashboard API service
import { getTeacherDashboardData } from "../../services/teacherDashboardService";

// Dashboard components
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
  // ============================================
  // Get logged-in teacher from AuthContext
  // ============================================
  const { user } = useAuth();

  // ============================================
  // Teacher KPI state
  // These values come from backend API
  // ============================================
  const [kpis, setKpis] = useState({
    totalRequests: 0,
    totalSheets: 0,
    totalPages: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    completedRequests: 0,
  });

  // ============================================
  // Dashboard analytics/table state
  // Attachments remain static for now
  // ============================================
  const [recentRequests, setRecentRequests] = useState([]);
  const [purposeBreakdown, setPurposeBreakdown] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState([]);
  const [purposeTrend, setPurposeTrend] = useState([]);

  // ============================================
  // Load Teacher Dashboard Data
  // Runs once when dashboard opens
  // ============================================
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Call backend dashboard service
        const data = await getTeacherDashboardData();

        // Backend returns KPI values inside data.data
        const stats = data.data || {};

        // Save KPI values from backend
        setKpis({
          totalRequests: stats.totalRequests || 0,
          totalSheets: stats.totalSheets || 0,
          totalPages: stats.totalPages || 0,
          pendingRequests: stats.pendingRequests || 0,
          approvedRequests: stats.approvedRequests || 0,
          rejectedRequests: stats.rejectedRequests || 0,
          completedRequests: stats.completedRequests || 0,
        });

        // Save chart/table data if backend returns them
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

  // ============================================
  // KPI cards data
  // Completed confirms workflow reached Printing completion
  // ============================================
  const dashboardStats = [
    {
      title: "Total Requests",
      value: kpis.totalRequests,
      color: "#4f46e5",
    },
    {
      title: "Total Sheets",
      value: kpis.totalSheets,
      color: "#0ea5e9",
    },
    {
      title: "Total Pages",
      value: kpis.totalPages,
      color: "#8b5cf6",
    },
    {
      title: "Pending",
      value: kpis.pendingRequests,
      color: "#f59e0b",
    },
    {
      title: "Approved",
      value: kpis.approvedRequests,
      color: "#22c55e",
    },
    {
      title: "Rejected",
      value: kpis.rejectedRequests,
      color: "#ef4444",
    },
    {
      title: "Completed",
      value: kpis.completedRequests,
      color: "#06B6D4",
    },
  ];

  // ============================================
  // KPI icons
  // Must match dashboardStats order
  // ============================================
  const icons = [
    <Assignment />,
    <Print />,
    <Description />,
    <Pending />,
    <CheckCircle />,
    <TaskAlt />,
    <CheckCircle />,
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar role="teacher" />}

      // Mobile hamburger support
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

      {/* KPI Cards */}
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