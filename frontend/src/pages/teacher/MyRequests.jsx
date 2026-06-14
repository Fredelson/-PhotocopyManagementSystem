// ============================================
// ARAB UNITY SCHOOL
// Teacher - My Requests Page
// Modern Card + Workflow Timeline UI
// Connected to Backend API
//
// Features:
// - Keeps current Sidebar and Topbar
// - Shows latest requests first
// - Shows maximum 10 requests per page
// - Includes pagination
// - Includes search and status filtering
// ============================================

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Pagination,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

// ============================================
// Main Component
// ============================================

export default function MyRequests() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // ============================================
  // State Management
  // ============================================

  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const requestsPerPage = 10;

  // ============================================
  // Fetch Logged-In Teacher Requests
  // Backend:
  // GET /api/requests/my-requests
  // ============================================

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_URL}/requests/my-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRequests(response.data || []);
      } catch (err) {
        console.error("Fetch My Requests Error:", err);
        setError("Unable to load requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRequests();
    }
  }, [token]);

  // ============================================
  // Reset Pagination When Search or Filter Changes
  // This makes sure the user always starts from page 1
  // after applying a new search or status filter.
  // ============================================

  useEffect(() => {
    setPage(1);
  }, [searchText, statusFilter]);

  // ============================================
  // Filter Requests
  // Search by request number, purpose, or subject
  // Filter by status
  // ============================================

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const requestNumber = request.RequestNumber || "";
      const purpose = request.PurposeName || "";
      const subject = request.SubjectName || "";
      const status = request.Status || "";

      const matchesSearch =
        requestNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        purpose.toLowerCase().includes(searchText.toLowerCase()) ||
        subject.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchText, statusFilter]);

  // ============================================
  // Sort Requests
  // Newest request should always appear first.
  // This ensures page 1 always shows the most recent requests.
  // ============================================

  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      return new Date(b.SubmittedAt || 0) - new Date(a.SubmittedAt || 0);
    });
  }, [filteredRequests]);

  // ============================================
  // Pagination Logic
  // Shows only 10 requests per page.
  // ============================================

  const totalPages = Math.ceil(sortedRequests.length / requestsPerPage);

  const paginatedRequests = sortedRequests.slice(
    (page - 1) * requestsPerPage,
    page * requestsPerPage
  );

  // ============================================
  // Summary Counts
  // These are small page summaries only.
  // We are not changing the main dashboard KPI yet.
  // ============================================

  const activeRequests = requests.filter(
    (request) =>
      request.Status !== "Completed" &&
      !request.Status?.toLowerCase().includes("rejected")
  ).length;

  const completedRequests = requests.filter(
    (request) => request.Status === "Completed"
  ).length;

  const pendingRequests = requests.filter(
    (request) => request.Status === "Pending"
  ).length;

  // ============================================
  // Page UI
  // Keeps your current sidebar and topbar unchanged.
  // ============================================

  return (
    <DashboardLayout
      sidebar={<Sidebar role="teacher" />}
      topbar={
        <Topbar
          userName={user?.fullName || "Teacher"}
          role={user?.role || "Teacher"}
        />
      }
    >
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <PageHeader
          title="My Requests"
          subtitle="Track and manage all your photocopy requests."
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/teacher/create-request")}
          sx={{
            bgcolor: "#2E8B3C",
            borderRadius: 3,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              bgcolor: "#256F31",
            },
          }}
        >
          Create New Request
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* Small Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <SummaryCard
          title="Active Requests"
          value={activeRequests}
          subtitle="Currently in progress"
          icon={<PendingActionsIcon />}
          color="#2E8B3C"
          bg="#EAF7EE"
        />

        <SummaryCard
          title="Completed Requests"
          value={completedRequests}
          subtitle="Successfully completed"
          icon={<CheckCircleIcon />}
          color="#2563EB"
          bg="#EAF1FF"
        />

        <SummaryCard
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Waiting for review"
          icon={<Inventory2Icon />}
          color="#F59E0B"
          bg="#FFF4DE"
        />
      </Box>

      {/* Search and Filter Bar */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          mb: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 220px",
              },
              gap: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search request ID, purpose or subject..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Printing">Printing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Rejected by HOD">Rejected by HOD</MenuItem>
              <MenuItem value="Rejected by HOS">Rejected by HOS</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
          <Typography mt={2}>Loading requests...</Typography>
        </Box>
      )}

      {/* Empty State */}
      {!loading && sortedRequests.length === 0 && (
        <Card sx={{ borderRadius: 4, p: 4, textAlign: "center" }}>
          <Typography fontWeight={700}>No requests found.</Typography>
          <Typography color="text.secondary">
            Try changing your search or create a new request.
          </Typography>
        </Card>
      )}

      {/* Request Cards */}
      {!loading && paginatedRequests.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {paginatedRequests.map((request) => (
            <RequestCard
              key={request.RequestId}
              request={request}
              onView={() =>
                navigate(`/teacher/request-details/${request.RequestId}`)
              }
            />
          ))}

          {/* Pagination Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography color="text.secondary">
              Showing {(page - 1) * requestsPerPage + 1} to{" "}
              {Math.min(page * requestsPerPage, sortedRequests.length)} of{" "}
              {sortedRequests.length} requests
            </Typography>

            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            )}
          </Box>
        </Box>
      )}
    </DashboardLayout>
  );
}

// ============================================
// Summary Card Component
// ============================================

function SummaryCard({ title, value, subtitle, icon, color, bg }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 4,
              bgcolor: bg,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography fontWeight={700}>{title}</Typography>
            <Typography variant="h4" fontWeight={800}>
              {value}
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================
// Request Card Component
// Shows request details + workflow timeline
// ============================================

function RequestCard({ request, onView }) {
  const status = request.Status || "Pending";
  const statusStyle = getStatusStyle(status);

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "320px 1fr 220px",
            },
            gap: 3,
            alignItems: "center",
          }}
        >
          {/* Left Request Info */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 4,
                bgcolor: statusStyle.bg,
                color: statusStyle.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <DescriptionIcon />
            </Box>

            <Box>
              <Typography fontWeight={800} fontSize={18}>
                {request.RequestNumber}
              </Typography>

              <Typography fontWeight={700} color={statusStyle.color}>
                {request.PurposeName || "No purpose"}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                {request.TotalPages || 0} Pages • {request.TotalSheets || 0} Sheets
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography color="text.secondary" fontSize={13}>
                  Submitted:{" "}
                  {request.SubmittedAt
                    ? new Date(request.SubmittedAt).toLocaleDateString()
                    : "-"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Middle Workflow Timeline */}
          <WorkflowTimeline status={status} />

          {/* Right Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: {
                xs: "flex-start",
                lg: "flex-end",
              },
              gap: 2,
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: {
                  xs: "none",
                  lg: "block",
                },
              }}
            />

            <Box>
              <Chip
                label={status}
                sx={{
                  bgcolor: statusStyle.bg,
                  color: statusStyle.color,
                  fontWeight: 800,
                  mb: 1,
                }}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={onView}
                  sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 2,
                  }}
                >
                  <VisibilityIcon sx={{ color: "#2563EB" }} />
                </IconButton>

                <IconButton
                  disabled
                  sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 2,
                  }}
                >
                  <DownloadIcon sx={{ color: "#94A3B8" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================
// Workflow Timeline Component
// ============================================

function WorkflowTimeline({ status }) {
  const steps = getWorkflowSteps(status);

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          alignItems: "start",
          gap: 1,
        }}
      >
        {steps.map((step, index) => (
          <Box key={step.label} sx={{ position: "relative", textAlign: "center" }}>
            {index < steps.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 13,
                  left: "50%",
                  width: "100%",
                  height: 2,
                  bgcolor: step.done ? step.color : "#CBD5E1",
                  zIndex: 0,
                }}
              />
            )}

            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: step.active || step.done ? step.color : "#FFFFFF",
                border: `2px solid ${
                  step.active || step.done ? step.color : "#CBD5E1"
                }`,
                color: "#FFFFFF",
                mx: "auto",
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {step.done ? "✓" : step.rejected ? "×" : ""}
            </Box>

            <Typography
              fontSize={13}
              fontWeight={700}
              mt={1}
              color={step.active || step.done ? step.color : "#475569"}
            >
              {step.label}
            </Typography>

            <Typography
              fontSize={12}
              color={step.active ? step.color : "text.secondary"}
            >
              {step.caption}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ============================================
// Status Style Helper
// ============================================

function getStatusStyle(status) {
  const lower = status.toLowerCase();

  if (lower.includes("rejected")) {
    return { color: "#DC2626", bg: "#FEE2E2" };
  }

  if (lower.includes("completed")) {
    return { color: "#15803D", bg: "#DCFCE7" };
  }

  if (lower.includes("printing")) {
    return { color: "#2563EB", bg: "#DBEAFE" };
  }

  if (lower.includes("approved")) {
    return { color: "#15803D", bg: "#DCFCE7" };
  }

  return { color: "#D97706", bg: "#FEF3C7" };
}

// ============================================
// Workflow Helper
// ============================================

function getWorkflowSteps(status) {
  const lower = status.toLowerCase();

  const isRejected = lower.includes("rejected");
  const isPrinting = lower.includes("printing");
  const isCompleted = lower.includes("completed");
  const isApproved = lower.includes("approved");

  if (isRejected) {
    return [
      { label: "Submitted", caption: "Done", done: true, active: false, rejected: false, color: "#15803D" },
      { label: "HOD Review", caption: lower.includes("hod") ? "Rejected" : "Approved", done: !lower.includes("hod"), active: lower.includes("hod"), rejected: lower.includes("hod"), color: lower.includes("hod") ? "#DC2626" : "#15803D" },
      { label: "HOS Approval", caption: lower.includes("hos") ? "Rejected" : "Pending", done: false, active: lower.includes("hos"), rejected: lower.includes("hos"), color: lower.includes("hos") ? "#DC2626" : "#CBD5E1" },
      { label: "Printing", caption: "Pending", done: false, active: false, rejected: false, color: "#CBD5E1" },
    ];
  }

  return [
    { label: "Submitted", caption: "Done", done: true, active: false, color: "#15803D" },
    { label: "HOD Review", caption: isApproved || isPrinting || isCompleted ? "Approved" : "In Review", done: isApproved || isPrinting || isCompleted, active: lower.includes("pending"), color: isApproved || isPrinting || isCompleted ? "#15803D" : "#F59E0B" },
    { label: "HOS Approval", caption: isPrinting || isCompleted ? "Approved" : "Pending", done: isPrinting || isCompleted, active: isApproved, color: isPrinting || isCompleted ? "#15803D" : "#2563EB" },
    { label: "Printing", caption: isCompleted ? "Completed" : isPrinting ? "In Progress" : "Pending", done: isCompleted, active: isPrinting, color: isCompleted ? "#15803D" : "#2563EB" },
  ];
}