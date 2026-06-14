// ============================================
// ARAB UNITY SCHOOL
// HOS Dashboard Page
// Connected to Backend Live Data
// Updated to use new responsive DashboardLayout + Topbar
// ============================================

import { useEffect, useState } from "react";

// Layout components
import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DateFilter from "../../components/common/DateFilter";

// MUI components
import { Box, Alert, Typography } from "@mui/material";

// MUI icons
import {
  Assignment,
  PendingActions,
  CheckCircle,
  Cancel,
  TaskAlt,
} from "@mui/icons-material";

// Dashboard components
import KPIGrid from "../../components/dashboard/KPIGrid";
import RequestDetailsDialog from "../../components/dashboard/RequestDetailsDialog";
import HodApprovalTrend from "../../components/dashboard/HodApprovalTrend";
import DepartmentDistributionChart from "../../components/dashboard/DepartmentDistributionChart";
import RecentApprovedRequests from "../../components/dashboard/RecentApprovedRequests";
import ApprovalHistory from "../../components/dashboard/ApprovalHistory";
import HosPendingRequestsTable from "../../components/dashboard/HosPendingRequestsTable";
import RecentRejectedRequests from "../../components/dashboard/RecentRejectedRequests";

// Auth context
import { useAuth } from "../../context/AuthContext";

// HOS API services
import {
  getHosDashboard,
  getHosRequests,
  getHosApprovalHistory,
  approveHosRequest,
  rejectHosRequest,
} from "../../services/hosService";

export default function HosDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState({
    TotalRequests: 0,
    PendingReview: 0,
    Approved: 0,
    Rejected: 0,
    Completed: 0,
  });

  const [requests, setRequests] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mapRequest = (item) => ({
    id: item.RequestId,
    requestNumber: item.RequestNumber,
    teacher: item.TeacherName,
    employeeId: item.EmployeeId,
    department: item.DepartmentName,
    subject: item.SubjectName,
    purpose: item.PurposeName,
    pages: item.TotalPages,
    sheets: item.TotalSheets,
    copies: item.Copies,
    priority: item.PriorityLevel,
    status: item.Status,
    paperSize: item.PaperSize,
    printType: item.PrintType,
    printSide: item.PrintSide,
    isExam: item.IsExam,
    requestRemarks: item.RequestRemarks,

    rawSubmittedAt: item.SubmittedAt,

    submittedDate: item.SubmittedAt
      ? new Date(item.SubmittedAt).toLocaleDateString()
      : "-",

    approvedAt: item.ApprovedAt
      ? new Date(item.ApprovedAt).toLocaleDateString()
      : "-",

    approvalRemarks: item.ApprovalRemarks,
    approvalStatus: item.ApprovalStatus,

    actionDate: item.ActionDate
      ? new Date(item.ActionDate).toLocaleDateString()
      : "-",

    dueDate: item.DueDate
      ? new Date(item.DueDate).toLocaleDateString()
      : "-",
  });

  const mapApprovalHistory = (item) => ({
    approvalId: item.ApprovalId,
    requestId: item.RequestId,
    requestNumber: item.RequestNumber,

    teacher: item.TeacherName,
    employeeId: item.EmployeeId,

    department: item.DepartmentName,
    subject: item.SubjectName,
    purpose: item.PurposeName,

    approvalRole: item.ApprovalRole,
    approvalStatus: item.ApprovalStatus,

    approverName: item.ApproverName,
    approverEmployeeId: item.ApproverEmployeeId,
    displayApproverRole: item.DisplayApproverRole,

    requestStatus: item.RequestStatus,
    remarks: item.Remarks,

    rawActionDate: item.ActionDate,
    actionDate: item.ActionDate
      ? new Date(item.ActionDate).toLocaleDateString()
      : "-",

    rawSubmittedAt: item.SubmittedAt,
    submittedDate: item.SubmittedAt
      ? new Date(item.SubmittedAt).toLocaleDateString()
      : "-",
  });

  const fetchHosData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, requestsData, historyData] =
        await Promise.all([
          getHosDashboard(),
          getHosRequests(),
          getHosApprovalHistory(),
        ]);

      setDashboard({
        TotalRequests: dashboardData.TotalRequests || 0,
        PendingReview: dashboardData.PendingReview || 0,
        Approved: dashboardData.Approved || 0,
        Rejected: dashboardData.Rejected || 0,
        Completed: dashboardData.Completed || 0,
      });

      setRequests(requestsData.map(mapRequest));
      setApprovalHistory(historyData.map(mapApprovalHistory));
    } catch (err) {
      console.error("Fetch HOS Data Error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          "Unable to load HOS dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosData();
  }, []);

  const hosDashboardStats = [
    {
      title: "Total Requests",
      value: dashboard.TotalRequests,
      subtitle: "All HOS Requests",
    },
    {
      title: "Pending Review",
      value: dashboard.PendingReview,
      subtitle: "Awaiting HOS Action",
    },
    {
      title: "Approved",
      value: dashboard.Approved,
      subtitle: "Approved by HOS",
    },
    {
      title: "Rejected",
      value: dashboard.Rejected,
      subtitle: "Rejected by HOS",
    },
    {
      title: "Completed",
      value: dashboard.Completed,
      subtitle: "Completed Requests",
    },
  ];

  const icons = [
    <Assignment />,
    <PendingActions />,
    <CheckCircle />,
    <Cancel />,
    <TaskAlt />,
  ];

  const handleReview = (request) => {
    setSelectedRequest(request);
    setComment("");
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setComment("");
  };

  const handleApprove = async () => {
    if (!selectedRequest) {
      alert("No request selected.");
      return;
    }

    try {
      await approveHosRequest(
        selectedRequest.id,
        comment || "Approved by HOS"
      );

      alert("Request approved by HOS successfully.");

      handleClose();
      await fetchHosData();
    } catch (err) {
      console.error("Approve HOS Request Error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Unable to approve HOS request."
      );
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) {
      alert("No request selected.");
      return;
    }

    if (!comment.trim()) {
      alert("Comment is required when rejecting a request.");
      return;
    }

    try {
      await rejectHosRequest(selectedRequest.id, comment);

      alert("Request rejected by HOS successfully.");

      handleClose();
      await fetchHosData();
    } catch (err) {
      console.error("Reject HOS Request Error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Unable to reject HOS request."
      );
    }
  };

  const handleReturn = () => {
    alert("Return request API is not created yet.");
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar role="hos" />}

      // IMPORTANT:
      // DashboardLayout now passes handleMenuClick to Topbar.
      // This keeps the mobile hamburger menu working.
      topbar={(handleMenuClick) => (
        <Topbar onMenuClick={handleMenuClick} />
      )}
    >
      <PageHeader
        title={`${user?.displayRole || "HOS"} Dashboard`}
        subtitle={`Welcome back, ${
          user?.fullName || "HOS"
        }. Review large photocopy requests for ${
          user?.departmentName || "your department"
        }.`}
        action={<DateFilter label="May 1 - May 31, 2025" />}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading HOS dashboard data...</Typography>
      ) : (
        <>
          <KPIGrid stats={hosDashboardStats} icons={icons} />

          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "2fr 1fr",
              },
              gap: 3,
            }}
          >
            <HodApprovalTrend requests={requests} />
            <DepartmentDistributionChart requests={requests} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <HosPendingRequestsTable
              requests={requests}
              onReview={handleReview}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <RecentApprovedRequests requests={requests} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <RecentRejectedRequests requests={requests} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <ApprovalHistory history={approvalHistory} />
          </Box>
        </>
      )}

      <RequestDetailsDialog
        open={openDialog}
        request={selectedRequest}
        comment={comment}
        setComment={setComment}
        onClose={handleClose}
        onApprove={handleApprove}
        onReturn={handleReturn}
        onReject={handleReject}
      />
    </DashboardLayout>
  );
}