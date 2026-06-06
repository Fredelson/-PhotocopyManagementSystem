// ============================================
// ARAB UNITY SCHOOL
// HOD Dashboard Page
// ============================================

// React state
import { useState } from "react";

// Main dashboard layout
import DashboardLayout from "../../layouts/DashboardLayout";

// Common components
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DateFilter from "../../components/common/DateFilter";
import DepartmentFilter from "../../components/common/DepartmentFilter";

// MUI components
import { Box, Alert } from "@mui/material";

// MUI icons
import {
  Assignment,
  PendingActions,
  CheckCircle,
  Cancel,
  Send,
  TaskAlt,
} from "@mui/icons-material";

// Dashboard components
import KPIGrid from "../../components/dashboard/KPIGrid";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ApprovalQueue from "../../components/dashboard/ApprovalQueue";
import RequestDetailsDialog from "../../components/dashboard/RequestDetailsDialog";

// HOD data
import {
  hodDashboardStats,
  hodApprovalQueueData,
} from "../../data/hodDashboardData";

export default function HodDashboard() {
  // Store all HOD approval requests
  const [requests, setRequests] = useState(hodApprovalQueueData);

  // Store selected request for review dialog
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Control request details dialog open/close
  const [openDialog, setOpenDialog] = useState(false);

  // Store HOD comment/remarks
  const [comment, setComment] = useState("");

  // Store selected department filter
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  // Filter requests based on selected department
  const filteredRequests =
    selectedDepartment === "All"
      ? requests
      : requests.filter(
          (request) => request.department === selectedDepartment
        );

  // Open review dialog
  const handleReview = (request) => {
    setSelectedRequest(request);
    setComment("");
    setOpenDialog(true);
  };

  // Close review dialog
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setComment("");
  };

  // Approve request
  const handleApprove = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,

              // If sheets are more than 500, forward to HOS
              // If sheets are 500 or below, approve directly to Admin Printing
              status:
                req.sheets > 500
                  ? "Forwarded to HOS"
                  : "Approved by HOD",

              // Save HOD comment
              comment,
            }
          : req
      )
    );

    handleClose();
  };

  // Return request for revision
  const handleReturn = () => {
    // Comment is required when returning
    if (!comment.trim()) {
      alert("Comment is required when returning a request.");
      return;
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "Returned for Revision",
              comment,
            }
          : req
      )
    );

    handleClose();
  };

  // Reject request
  const handleReject = () => {
    // Comment is required when rejecting
    if (!comment.trim()) {
      alert("Comment is required when rejecting a request.");
      return;
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "Rejected by HOD",
              comment,
            }
          : req
      )
    );

    handleClose();
  };

  // KPI icons matched with hodDashboardStats order
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
      topbar={<Topbar userName="Primary HOD" role="HOD" />}
    >
      {/* Page Header */}
      <PageHeader
        title="HOD Dashboard"
        subtitle="Review and approve department photocopy requests."
        action={<DateFilter label="May 1 - May 31, 2025" />}
      />

      {/* KPI Cards */}
      <KPIGrid stats={hodDashboardStats} icons={icons} />

      {/* Department Filter */}
      <Box sx={{ mt: 4 }}>
        <DepartmentFilter
          selectedDepartment={selectedDepartment}
          onChange={setSelectedDepartment}
        />
      </Box>

      {/* Approval Queue */}
      <Box sx={{ mt: 2 }}>
        <DashboardCard title="Pending Approval Queue">
          {filteredRequests.length > 0 ? (
            <ApprovalQueue
              requests={filteredRequests}
              onReview={handleReview}
            />
          ) : (
            <Alert severity="info">
              No requests found for this department.
            </Alert>
          )}
        </DashboardCard>
      </Box>

      {/* Request Details Dialog */}
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