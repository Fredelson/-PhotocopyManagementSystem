// ============================================
// ARAB UNITY SCHOOL
// Teacher - Request Details Page
// Uses reusable DashboardLayout, PageHeader,
// DashboardCard, StatusChip, and ApprovalTimeline
// ============================================

import { Box, Typography, Button } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";
import StatusChip from "../../components/common/StatusChip";
import ApprovalTimeline from "../../components/common/ApprovalTimeline";

const request = {
  id: "REQ-2026-002",
  purpose: "Friday Exam",
  status: "Pending HOD",
  submittedDate: "2026-06-02",
  requiredDate: "2026-06-06",
  totalPages: 300,
  totalSheets: 150,
  documents: [
    {
      name: "Year 5 Friday Exam.pdf",
      pages: 100,
      copies: 3,
      sheets: 150,
      fileType: "PDF",
    },
  ],
  approvalFlow: [
    {
      step: "Teacher",
      status: "Completed",
      remarks: "Request submitted successfully.",
    },
    {
      step: "HOD",
      status: "Pending",
      remarks: "Waiting for approval.",
    },
    {
      step: "Admin Printing",
      status: "Waiting",
      remarks: "Will be available after approval.",
    },
  ],
};

export default function RequestDetails() {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      sidebar={<Sidebar role="teacher" />}
      topbar={<Topbar userName="Ahmed Khan" role="Teacher" />}
    >
      {/* Page Header */}
      <PageHeader
        title="Request Details"
        subtitle="Track your request status and uploaded documents."
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/teacher/my-requests")}
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>
        }
      />

      {/* Main Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Left Column */}
        <Box>
          {/* Request Information */}
          <DashboardCard title="Request Information" sx={{ mb: 3 }}>
            <InfoRow label="Request ID" value={request.id} />
            <InfoRow label="Purpose" value={request.purpose} />
            <InfoRow label="Submitted Date" value={request.submittedDate} />
            <InfoRow label="Required Date" value={request.requiredDate} />
            <InfoRow label="Total Pages" value={request.totalPages} />
            <InfoRow label="Total Sheets" value={request.totalSheets} />

            <Box mt={2}>
              <StatusChip status={request.status} />
            </Box>
          </DashboardCard>

          {/* Documents */}
          <DashboardCard title="Documents">
            {request.documents.map((doc) => (
              <Box
                key={doc.name}
                sx={{
                  p: 2,
                  border: "1px solid #E5E7EB",
                  borderRadius: 3,
                  mb: 2,
                  backgroundColor: "#F8FAFC",
                }}
              >
                <Typography fontWeight={700}>{doc.name}</Typography>

                <Typography color="text.secondary" fontSize={14}>
                  {doc.pages} pages • {doc.copies} copies • {doc.sheets} sheets
                </Typography>

                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                  }}
                >
                  Download
                </Button>
              </Box>
            ))}
          </DashboardCard>
        </Box>

        {/* Right Column */}
        <Box>
          <DashboardCard title="Approval Flow">
            <ApprovalTimeline steps={request.approvalFlow} />
          </DashboardCard>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

// ============================================
// Reusable Info Row
// Displays label and value inside request details
// ============================================

function InfoRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 1.5,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700}>{value}</Typography>
    </Box>
  );
}