// ============================================
// ARAB UNITY SCHOOL
// HOD Dashboard Page
// Connected to Backend Live Data
// Prevents double approve/reject clicks
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
  getHodApprovalHistory,
  approveHodRequest,
  rejectHodRequest,
} from "../../services/hodService";

export default function HodDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState({
    TotalRequests: 0,
    PendingReview: 0,
    Approved: 0,
    Rejected: 0,
    Forwarded: 0,
    Completed: 0,
  });

  const [requests, setRequests] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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
    rawSubmittedAt: item.SubmittedAt,
    submittedDate: item.SubmittedAt
      ? new Date(item.SubmittedAt).toLocaleDateString()
      : "-",
    approvalRemarks: item.ApprovalRemarks,
    approvalStatus: item.ApprovalStatus,
    actionDate: item.ActionDate
      ? new Date(item.ActionDate).toLocaleDateString()
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
    approverName: item.ApproverName,
    approverEmployeeId: item.ApproverEmployeeId,
    displayApproverRole: item.DisplayApproverRole,
    approvalStatus: item.ApprovalStatus,
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

  const fetchHodData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, requestsData, historyData] = await Promise.all([
        getHodDashboard(),
        getHodRequests(),
        getHodApprovalHistory(),
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
      setApprovalHistory(historyData.map(mapApprovalHistory));
    } catch (err) {
      console.error("Fetch HOD Data Error:", err.response?.data || err);

      setError(
        err.response?.data?.message || "Unable to load HOD dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHodData();
  }, []);

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

  const icons = [
    <Assignment />,
    <PendingActions />,
    <CheckCircle />,
    <Cancel />,
    <Send />,
    <TaskAlt />,
  ];

  const handleReview = (request) => {
    if (actionLoading) return;

    setSelectedRequest(request);
    setComment("");
    setOpenDialog(true);
  };

  const handleClose = () => {
    if (actionLoading) return;

    setOpenDialog(false);
    setSelectedRequest(null);
    setComment("");
  };

  const handleApprove = async () => {
    if (actionLoading) return;

    if (!selectedRequest) {
      alert("No request selected.");
      return;
    }

    setActionLoading(true);

    try {
      await approveHodRequest(
        selectedRequest.id,
        comment || "Approved by HOD"
      );

      alert("Request approved successfully.");

      setOpenDialog(false);
      setSelectedRequest(null);
      setComment("");

      await fetchHodData();
    } catch (err) {
      console.error("Approve Request Error:", err.response?.data || err);

      alert(err.response?.data?.message || "Unable to approve request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (actionLoading) return;

    if (!selectedRequest) {
      alert("No request selected.");
      return;
    }

    if (!comment.trim()) {
      alert("Comment is required when rejecting a request.");
      return;
    }

    setActionLoading(true);

    try {
      await rejectHodRequest(selectedRequest.id, comment);

      alert("Request rejected successfully.");

      setOpenDialog(false);
      setSelectedRequest(null);
      setComment("");

      await fetchHodData();
    } catch (err) {
      console.error("Reject Request Error:", err.response?.data || err);

      alert(err.response?.data?.message || "Unable to reject request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = () => {
    if (actionLoading) return;

    alert("Return request API is not created yet.");
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar role="hod" />}
      topbar={
        <Topbar
          userName={user?.fullName || "HOD"}
          role={user?.displayRole || user?.role || "HOD"}
        />
      }
    >
      <PageHeader
        title={`${user?.departmentName || ""} ${
          user?.subject || ""
        } HOD Dashboard`}
        subtitle={`Welcome back, ${user?.fullName || "HOD"}. Review ${
          user?.departmentName || ""
        } ${user?.subject || ""} photocopy requests.`}
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
            <HodApprovalTrend requests={requests} />
            <DepartmentDistributionChart requests={requests} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <HodPendingRequestsTable
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
        actionLoading={actionLoading}
      />
    </DashboardLayout>
  );
}