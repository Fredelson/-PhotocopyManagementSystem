// ============================================
// ARAB UNITY SCHOOL
// Printing Management Dashboard Data
//
// Purpose:
// Temporary dashboard data for Printing Admin
// until backend APIs are connected.
//
// Future Backend:
// - GET /api/printing/dashboard/kpis
// - GET /api/printing/dashboard/activity
// - GET /api/printing/dashboard/job-status
// - GET /api/printing/dashboard/inventory
// - GET /api/printing/dashboard/recent-jobs
// ============================================

import { dashboardColors } from "../../../theme/dashboardColors";

// KPI Icons
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

// ============================================
// KPI CARDS
// ============================================

export const printingDashboardStats = [
  {
    title: "Pending Jobs",
    value: "27",
    change: "+5",
    changeLabel: "awaiting action",
    icon: PendingActionsOutlinedIcon,
    color: dashboardColors.warning,
  },
  {
    title: "Printing Now",
    value: "4",
    change: "",
    changeLabel: "active jobs",
    icon: LocalPrintshopOutlinedIcon,
    color: dashboardColors.printing,
  },
  {
    title: "Completed Today",
    value: "18",
    change: "+6",
    changeLabel: "vs yesterday",
    icon: CheckCircleOutlineOutlinedIcon,
    color: dashboardColors.success,
  },
  {
    title: "Completed Month",
    value: "326",
    change: "+42",
    changeLabel: "this month",
    icon: CalendarMonthOutlinedIcon,
    color: dashboardColors.info,
  },
  {
    title: "A4 Stock",
    value: "12,450",
    change: "",
    changeLabel: "sheets available",
    icon: Inventory2OutlinedIcon,
    color: dashboardColors.inventory,
  },
  {
    title: "A3 Stock",
    value: "1,280",
    change: "Low",
    changeLabel: "monitor stock",
    icon: WarningAmberOutlinedIcon,
    color: dashboardColors.danger,
  },
];

// ============================================
// PRINT ACTIVITY CHART
// ============================================

export const printActivityData = [
  { month: "May 1", printRequests: 45, tickets: 8 },
  { month: "May 5", printRequests: 62, tickets: 11 },
  { month: "May 9", printRequests: 58, tickets: 9 },
  { month: "May 13", printRequests: 74, tickets: 13 },
  { month: "May 17", printRequests: 69, tickets: 10 },
  { month: "May 21", printRequests: 88, tickets: 15 },
  { month: "May 25", printRequests: 95, tickets: 14 },
  { month: "May 29", printRequests: 103, tickets: 16 },
];

// ============================================
// JOB STATUS
// ============================================

export const printJobStatus = [
  { key: "pending", label: "Pending", value: 27 },
  { key: "printing", label: "Printing", value: 4 },
  { key: "completed", label: "Completed", value: 18 },
  { key: "rejected", label: "Rejected", value: 3 },
];

// ============================================
// INVENTORY HEALTH
// ============================================

export const inventoryHealth = [
  { label: "A4 Paper", status: "Healthy", value: 82 },
  { label: "A3 Paper", status: "Low", value: 34 },
  { label: "Monthly Usage", status: "68%", value: 68 },
  { label: "Deduction Service", status: "Active", value: 100 },
  { label: "Purchase Module", status: "Connected", value: 100 },
  { label: "Stock Alerts", status: "Enabled", value: 100 },
];

// ============================================
// RECENT PRINT JOBS
// ============================================

export const recentPrintJobs = [
  {
    title: "REQ-2026-00127 completed",
    description: "English Worksheets • 120 sheets",
    time: "10:45 AM",
  },
  {
    title: "REQ-2026-00128 started printing",
    description: "Math Assessment • 80 sheets",
    time: "10:30 AM",
  },
  {
    title: "REQ-2026-00129 awaiting approval",
    description: "Science Revision Pack • 230 sheets",
    time: "10:15 AM",
  },
  {
    title: "A4 stock adjusted",
    description: "Added 5 reams to inventory",
    time: "09:50 AM",
  },
];

// ============================================
// TOP DEPARTMENTS
// ============================================

export const topPrintingDepartments = [
  {
    label: "Primary",
    value: 820,
    color: dashboardColors.printing,
  },
  {
    label: "Secondary",
    value: 690,
    color: dashboardColors.info,
  },
  {
    label: "FS",
    value: 420,
    color: dashboardColors.success,
  },
  {
    label: "Sixth Form",
    value: 260,
    color: dashboardColors.tickets,
  },
  {
    label: "Inclusion",
    value: 180,
    color: dashboardColors.assets,
  },
];

// ============================================
// PAPER USAGE STATUS
// ============================================

export const paperUsageStatus = [
  { key: "active", label: "A4 Used", value: 74 },
  { key: "inProgress", label: "A4 Remaining", value: 26 },
  { key: "comingSoon", label: "A3 Used", value: 42 },
  { key: "disabled", label: "A3 Remaining", value: 58 },
];

// ============================================
// INVENTORY ALERTS / PENDING ACTIONS
// ============================================

export const printingPendingActions = [
  {
    title: "A3 stock below threshold",
    module: "Paper Inventory",
    requestedBy: "System",
    time: "Today • 10:20 AM",
    status: "Pending",
  },
  {
    title: "5 print jobs waiting",
    module: "Print Queue",
    requestedBy: "Teachers",
    time: "Today • 10:05 AM",
    status: "Pending",
  },
  {
    title: "Paper purchase request",
    module: "Inventory",
    requestedBy: "Printing Admin",
    time: "Today • 09:40 AM",
    status: "Pending",
  },
];

// ============================================
// PAPER INVENTORY SUMMARY
// ============================================

export const paperInventorySummary = [
  {
    paperType: "A4 Paper",
    current: 12450,
    total: 15000,
    minimum: 3000,
  },
  {
    paperType: "A3 Paper",
    current: 1280,
    total: 6000,
    minimum: 1500,
  },
];

// ============================================
// DEFAULT DASHBOARD DATA
// ============================================

export const defaultPrintingDashboardData = {
  stats: printingDashboardStats,
  printActivity: printActivityData,
  jobStatus: printJobStatus,
  inventoryHealth,
  recentJobs: recentPrintJobs,
  topDepartments: topPrintingDepartments,
  paperUsage: paperUsageStatus,
  pendingActions: printingPendingActions,
  inventorySummary: paperInventorySummary,
};
