// ============================================
// ARAB UNITY SCHOOL
// Teacher - Create Request Page
// Connected to Backend API
// Uses live Department, Subject, and Purpose dropdowns
// ============================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";

import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

// ============================================
// Create empty document row
// ============================================
const createEmptyDocument = () => ({
  id: Date.now(),
  documentName: "",
  file: null,
  pages: 1,
  copies: 1,
  paperSize: "A4",
  printType: "Single-Sided",
  printColor: "Black & White",
});

export default function CreateRequest() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // ============================================
  // Lookup Data State
  // ============================================
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [purposes, setPurposes] = useState([]);

  // ============================================
  // Selected Lookup Values
  // ============================================
  const [departmentId, setDepartmentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [purposeId, setPurposeId] = useState("");

  // ============================================
  // Form State
  // ============================================
  const [customPurpose, setCustomPurpose] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [remarks, setRemarks] = useState("");
  const [documents, setDocuments] = useState([createEmptyDocument()]);

  // ============================================
  // Page State
  // ============================================
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // Load Department, Subject, and Purpose dropdowns
  // ============================================
  useEffect(() => {
    const loadLookups = async () => {
      try {
        if (!token) return;

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [deptRes, subjectRes, purposeRes] = await Promise.all([
          axios.get(`${API_URL}/lookups/departments`, { headers }),
          axios.get(`${API_URL}/lookups/subjects`, { headers }),
          axios.get(`${API_URL}/lookups/purposes`, { headers }),
        ]);

        setDepartments(deptRes.data);
        setSubjects(subjectRes.data);
        setPurposes(purposeRes.data);

        // Default department to teacher department if available
        if (deptRes.data.length > 0) {
          setDepartmentId(user?.departmentId || deptRes.data[0].DepartmentId);
        }

        // Default subject to first active subject
        if (subjectRes.data.length > 0) {
          setSubjectId(subjectRes.data[0].SubjectId);
        }

        // Default purpose to first active purpose
        if (purposeRes.data.length > 0) {
          setPurposeId(purposeRes.data[0].PurposeId);
        }
      } catch (err) {
        console.error("Lookup Load Error:", err);
        setError("Unable to load dropdown data.");
      }
    };

    loadLookups();
  }, [token, user]);

  // ============================================
  // Update one document field
  // ============================================
  const updateDocument = (id, field, value) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  // ============================================
  // Add new document row
  // ============================================
  const addDocument = () => {
    setDocuments((prev) => [
      ...prev,
      {
        ...createEmptyDocument(),
        id: Date.now() + Math.random(),
      },
    ]);
  };

  // ============================================
  // Remove document row
  // Always keep at least one document
  // ============================================
  const removeDocument = (id) => {
    setDocuments((prev) =>
      prev.length === 1 ? prev : prev.filter((doc) => doc.id !== id)
    );
  };

  // ============================================
  // Calculate request summary
  // totalPages = pages x copies
  // totalSheets changes based on single/double sided
  // ============================================
  const summary = useMemo(() => {
    return documents.reduce(
      (total, doc) => {
        const pages = Number(doc.pages) || 0;
        const copies = Number(doc.copies) || 0;
        const printedPages = pages * copies;

        const sheets =
          doc.printType === "Double-Sided"
            ? Math.ceil(printedPages / 2)
            : printedPages;

        return {
          totalPages: total.totalPages + printedPages,
          totalSheets: total.totalSheets + sheets,
          totalCopies: total.totalCopies + copies,
          totalA4: total.totalA4 + (doc.paperSize === "A4" ? sheets : 0),
          totalA3: total.totalA3 + (doc.paperSize === "A3" ? sheets : 0),
        };
      },
      {
        totalPages: 0,
        totalSheets: 0,
        totalCopies: 0,
        totalA4: 0,
        totalA3: 0,
      }
    );
  }, [documents]);

  // ============================================
  // Approval route preview
  // New correct workflow:
  // Teacher -> HOD -> Printing Admin
  // Teacher -> HOD -> HOS -> Printing Admin if > 500 sheets
  // ============================================
  const approvalFlow =
    summary.totalSheets <= 500
      ? ["Teacher", "HOD", "Printing Admin"]
      : ["Teacher", "HOD", "HOS", "Printing Admin"];

  // ============================================
  // Submit Request
  // Calls backend:
  // POST /api/requests
  // Backend routes to matching Department + Subject HOD
  // ============================================
  const handleSubmitRequest = async () => {
    try {
      setError("");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      if (!departmentId) {
        setError("Please select a department.");
        return;
      }

      if (!subjectId) {
        setError("Please select a subject.");
        return;
      }

      if (!purposeId) {
        setError("Please select a purpose.");
        return;
      }

      if (summary.totalPages <= 0 || summary.totalSheets <= 0) {
        setError("Total pages and sheets must be greater than zero.");
        return;
      }

      setSubmitting(true);

      const mainDocument = documents[0];

      // ============================================
      // Request payload sent to backend
      // ============================================
      const payload = {
        departmentId: Number(departmentId),
        subjectId: Number(subjectId),
        purposeId: Number(purposeId),
        copies: Number(mainDocument.copies),
        totalPages: summary.totalPages,
        totalSheets: summary.totalSheets,
        priorityLevel: priority,
      };

      const response = await axios.post(`${API_URL}/requests`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Request Created:", response.data);

      navigate("/teacher/my-requests");
    } catch (err) {
      console.error("Create Request Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
      {/* ============================================
          Page Header
      ============================================ */}
      <PageHeader
        title="Create Photocopy Request"
        subtitle="Select department, subject, purpose, and documents for approval."
      />

      {/* ============================================
          Error Message
      ============================================ */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ============================================
          Main Layout
      ============================================ */}
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
        {/* ============================================
            Left Column
        ============================================ */}
        <Box>
          {/* ============================================
              Request Information Card
          ============================================ */}
          <DashboardCard title="Request Information" sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 3,
              }}
            >
              {/* Department Dropdown */}
              <TextField
                select
                label="Department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                fullWidth
              >
                {departments.map((department) => (
                  <MenuItem
                    key={department.DepartmentId}
                    value={department.DepartmentId}
                  >
                    {department.DepartmentName}
                  </MenuItem>
                ))}
              </TextField>

              {/* Subject Dropdown */}
              <TextField
                select
                label="Subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                fullWidth
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.SubjectId} value={subject.SubjectId}>
                    {subject.SubjectName}
                  </MenuItem>
                ))}
              </TextField>

              {/* Purpose Dropdown */}
              <TextField
                select
                label="Purpose"
                value={purposeId}
                onChange={(e) => setPurposeId(e.target.value)}
                fullWidth
              >
                {purposes.map((purpose) => (
                  <MenuItem key={purpose.PurposeId} value={purpose.PurposeId}>
                    {purpose.PurposeName}
                  </MenuItem>
                ))}
              </TextField>

              {/* Required Date */}
              <TextField
                type="date"
                label="Required Date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
              />

              {/* Priority */}
              <TextField
                select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                fullWidth
              >
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
              </TextField>

              {/* Custom Purpose - optional future use */}
              {purposeId === "Other" && (
                <TextField
                  label="Custom Purpose"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  fullWidth
                />
              )}
            </Box>

            {/* Remarks */}
            <Box sx={{ mt: 3 }}>
              <TextField
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                multiline
                rows={4}
                fullWidth
              />
            </Box>
          </DashboardCard>

          {/* ============================================
              Documents Card
          ============================================ */}
          <DashboardCard
            title="Documents"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addDocument}
                sx={{ textTransform: "none" }}
              >
                Add Document
              </Button>
            }
          >
            {documents.map((doc, index) => {
              const printedPages =
                (Number(doc.pages) || 0) * (Number(doc.copies) || 0);

              const sheets =
                doc.printType === "Double-Sided"
                  ? Math.ceil(printedPages / 2)
                  : printedPages;

              return (
                <Box
                  key={doc.id}
                  sx={{
                    p: 2.5,
                    mb: 3,
                    border: "1px solid #E5E7EB",
                    borderRadius: 3,
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  {/* Document Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography fontWeight={700}>
                      Document #{index + 1}
                    </Typography>

                    <IconButton
                      color="error"
                      disabled={documents.length === 1}
                      onClick={() => removeDocument(doc.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {/* Document Fields */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                      },
                      gap: 2,
                    }}
                  >
                    {/* Document Name */}
                    <TextField
                      label="Document Name"
                      value={doc.documentName}
                      onChange={(e) =>
                        updateDocument(doc.id, "documentName", e.target.value)
                      }
                      fullWidth
                    />

                    {/* File Upload */}
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        height: 56,
                      }}
                    >
                      {doc.file ? doc.file.name : "Upload File"}
                      <input
                        hidden
                        type="file"
                        onChange={(e) =>
                          updateDocument(doc.id, "file", e.target.files[0])
                        }
                      />
                    </Button>

                    {/* Pages */}
                    <TextField
                      type="number"
                      label="Pages"
                      value={doc.pages}
                      onChange={(e) =>
                        updateDocument(doc.id, "pages", e.target.value)
                      }
                      fullWidth
                    />

                    {/* Copies */}
                    <TextField
                      type="number"
                      label="Copies"
                      value={doc.copies}
                      onChange={(e) =>
                        updateDocument(doc.id, "copies", e.target.value)
                      }
                      fullWidth
                    />

                    {/* Paper Size */}
                    <TextField
                      select
                      label="Paper Size"
                      value={doc.paperSize}
                      onChange={(e) =>
                        updateDocument(doc.id, "paperSize", e.target.value)
                      }
                      fullWidth
                    >
                      <MenuItem value="A4">A4</MenuItem>
                      <MenuItem value="A3">A3</MenuItem>
                    </TextField>

                    {/* Print Type */}
                    <TextField
                      select
                      label="Print Type"
                      value={doc.printType}
                      onChange={(e) =>
                        updateDocument(doc.id, "printType", e.target.value)
                      }
                      fullWidth
                    >
                      <MenuItem value="Single-Sided">Single-Sided</MenuItem>
                      <MenuItem value="Double-Sided">Double-Sided</MenuItem>
                    </TextField>

                    {/* Print Color */}
                    <TextField
                      select
                      label="Print Color"
                      value={doc.printColor}
                      onChange={(e) =>
                        updateDocument(doc.id, "printColor", e.target.value)
                      }
                      fullWidth
                    >
                      <MenuItem value="Black & White">Black & White</MenuItem>
                      <MenuItem value="Color">Color</MenuItem>
                    </TextField>

                    {/* Document Calculation Summary */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Printed Pages
                      </Typography>

                      <Typography fontWeight={800}>{printedPages}</Typography>

                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Sheets
                      </Typography>

                      <Typography fontWeight={800}>{sheets}</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </DashboardCard>
        </Box>

        {/* ============================================
            Right Column
        ============================================ */}
        <Box>
          {/* Request Summary */}
          <DashboardCard title="Request Summary" sx={{ mb: 3 }}>
            <SummaryRow label="Total Pages" value={summary.totalPages} />
            <SummaryRow label="Total Copies" value={summary.totalCopies} />
            <SummaryRow label="Total Sheets" value={summary.totalSheets} />
            <SummaryRow label="A4 Sheets" value={summary.totalA4} />
            <SummaryRow label="A3 Sheets" value={summary.totalA3} />

            <Divider sx={{ my: 2 }} />

            {/* Approval Route Preview */}
            <Typography variant="body2" color="text.secondary" mb={1}>
              Approval Route
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {approvalFlow.map((step) => (
                <Chip
                  key={step}
                  label={step}
                  color={
                    step === "HOD"
                      ? "warning"
                      : step === "HOS"
                      ? "primary"
                      : "default"
                  }
                />
              ))}
            </Box>

            <Typography
              sx={{
                mt: 2,
                fontSize: 13,
                color: "#64748B",
              }}
            >
              {summary.totalSheets <= 500
                ? "Request goes to the selected Department + Subject HOD, then to Printing Admin."
                : "Request goes to the selected Department + Subject HOD, then HOS, then Printing Admin."}
            </Typography>
          </DashboardCard>

          {/* Action Buttons */}
          <DashboardCard title="Actions">
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SaveIcon />}
              disabled
              sx={{ mb: 2, textTransform: "none" }}
            >
              Save Draft
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmitRequest}
              disabled={submitting}
              sx={{ textTransform: "none" }}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DashboardCard>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

// ============================================
// Reusable Summary Row
// Displays summary label and value
// ============================================
function SummaryRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 1.5,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={800}>{value}</Typography>
    </Box>
  );
}