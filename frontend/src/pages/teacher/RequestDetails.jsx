// ============================================
// ARAB UNITY SCHOOL
// Photocopy Management System
// Teacher Request Details Page
// ============================================

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

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
    <DashboardLayout>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Request Details
          </Typography>

          <Typography sx={{ color: "#64748B" }}>
            Track your request status and uploaded documents.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/teacher/my-requests")}
        >
          Back
        </Button>
      </Box>

      {/* Main Grid */}
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
          <Card sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Request Information
              </Typography>

              <InfoRow label="Request ID" value={request.id} />
              <InfoRow label="Purpose" value={request.purpose} />
              <InfoRow label="Submitted Date" value={request.submittedDate} />
              <InfoRow label="Required Date" value={request.requiredDate} />
              <InfoRow label="Total Pages" value={request.totalPages} />
              <InfoRow label="Total Sheets" value={request.totalSheets} />

              <Box mt={2}>
                <Chip label={request.status} color="warning" />
              </Box>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Documents
              </Typography>

              {request.documents.map((doc) => (
                <Box
                  key={doc.name}
                  sx={{
                    p: 2,
                    border: "1px solid #E5E7EB",
                    borderRadius: 3,
                    mb: 2,
                  }}
                >
                  <Typography fontWeight={700}>{doc.name}</Typography>

                  <Typography color="text.secondary" fontSize={14}>
                    {doc.pages} pages • {doc.copies} copies • {doc.sheets} sheets
                  </Typography>

                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    sx={{ mt: 1 }}
                  >
                    Download
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column */}
        <Box>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Approval Flow
              </Typography>

              {request.approvalFlow.map((item, index) => (
                <Box key={item.step}>
                  <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                    {item.status === "Completed" ? (
                      <CheckCircleIcon sx={{ color: "#10B981" }} />
                    ) : (
                      <PendingIcon sx={{ color: "#F59E0B" }} />
                    )}

                    <Box>
                      <Typography fontWeight={700}>{item.step}</Typography>
                      <Typography color="text.secondary" fontSize={13}>
                        {item.remarks}
                      </Typography>
                    </Box>
                  </Box>

                  {index !== request.approvalFlow.length - 1 && <Divider sx={{ mb: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

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