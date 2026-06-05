export const dashboardStats = [
  {
    title: "Total Requests",
    value: 145,
    color: "#2563EB",
  },

  {
    title: "Pages Printed",
    value: "24,520",
    color: "#10B981",
  },

  {
    title: "Sheets Used",
    value: "18,220",
    color: "#F59E0B",
  },

  {
    title: "Pending Approval",
    value: 12,
    color: "#EF4444",
  },

  {
    title: "Approved",
    value: 98,
    color: "#8B5CF6",
  },

  {
    title: "Completed",
    value: 112,
    color: "#06B6D4",
  },
];

// ============================================
// Monthly Usage Chart Data
// ============================================

export const monthlyUsageData = [
  {
    month: "Dec",
    pages: 12000,
    sheets: 9000,
  },
  {
    month: "Jan",
    pages: 14500,
    sheets: 11500,
  },
  {
    month: "Feb",
    pages: 16500,
    sheets: 13500,
  },
  {
    month: "Mar",
    pages: 19000,
    sheets: 16000,
  },
  {
    month: "Apr",
    pages: 21000,
    sheets: 17500,
  },
  {
    month: "May",
    pages: 28000,
    sheets: 22000,
  },
];

// ============================================
// Purpose Breakdown Chart Data
// Shows teacher photocopy request purposes
// ============================================

export const purposeBreakdownData = [
  { name: "Worksheet", value: 35 },
  { name: "Homework", value: 20 },
  { name: "Friday Exam", value: 15 },
  { name: "Revision", value: 12 },
  { name: "Board Work", value: 10 },
  { name: "Other", value: 8 },
];

// ============================================
// Request Status Overview Data
// Shows how many requests are in each status
// ============================================

export const requestStatusData = [
  { status: "Draft", count: 5, color: "#94A3B8" },
  { status: "Submitted", count: 8, color: "#2563EB" },
  { status: "Pending HOD", count: 12, color: "#F59E0B" },
  { status: "Pending HOS", count: 4, color: "#8B5CF6" },
  { status: "Approved", count: 28, color: "#10B981" },
  { status: "Completed", count: 88, color: "#06B6D4" },
];

// ============================================
// Recent Requests Table Data
// Shows latest photocopy requests by teacher
// ============================================

export const recentRequestsData = [
  {
    id: "REQ-2026-001",
    purpose: "Worksheet",
    pages: 120,
    sheets: 60,
    status: "Completed",
    submittedDate: "2026-06-01",
  },
  {
    id: "REQ-2026-002",
    purpose: "Friday Exam",
    pages: 300,
    sheets: 150,
    status: "Pending HOD",
    submittedDate: "2026-06-02",
  },
  {
    id: "REQ-2026-003",
    purpose: "Revision Material",
    pages: 80,
    sheets: 40,
    status: "Approved",
    submittedDate: "2026-06-03",
  },
  {
    id: "REQ-2026-004",
    purpose: "Homework",
    pages: 50,
    sheets: 25,
    status: "Printing",
    submittedDate: "2026-06-04",
  },
];

// ============================================
// Request Progress Tracker Data
// Shows workflow progress for latest request
// ============================================

export const requestProgressData = [
  {
    label: "Draft",
    description: "Request created as draft",
    completed: true,
  },
  {
    label: "Submitted",
    description: "Request submitted by teacher",
    completed: true,
  },
  {
    label: "HOD Approval",
    description: "Waiting for HOD approval",
    completed: true,
  },
  {
    label: "HOS Approval",
    description: "Required only if sheets exceed 500",
    completed: false,
  },
  {
    label: "Printing",
    description: "Admin printing process",
    completed: false,
  },
  {
    label: "Completed",
    description: "Request completed and printed",
    completed: false,
  },
];

// ============================================
// Quick Actions Data
// Teacher shortcut buttons
// ============================================

export const quickActionsData = [
  {
    title: "Create Request",
    description: "Submit a new photocopy request",
    color: "#2563EB",
  },
  {
    title: "Upload Attachment",
    description: "Upload documents or images",
    color: "#10B981",
  },
  {
    title: "View Reports",
    description: "View your request reports",
    color: "#F59E0B",
  },
  {
    title: "Download History",
    description: "Download your request history",
    color: "#8B5CF6",
  },
];

export const recentAttachmentsData = [
  {
    id: 1,
    name: "Year 5 Worksheet.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedDate: "2026-06-01",
  },
  {
    id: 2,
    name: "Friday Exam.docx",
    type: "DOCX",
    size: "1.1 MB",
    uploadedDate: "2026-06-02",
  },
  {
    id: 3,
    name: "Board Work Image.png",
    type: "PNG",
    size: "850 KB",
    uploadedDate: "2026-06-03",
  },
  {
    id: 4,
    name: "Revision Slides.pptx",
    type: "PPTX",
    size: "5.7 MB",
    uploadedDate: "2026-06-04",
  },
];

export const attachmentSummaryData = [
  {
    title: "Documents Uploaded",
    value: 48,
    color: "#2563EB",
  },
  {
    title: "Images Uploaded",
    value: 36,
    color: "#10B981",
  },
  {
    title: "Storage Used",
    value: "1.8 GB",
    color: "#F59E0B",
  },
  {
    title: "Total Downloads",
    value: 124,
    color: "#8B5CF6",
  },
];

// ============================================
// Purpose Usage Trend Data
// ============================================

export const purposeTrendData = [
  {
    month: "Dec",
    worksheet: 8000,
    exam: 5000,
    homework: 3000,
    others: 2000,
  },
  {
    month: "Jan",
    worksheet: 9500,
    exam: 6000,
    homework: 3500,
    others: 2500,
  },
  {
    month: "Feb",
    worksheet: 8500,
    exam: 5500,
    homework: 3000,
    others: 2200,
  },
  {
    month: "Mar",
    worksheet: 12000,
    exam: 8000,
    homework: 5000,
    others: 3500,
  },
  {
    month: "Apr",
    worksheet: 10000,
    exam: 6500,
    homework: 5200,
    others: 3300,
  },
  {
    month: "May",
    worksheet: 15000,
    exam: 11000,
    homework: 6500,
    others: 4200,
  },
];