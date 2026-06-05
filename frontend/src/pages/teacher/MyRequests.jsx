// ============================================
// ARAB UNITY SCHOOL
// Photocopy Management System
// Teacher My Requests Page
// ============================================

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { recentRequestsData } from "../../data/dashboardData";

// ============================================
// Status Color Helper
// ============================================

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";

    case "Approved":
      return "success";

    case "Printing":
      return "info";

    case "Pending HOD":
      return "warning";

    case "Pending HOS":
      return "secondary";

    case "Rejected":
      return "error";

    default:
      return "default";
  }
};

// ============================================
// My Requests Page
// ============================================

export default function MyRequests() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#0F172A",
          }}
        >
          My Requests
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: "0.95rem",
          }}
        >
          View, monitor, and manage your photocopy requests.
        </Typography>
      </Box>

      {/* Filters Section */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr 1fr auto",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search request ID or purpose..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Status Filter */}
            <TextField
              select
              size="small"
              label="Status"
              defaultValue="All"
            >
              <MenuItem value="All">
                All
              </MenuItem>

              <MenuItem value="Pending HOD">
                Pending HOD
              </MenuItem>

              <MenuItem value="Pending HOS">
                Pending HOS
              </MenuItem>

              <MenuItem value="Approved">
                Approved
              </MenuItem>

              <MenuItem value="Printing">
                Printing
              </MenuItem>

              <MenuItem value="Completed">
                Completed
              </MenuItem>
            </TextField>

            {/* Purpose Filter */}
            <TextField
              select
              size="small"
              label="Purpose"
              defaultValue="All"
            >
              <MenuItem value="All">
                All
              </MenuItem>

              <MenuItem value="Worksheet">
                Worksheet
              </MenuItem>

              <MenuItem value="Homework">
                Homework
              </MenuItem>

              <MenuItem value="Friday Exam">
                Friday Exam
              </MenuItem>

              <MenuItem value="Revision Material">
                Revision Material
              </MenuItem>
            </TextField>

            {/* Create Request */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                navigate("/teacher/create-request")
              }
              sx={{
                textTransform: "none",
              }}
            >
              Create Request
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Request Table */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          {/* Table Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Request List
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Showing {recentRequestsData.length} requests
            </Typography>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Request ID
                  </TableCell>

                  <TableCell>
                    Purpose
                  </TableCell>

                  <TableCell>
                    Pages
                  </TableCell>

                  <TableCell>
                    Sheets
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                  <TableCell>
                    Submitted Date
                  </TableCell>

                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentRequestsData.map(
                  (request) => (
                    <TableRow
                      key={request.id}
                      hover
                    >
                      <TableCell
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {request.id}
                      </TableCell>

                      <TableCell>
                        {request.purpose}
                      </TableCell>

                      <TableCell>
                        {request.pages}
                      </TableCell>

                      <TableCell>
                        {request.sheets}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={request.status}
                          color={getStatusColor(
                            request.status
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        {
                          request.submittedDate
                        }
                      </TableCell>

                      <TableCell align="right">
                        {/* View */}
                        <IconButton
                          onClick={() =>
                            navigate(
                              `/teacher/request-details/${request.id}`
                            )
                          }
                        >
                          <VisibilityIcon
                            sx={{
                              color:
                                "#2563EB",
                            }}
                          />
                        </IconButton>

                        {/* Download */}
                        <IconButton>
                          <DownloadIcon
                            sx={{
                              color:
                                "#10B981",
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}