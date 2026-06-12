// ============================================
// ARAB UNITY SCHOOL
// Printing Admin Dashboard
// Connected to Backend Live Data
// ============================================

// React hooks
import { useEffect, useState } from "react";

// Layout components
import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DateFilter from "../../components/common/DateFilter";

// MUI components
import {
  Alert,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// MUI icons
import {
  Assignment,
  Print,
  PendingActions,
  CheckCircle,
} from "@mui/icons-material";

// Reusable dashboard components
import KPIGrid from "../../components/dashboard/KPIGrid";
import DashboardCard from "../../components/dashboard/DashboardCard";

// Auth context
import { useAuth } from "../../context/AuthContext";

// Printing API service
import {
  getPrintingDashboard,
  getPrintingRequests,
  getPrintingHistory,
  startPrintingRequest,
  completePrintingRequest,
} from "../../services/printingService";

export default function PrintingDashboard() {
  // Get logged-in user
  const { user } = useAuth();

  // ============================================
  // KPI state
  // ============================================
  const [dashboard, setDashboard] = useState({
    TotalAssigned: 0,
    PendingPrintQueue: 0,
    InProgress: 0,
    Completed: 0,
    CompletedToday: 0,
  });

  // Print queue requests
  const [requests, setRequests] = useState([]);

  // Printing history
  const [history, setHistory] = useState([]);

  // Page loading/error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // Convert backend request data to frontend format
  // ============================================
  const mapRequest = (item) => ({
    id: item.RequestId,
    requestNumber: item.RequestNumber,
    teacher: item.TeacherName,
    employeeId: item.EmployeeId,
    department: item.DepartmentName,
    subject: item.SubjectName,
    purpose: item.PurposeName,
    copies: item.Copies,
    pages: item.TotalPages,
    sheets: item.TotalSheets,
    priority: item.PriorityLevel,
    status: item.Status,
    paperSize: item.PaperSize,
    printType: item.PrintType,
    printSide: item.PrintSide,
    isExam: item.IsExam,
    requestRemarks: item.RequestRemarks,

    submittedDate: item.SubmittedAt
      ? new Date(item.SubmittedAt).toLocaleDateString()
      : "-",

    approvedDate: item.ApprovedAt
      ? new Date(item.ApprovedAt).toLocaleDateString()
      : "-",

    printedDate: item.PrintedAt
      ? new Date(item.PrintedAt).toLocaleDateString()
      : "-",

    completedDate: item.CompletedAt
      ? new Date(item.CompletedAt).toLocaleDateString()
      : "-",
  });

  // ============================================
  // Convert backend printing history to frontend format
  // ============================================
  const mapHistory = (item) => ({
    id: item.PrintingLogId,
    requestId: item.RequestId,
    requestNumber: item.RequestNumber,
    teacher: item.TeacherName,
    employeeId: item.EmployeeId,
    department: item.DepartmentName,
    subject: item.SubjectName,
    purpose: item.PurposeName,
    printedBy: item.PrintedByName,
    printedPages: item.PrintedPages,
    printedSheets: item.PrintedSheets,
    remarks: item.Remarks,
    status: item.Status,

    printedDate: item.PrintedAt
      ? new Date(item.PrintedAt).toLocaleDateString()
      : "-",
  });

  // ============================================
  // Fetch dashboard, print queue, and history
  // ============================================
  const fetchPrintingData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, requestsData, historyData] =
        await Promise.all([
          getPrintingDashboard(),
          getPrintingRequests(),
          getPrintingHistory(),
        ]);

      setDashboard({
        TotalAssigned: dashboardData.TotalAssigned || 0,
        PendingPrintQueue: dashboardData.PendingPrintQueue || 0,
        InProgress: dashboardData.InProgress || 0,
        Completed: dashboardData.Completed || 0,
        CompletedToday: dashboardData.CompletedToday || 0,
      });

      setRequests(requestsData.map(mapRequest));
      setHistory(historyData.map(mapHistory));
    } catch (err) {
      console.error(
        "Fetch Printing Data Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load printing dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data when page opens
  useEffect(() => {
    fetchPrintingData();
  }, []);

  // ============================================
  // Start printing request
  // ============================================
  const handleStartPrinting = async (requestId) => {
    try {
      await startPrintingRequest(requestId);

      alert("Printing started successfully.");

      await fetchPrintingData();
    } catch (err) {
      console.error(
        "Start Printing Error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Unable to start printing."
      );
    }
  };

  // ============================================
  // Complete printing request
  // ============================================
  const handleCompletePrinting = async (requestId) => {
    try {
      await completePrintingRequest(
        requestId,
        "Printing completed"
      );

      alert("Printing completed successfully.");

      await fetchPrintingData();
    } catch (err) {
      console.error(
        "Complete Printing Error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Unable to complete printing."
      );
    }
  };

  // ============================================
  // KPI cards
  // ============================================
  const printingStats = [
    {
      title: "Print Queue",
      value: dashboard.PendingPrintQueue,
      subtitle: "Waiting to Print",
    },
    {
      title: "In Progress",
      value: dashboard.InProgress,
      subtitle: "Currently Printing",
    },
    {
      title: "Completed Today",
      value: dashboard.CompletedToday,
      subtitle: "Finished Today",
    },
    {
      title: "Total Completed",
      value: dashboard.Completed,
      subtitle: "All Completed Jobs",
    },
  ];

  // KPI icons
  const icons = [
    <Assignment />,
    <PendingActions />,
    <Print />,
    <CheckCircle />,
  ];

  return (
    <DashboardLayout
      sidebar={<Sidebar role="printing" />}
      topbar={
        <Topbar
          userName={user?.fullName || "Printing Admin"}
          role={user?.role || "PrintingAdmin"}
        />
      }
    >
      {/* Page header */}
      <PageHeader
        title="Printing Dashboard"
        subtitle="Manage approved photocopy requests and printing completion."
        action={<DateFilter label="May 1 - May 31, 2025" />}
      />

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {loading ? (
        <Typography>Loading printing dashboard data...</Typography>
      ) : (
        <>
          {/* KPI cards */}
          <KPIGrid stats={printingStats} icons={icons} />

          {/* Print Queue Table */}
          <Box sx={{ mt: 4 }}>
            <DashboardCard title="Print Queue">
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Teacher</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Sheets</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* Empty queue */}
                    {requests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography color="text.secondary">
                            No requests in print queue.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Queue rows */}
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {request.requestNumber}
                        </TableCell>

                        <TableCell>
                          {request.teacher}
                        </TableCell>

                        <TableCell>
                          {request.department}
                        </TableCell>

                        <TableCell>
                          {request.subject}
                        </TableCell>

                        <TableCell>
                          {request.sheets}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={request.priority || "Normal"}
                            size="small"
                            color={
                              request.priority === "Urgent"
                                ? "error"
                                : "default"
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={request.status}
                            size="small"
                            color={
                              request.status === "Printing"
                                ? "info"
                                : "warning"
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          {/* Start Printing */}
                          {request.status !== "Printing" && (
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() =>
                                handleStartPrinting(request.id)
                              }
                            >
                              Start
                            </Button>
                          )}

                          {/* Complete Printing */}
                          {request.status === "Printing" && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() =>
                                handleCompletePrinting(request.id)
                              }
                            >
                              Complete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </DashboardCard>
          </Box>

          {/* Printing History */}
          <Box sx={{ mt: 4 }}>
            <DashboardCard title="Printing History">
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Teacher</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Sheets</TableCell>
                      <TableCell>Printed By</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* Empty history */}
                    {history.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="text.secondary">
                            No printing history available.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* History rows */}
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.requestNumber}
                        </TableCell>

                        <TableCell>
                          {item.teacher}
                        </TableCell>

                        <TableCell>
                          {item.department}
                        </TableCell>

                        <TableCell>
                          {item.subject}
                        </TableCell>

                        <TableCell>
                          {item.printedSheets}
                        </TableCell>

                        <TableCell>
                          {item.printedBy}
                        </TableCell>

                        <TableCell>
                          {item.printedDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </DashboardCard>
          </Box>
        </>
      )}
    </DashboardLayout>
  );
}