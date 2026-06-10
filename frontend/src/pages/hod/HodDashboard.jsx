// ============================================
// ARAB UNITY SCHOOL
// HOD Dashboard Page
// Connected to Backend Live Data
// ============================================

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DateFilter from "../../components/common/DateFilter";

import { Box, Alert, Typography } from "@mui/material";

import {
  Assignment,
  PendingActions,
  CheckCircle,
  Cancel,
  Send,
  TaskAlt,
} from "@mui/icons-material";

import KPIGrid from "../../components/dashboard/KPIGrid";
import RequestDetailsDialog from "../../components/dashboard/RequestDetailsDialog";
import HodApprovalTrend from "../../components/dashboard/HodApprovalTrend";
import DepartmentDistributionChart from "../../components/dashboard/DepartmentDistributionChart";
import RecentApprovedRequests from "../../components/dashboard/RecentApprovedRequests";
import ApprovalHistory from "../../components/dashboard/ApprovalHistory";
import HodPendingRequestsTable from "../../components/dashboard/HodPendingRequestsTable";
import RecentRejectedRequests from "../../components/dashboard/RecentRejectedRequests";

import { useAuth } from "../../context/AuthContext";

import {
  getHodDashboard,
  getHodRequests,
  approveHodRequest,
  rejectHodRequest,
} from "../../services/hodService";

export default function HodDashboard() {
  const { user } = useAuth();

  // ============================================
  // State
  // ============================================
  const [dashboard, setDashboard] = useState({
    TotalRequests: 0,
    PendingReview: 0,
    Approved: 0,
    Rejected: 0,
    Forwarded: 0,
    Completed: 0,
  });

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // Convert backend data to frontend table format
  // ============================================
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
    submittedDate: item.SubmittedAt
      ? new Date(item.SubmittedAt).toLocaleDateString()
      : "-",
  });

  // ============================================
  // Fetch HOD Dashboard KPI + Pending Requests
  // ============================================
  const fetchHodData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, requestsData] = await Promise.all([
        getHodDashboard(),
        getHodRequests(),
      ]);

      setDashboard({
        TotalRequests: dashboardData.TotalRequests || 0,
        PendingReview: dashboardData.PendingReview || 0,
        Approved: dashboardData.Approved || 0,
        Rejected: dashboardData.Rejected || 0,
        Forwarded: dashboardData.Forwarded || 0,
        Completed: dashboardData.Completed || 0,
      });

      setRequests(requestsData.map(mapRequest));
    } catch (err) {
      console.error("Fetch HOD Data Error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          "Unable to load HOD dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Load data when page opens
  // ============================================
  useEffect(() => {
    fetchHodData();
  }, []);

  // ============================================
  // KPI Cards from Live Backend Dashboard API
  // ============================================
  const hodDashboardStats = [
    {
      title: "Total Requests",
      value: dashboard.TotalRequests,
      subtitle: "All HOD Requests",
    },
    {
      title: "Pending Review",
      value: dashboard.PendingReview,
      subtitle: "Awaiting HOD Action",
    },
    {
      title: "Approved",
      value: dashboard.Approved,
      subtitle: "Approved by HOD",
    },
    {
      title: "Rejected",
      value: dashboard.Rejected,
      subtitle: "Rejected by HOD",
    },
    {
      title: "Forwarded",
      value: dashboard.Forwarded,
      subtitle: "Forwarded to HOS",
    },
    {
      title: "Completed",
      value: dashboard.Completed,
      subtitle: "Completed Requests",
    },
  ];

  // ============================================
  // Open review dialog
  // ============================================
  const handleReview = (request) => {
    setSelectedRequest(request);
    setComment("");
    setOpenDialog(true);
  };

  // ============================================
  // Close review dialog
  // ============================================
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setComment("");
  };

  // ============================================
  // Approve Request
  // PUT /api/hod/requests/:id/approve
  // ============================================
  const handleApprove = async () => {
    if (!selectedRequest) {
      alert("No request selected.");
      return;
    }

    try {
      await approveHodRequest(
        selectedRequest.id,
        comment || "Approved by HOD"
      );

      alert("Request approved successfully.");

      handleClose();
      await fetchHodData();
    } catch (err) {
      console.error("Approve Request Error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Unable to approve request."
      );
    }
  };

  // ============================================
  // Reject Request
  // PUT /api/hod/requests/:id/reject
  // ============================================
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
      await rejectHodRequest(selectedRequest.id, comment);

      alert("Request rejected successfully.");

      handleClose();
      await fetchHodData();
    } catch (err) {
      console.error("Reject Request Error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Unable to reject request."
      );
    }
  };

  // ============================================
  // Return Request - Not connected yet
  // ============================================
  const handleReturn = () => {
    alert("Return request API is not created yet.");
  };

  // ============================================
  // KPI icons matched with cards order
  // ============================================
  const icons = [
    <Assignment />,
    <PendingActions />,
    <CheckCircle />,
    <Cancel />,
    <Send />,
    <TaskAlt />,
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar role="hod" />}
      topbar={
        <Topbar
          userName={user?.fullName || "HOD"}
          role={user?.role || "HOD"}
        />
      }
    >
      <PageHeader
        title="HOD Dashboard"
        subtitle="Review and approve department photocopy requests."
        action={<DateFilter label="May 1 - May 31, 2025" />}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading HOD dashboard data...</Typography>
      ) : (
        <>
          <KPIGrid stats={hodDashboardStats} icons={icons} />

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
            <HodApprovalTrend />
            <DepartmentDistributionChart />
          </Box>

          <Box sx={{ mt: 4 }}>
            <HodPendingRequestsTable
              requests={requests}
              onReview={handleReview}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <RecentApprovedRequests />
          </Box>

          <Box sx={{ mt: 4 }}>
            <RecentRejectedRequests />
          </Box>

          <Box sx={{ mt: 4 }}>
            <ApprovalHistory />
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