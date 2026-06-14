// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard
// Recent Requests Table Component
// Connected to live backend dashboard data
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

import StatusChip from "../common/StatusChip";

// ============================================
// Format Submitted Date
// ============================================

const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================
// Recent Requests Table Component
// ============================================

export default function RecentRequestsTable({ requests = [] }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        height: "100%",
        minWidth: 0,
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            My Recent Requests
          </Typography>

          <Button
            size="small"
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            View All
          </Button>
        </Box>

        {/* Responsive Table Wrapper */}
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Sheets</TableCell>
                <TableCell>Pages</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No recent requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.RequestId} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {request.RequestNumber || "-"}
                    </TableCell>

                    <TableCell>
                      {request.PurposeName || "-"}
                    </TableCell>

                    <TableCell>
                      {request.TotalSheets || 0}
                    </TableCell>

                    <TableCell>
                      {request.TotalPages || 0}
                    </TableCell>

                    <TableCell>
                      <StatusChip status={request.Status} />
                    </TableCell>

                    <TableCell>
                      {formatDate(request.SubmittedAt)}
                    </TableCell>

                    <TableCell align="right">
                      <VisibilityIcon
                        sx={{
                          fontSize: 18,
                          mr: 1,
                          color: "#1E3A8A",
                          cursor: "pointer",
                        }}
                      />

                      <DownloadIcon
                        sx={{
                          fontSize: 18,
                          color: "#1E3A8A",
                          cursor: "pointer",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Showing {requests.length} recent requests
        </Typography>
      </CardContent>
    </Card>
  );
}