// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard Page
// Modern Simplified Dashboard
//
// Includes:
// - KPI cards
// - Monthly usage chart
// - Request status overview
// - Attachment storage summary
// - Recent requests
//
// Removed:
// - Quick Actions because actions already exist in sidebar
// - Extra unnecessary dashboard widgets
//
// Future:
// - Department / subject remaining balance will be added later
// - Balance will NOT be shown to teachers yet
// ============================================

import { useEffect, useState } from "react";

// ============================================
// Layout Components
// ============================================
import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DateFilter from "../../components/common/DateFilter";

// ============================================
// MUI Components
// ============================================
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from "@mui/material";

// ============================================
// MUI Icons
// ============================================
import {
  Assignment,
  Print,
  Description,
  Pending,
  CheckCircle,
  Cancel,
  TaskAlt,
  AttachFile,
} from "@mui/icons-material";

// ============================================
// Auth Context
// ============================================
import { useAuth } from "../../context/AuthContext";

// ============================================
// API Service
// ============================================
import { getTeacherDashboardData } from "../../services/teacherDashboardService";

// ============================================
// Dashboard Components
// ============================================
import KPIGrid from "../../components/dashboard/KPIGrid";
import MonthlyUsageChart from "../../components/dashboard/MonthlyUsageChart";
import StatusOverview from "../../components/dashboard/StatusOverview";
import RecentRequestsTable from "../../components/dashboard/RecentRequestsTable";

export default function TeacherDashboard() {
  // ============================================
  // Logged-in Teacher
  // ============================================
  const { user } = useAuth();

  // ============================================
  // KPI State
  // Balance fields will be added later but hidden
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
  // Dashboard Data State
  // ============================================
  const [recentRequests, setRecentRequests] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState([]);

  // ============================================
  // Temporary Attachment Storage State
  // Later this will come from backend
  // ============================================
  const attachmentStorage = {
    usedMB: 420,
    totalMB: 1024,
    totalAttachments: 156,
    largestFileMB: 20.4,
  };

  // ============================================
  // Load Teacher Dashboard Data
  // ============================================
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getTeacherDashboardData();

        // Supports both backend formats:
        // data.stats = current backend
        // data.data = older service format
        const stats = data.stats || data.data || {};

        setKpis({
          totalRequests: stats.TotalRequests || stats.totalRequests || 0,
          totalSheets: stats.TotalSheets || stats.totalSheets || 0,
          totalPages: stats.TotalPages || stats.totalPages || 0,
          pendingRequests: stats.PendingRequests || stats.pendingRequests || 0,
          approvedRequests: stats.ApprovedRequests || stats.approvedRequests || 0,
          rejectedRequests: stats.RejectedRequests || stats.rejectedRequests || 0,
          completedRequests:
            stats.CompletedRequests || stats.completedRequests || 0,
        });

        setRecentRequests(data.recentRequests || []);
        setMonthlyUsage(data.monthlyUsage || []);
      } catch (error) {
        console.error("Failed to load teacher dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  // ============================================
  // Teacher KPI Cards
  // Do not include department/subject balance yet
  // ============================================
  const dashboardStats = [
    {
      title: "Total Requests",
      value: kpis.totalRequests,
      color: "#4F46E5",
    },
    {
      title: "Total Sheets",
      value: kpis.totalSheets,
      color: "#0EA5E9",
    },
    {
      title: "Total Pages",
      value: kpis.totalPages,
      color: "#8B5CF6",
    },
    {
      title: "Pending",
      value: kpis.pendingRequests,
      color: "#F59E0B",
    },
    {
      title: "Approved",
      value: kpis.approvedRequests,
      color: "#22C55E",
    },
    {
      title: "Rejected",
      value: kpis.rejectedRequests,
      color: "#EF4444",
    },
    {
      title: "Completed",
      value: kpis.completedRequests,
      color: "#06B6D4",
    },
  ];

  // ============================================
  // KPI Icons
  // Must match dashboardStats order
  // ============================================
  const icons = [
    <Assignment />,
    <Print />,
    <Description />,
    <Pending />,
    <CheckCircle />,
    <Cancel />,
    <TaskAlt />,
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar role="teacher" />}
      topbar={(handleMenuClick) => (
        <Topbar onMenuClick={handleMenuClick} />
      )}
    >
      {/* Page Header */}
      <PageHeader
        title={`Welcome Back, ${user?.fullName || "Teacher"}! 👋`}
        subtitle="Here is your request summary and photocopy activity."
        action={<DateFilter label="This Month" />}
      />

      {/* KPI Cards */}
      <KPIGrid stats={dashboardStats} icons={icons} />

      {/* Main Analytics Row */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "2fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Monthly Usage */}
        <MonthlyUsageChart data={monthlyUsage} />

        {/* Request Status */}
        <StatusOverview kpis={kpis} />

        {/* Attachment Storage Summary */}
        <TeacherAttachmentSummary storage={attachmentStorage} />
      </Box>

      {/* Recent Requests */}
      <Box sx={{ mt: 4 }}>
        <RecentRequestsTable requests={recentRequests} />
      </Box>
    </DashboardLayout>
  );
}

// ============================================
// Teacher Attachment Summary
// Temporary frontend component
// Later it should connect to backend storage usage
// ============================================

function TeacherAttachmentSummary({ storage }) {
  const usedPercent = Math.round(
    (storage.usedMB / storage.totalMB) * 100
  );

  const remainingMB = storage.totalMB - storage.usedMB;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      <CardContent>
        {/* Card Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: "#EAF1FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AttachFile />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={800}>
              Attachment Summary
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              Your attachment storage overview.
            </Typography>
          </Box>
        </Box>

        {/* Usage Percentage */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h3" fontWeight={900}>
            {usedPercent}%
          </Typography>
          <Typography color="text.secondary">Used</Typography>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={usedPercent}
          sx={{
            height: 10,
            borderRadius: 10,
            mb: 2,
            bgcolor: "#E5E7EB",
            "& .MuiLinearProgress-bar": {
              borderRadius: 10,
              bgcolor: "#2563EB",
            },
          }}
        />

        <Typography
          textAlign="center"
          color="text.secondary"
          fontSize={13}
          mb={3}
        >
          {storage.usedMB} MB / {storage.totalMB / 1024} GB used
        </Typography>

        {/* Storage Details */}
        <Box sx={{ display: "grid", gap: 1.5 }}>
          <StorageRow label="Used Space" value={`${storage.usedMB} MB`} />
          <StorageRow label="Total Space" value="1 GB" />
          <StorageRow label="Remaining" value={`${remainingMB} MB`} />
        </Box>

        {/* Attachment Stats */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "1px solid #E5E7EB",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <Box>
            <Typography color="text.secondary" fontSize={13}>
              Total Attachments
            </Typography>
            <Typography fontWeight={900}>
              {storage.totalAttachments}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" fontSize={13}>
              Largest File
            </Typography>
            <Typography fontWeight={900}>
              {storage.largestFileMB} MB
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================
// Reusable Storage Row
// ============================================

function StorageRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={800}>{value}</Typography>
    </Box>
  );
}