// ============================================
// ARAB UNITY SCHOOL
// Teacher / HOD - Create Request Page
// Modern UI Version
// Keeps existing backend logic and rules
// ============================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import RouteIcon from "@mui/icons-material/Route";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";

import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

// ============================================
// Empty document template
// Includes future-ready uploadType
// ============================================

const createEmptyDocument = () => ({
  id: Date.now() + Math.random(),
  documentName: "",
  uploadType: "Office Document",
  file: null,
  pages: 1,
  copies: 1,
  paperSize: "A4",
  printType: "Single-Sided",
  printColor: "Black & White",
});

// ============================================
// Main Component
// ============================================

export default function CreateRequest() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // ============================================
  // Logged-in user information
  // Supports camelCase and PascalCase
  // ============================================

  const userRole = user?.role || user?.Role;

  const userDepartmentId = user?.departmentId || user?.DepartmentId;

  const userDepartmentName =
    user?.departmentName || user?.DepartmentName || "";

  const userPosition =
    user?.position || user?.Position || user?.roleName || user?.RoleName || "";

  const userSubject =
    user?.subject ||
    user?.Subject ||
    userPosition.replace(userDepartmentName, "").replace("HOD", "").trim();

  const isHOD = userRole === "HOD";

  const isSecondaryOrSixth =
    userDepartmentName === "Secondary" || userDepartmentName === "Sixth Form";

  const canChooseDepartment = !isHOD && isSecondaryOrSixth;

  // ============================================
  // Lookup Data
  // ============================================

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [purposes, setPurposes] = useState([]);

  // ============================================
  // Selected Request Values
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
  // Load Departments, Subjects, and Purposes
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

        if (userDepartmentId) {
          setDepartmentId(userDepartmentId);
        } else if (deptRes.data.length > 0) {
          setDepartmentId(deptRes.data[0].DepartmentId);
        }

        if (isHOD) {
          const hodSubject = subjectRes.data.find((subject) =>
            userSubject?.toLowerCase().includes(subject.SubjectName.toLowerCase())
          );

          if (hodSubject) {
            setSubjectId(hodSubject.SubjectId);
          } else if (subjectRes.data.length > 0) {
            setSubjectId(subjectRes.data[0].SubjectId);
          }
        } else if (subjectRes.data.length > 0) {
          setSubjectId(subjectRes.data[0].SubjectId);
        }

        if (purposeRes.data.length > 0) {
          setPurposeId(purposeRes.data[0].PurposeId);
        }
      } catch (err) {
        console.error("Lookup Load Error:", err);
        setError("Unable to load dropdown data.");
      }
    };

    loadLookups();
  }, [token, userDepartmentId, userDepartmentName, userSubject, isHOD]);

  // ============================================
  // Update One Document Field
  // ============================================

  const updateDocument = (id, field, value) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  // ============================================
  // Add New Document Card
  // ============================================

  const addDocument = () => {
    setDocuments((prev) => [...prev, createEmptyDocument()]);
  };

  // ============================================
  // Remove Document Card
  // Keeps at least one document
  // ============================================

  const removeDocument = (id) => {
    setDocuments((prev) =>
      prev.length === 1 ? prev : prev.filter((doc) => doc.id !== id)
    );
  };

  // ============================================
  // Calculate Request Summary
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
  // Selected Lookup Names for Summary
  // ============================================

  const selectedDepartmentName =
    departments.find((d) => Number(d.DepartmentId) === Number(departmentId))
      ?.DepartmentName || "Not selected";

  const selectedSubjectName =
    subjects.find((s) => Number(s.SubjectId) === Number(subjectId))
      ?.SubjectName || "Not selected";

  const selectedPurposeName =
    purposes.find((p) => Number(p.PurposeId) === Number(purposeId))
      ?.PurposeName || "Not selected";

  // ============================================
  // Approval Route Preview
  // ============================================

  const approvalFlow =
    userRole === "HOD"
      ? summary.totalSheets <= 500
        ? ["HOD", "Printing Admin"]
        : ["HOD", "HOS", "Printing Admin"]
      : summary.totalSheets <= 500
      ? ["Teacher", "HOD", "Printing Admin"]
      : ["Teacher", "HOD", "HOS", "Printing Admin"];

  // ============================================
  // Submit Request to Backend
  // ============================================

  const handleSubmitRequest = async () => {
    try {
      setError("");

      if (!token) return setError("You are not logged in.");
      if (!departmentId) return setError("Department is required.");
      if (!subjectId) return setError("Subject is required.");
      if (!purposeId) return setError("Please select a purpose.");
      if (summary.totalPages <= 0 || summary.totalSheets <= 0) {
        return setError("Total pages and sheets must be greater than zero.");
      }

      setSubmitting(true);

      const mainDocument = documents[0];

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

      if (userRole === "HOD") {
        navigate("/hod/my-requests");
      } else {
        navigate("/teacher/my-requests");
      }
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

  // ============================================
  // Page UI
  // Sidebar and Topbar stay unchanged
  // ============================================

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={
        <Topbar
          userName={user?.fullName || user?.FullName || "User"}
          role={userRole || "User"}
        />
      }
    >
      <PageHeader
        title="Create New Photocopy Request"
        subtitle="Fill in the details below to submit a new photocopy request."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2.2fr 0.9fr",
          },
          gap: 3,
        }}
      >
        {/* Left Main Content */}
        <Box>
          <ModernStepper />

          <RequestInfoCard
            departments={departments}
            subjects={subjects}
            purposes={purposes}
            departmentId={departmentId}
            subjectId={subjectId}
            purposeId={purposeId}
            setDepartmentId={setDepartmentId}
            setSubjectId={setSubjectId}
            setPurposeId={setPurposeId}
            canChooseDepartment={canChooseDepartment}
            isHOD={isHOD}
            requiredDate={requiredDate}
            setRequiredDate={setRequiredDate}
            priority={priority}
            setPriority={setPriority}
            remarks={remarks}
            setRemarks={setRemarks}
            customPurpose={customPurpose}
            setCustomPurpose={setCustomPurpose}
          />

          <DocumentsCard
            documents={documents}
            addDocument={addDocument}
            removeDocument={removeDocument}
            updateDocument={updateDocument}
          />

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                userRole === "HOD"
                  ? navigate("/hod/my-requests")
                  : navigate("/teacher/my-requests")
              }
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSubmitRequest}
              disabled={submitting}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.2,
                bgcolor: "#0B8F4D",
                textTransform: "none",
                fontWeight: 800,
                "&:hover": {
                  bgcolor: "#087A41",
                },
              }}
            >
              {submitting ? "Submitting..." : "Review & Submit"}
            </Button>
          </Box>
        </Box>

        {/* Right Sticky Summary */}
        <Box
          sx={{
            position: {
              xs: "static",
              lg: "sticky",
            },
            top: 24,
            alignSelf: "start",
          }}
        >
          <RequestSummaryCard
            selectedDepartmentName={selectedDepartmentName}
            selectedSubjectName={selectedSubjectName}
            selectedPurposeName={selectedPurposeName}
            summary={summary}
            priority={priority}
            requiredDate={requiredDate}
          />

          <ApprovalRouteCard approvalFlow={approvalFlow} />

          <ActionsCard
            submitting={submitting}
            handleSubmitRequest={handleSubmitRequest}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
}

// ============================================
// Modern Stepper
// Visual only for now
// ============================================

function ModernStepper() {
  const steps = ["Request Information", "Documents", "Review & Submit"];

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            alignItems: "center",
          }}
        >
          {steps.map((step, index) => (
            <Box key={step} sx={{ position: "relative", textAlign: "center" }}>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 18,
                    left: "50%",
                    width: "100%",
                    height: 2,
                    bgcolor: index === 0 ? "#0B8F4D" : "#CBD5E1",
                    zIndex: 0,
                  }}
                />
              )}

              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  mx: "auto",
                  bgcolor: index === 0 ? "#0B8F4D" : "#FFFFFF",
                  border: `2px solid ${index === 0 ? "#0B8F4D" : "#CBD5E1"}`,
                  color: index === 0 ? "#FFFFFF" : "#334155",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {index + 1}
              </Box>

              <Typography
                mt={1.2}
                fontSize={14}
                fontWeight={800}
                color={index === 0 ? "#0B8F4D" : "#334155"}
              >
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================
// Request Information Card
// ============================================

function RequestInfoCard({
  departments,
  subjects,
  purposes,
  departmentId,
  subjectId,
  purposeId,
  setDepartmentId,
  setSubjectId,
  setPurposeId,
  canChooseDepartment,
  isHOD,
  requiredDate,
  setRequiredDate,
  priority,
  setPriority,
  remarks,
  setRemarks,
  customPurpose,
  setCustomPurpose,
}) {
  return (
    <ModernCard
      icon={<DescriptionIcon />}
      title="Request Information"
      subtitle="Provide accurate details for faster processing."
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
        }}
      >
        <TextField
          select
          label="Department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          disabled={!canChooseDepartment}
          fullWidth
        >
          {(canChooseDepartment
            ? departments.filter(
                (d) =>
                  d.DepartmentName === "Secondary" ||
                  d.DepartmentName === "Sixth Form"
              )
            : departments.filter(
                (d) => Number(d.DepartmentId) === Number(departmentId)
              )
          ).map((department) => (
            <MenuItem key={department.DepartmentId} value={department.DepartmentId}>
              {department.DepartmentName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          disabled={isHOD}
          fullWidth
        >
          {(isHOD
            ? subjects.filter((s) => Number(s.SubjectId) === Number(subjectId))
            : subjects
          ).map((subject) => (
            <MenuItem key={subject.SubjectId} value={subject.SubjectId}>
              {subject.SubjectName}
            </MenuItem>
          ))}
        </TextField>

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

        <TextField
          select
          label="Priority Level"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
        >
          <MenuItem value="Normal">Normal</MenuItem>
          <MenuItem value="Urgent">Urgent</MenuItem>
        </TextField>

        {purposeId === "Other" && (
          <TextField
            label="Custom Purpose"
            value={customPurpose}
            onChange={(e) => setCustomPurpose(e.target.value)}
            fullWidth
          />
        )}
      </Box>

      <TextField
        label="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        multiline
        rows={3}
        fullWidth
        sx={{ mt: 2.5 }}
        placeholder="Add any additional information or special instructions..."
      />
    </ModernCard>
  );
}

// ============================================
// Documents Card
// Multiple documents can be added here
// ============================================

function DocumentsCard({ documents, addDocument, removeDocument, updateDocument }) {
  return (
    <ModernCard
      icon={<DescriptionIcon />}
      title="Documents"
      subtitle="Add one or more documents to support your request."
      action={
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addDocument}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            color: "#0B8F4D",
            borderColor: "#A7F3D0",
          }}
        >
          Add Document
        </Button>
      }
    >
      {documents.map((doc, index) => {
        const printedPages = (Number(doc.pages) || 0) * (Number(doc.copies) || 0);

        const sheets =
          doc.printType === "Double-Sided"
            ? Math.ceil(printedPages / 2)
            : printedPages;

        return (
          <Box
            key={doc.id}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid #E2E8F0",
              borderRadius: 4,
              bgcolor: "#F8FAFC",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                alignItems: "center",
              }}
            >
              <Chip
                label={`Document #${index + 1}`}
                sx={{
                  fontWeight: 800,
                  bgcolor: "#EAF7EE",
                  color: "#0B8F4D",
                }}
              />

              <Button
                color="error"
                startIcon={<DeleteIcon />}
                disabled={documents.length === 1}
                onClick={() => removeDocument(doc.id)}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Remove
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "260px 1fr",
                },
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: "grid", gap: 1.5 }}>
                <UploadTypeButton
                  active={doc.uploadType === "Office Document"}
                  icon={<FolderIcon />}
                  title="Office Document"
                  subtitle="PDF, DOCX, PPTX, XLSX"
                  onClick={() =>
                    updateDocument(doc.id, "uploadType", "Office Document")
                  }
                />

                <UploadTypeButton
                  active={doc.uploadType === "Image File"}
                  icon={<ImageIcon />}
                  title="Image File"
                  subtitle="JPG, PNG, JPEG"
                  onClick={() => updateDocument(doc.id, "uploadType", "Image File")}
                />
              </Box>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{
                  minHeight: 132,
                  borderRadius: 3,
                  borderStyle: "dashed",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  color: "#0B8F4D",
                  bgcolor: "#FFFFFF",
                }}
              >
                <Typography fontWeight={800}>
                  {doc.file ? doc.file.name : "Drag & drop file here"}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  or click to browse
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  Maximum file size: 20MB
                </Typography>

                <input
                  hidden
                  type="file"
                  accept={
                    doc.uploadType === "Image File"
                      ? ".jpg,.jpeg,.png"
                      : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  }
                  onChange={(e) =>
                    updateDocument(doc.id, "file", e.target.files[0])
                  }
                />
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              <TextField
                label="Document Name"
                value={doc.documentName}
                onChange={(e) =>
                  updateDocument(doc.id, "documentName", e.target.value)
                }
                fullWidth
              />

              <TextField
                type="number"
                label="Pages"
                value={doc.pages}
                onChange={(e) => updateDocument(doc.id, "pages", e.target.value)}
                fullWidth
              />

              <TextField
                type="number"
                label="Copies"
                value={doc.copies}
                onChange={(e) => updateDocument(doc.id, "copies", e.target.value)}
                fullWidth
              />

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
            </Box>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography color="text.secondary">Printed Pages</Typography>
              <Typography fontWeight={900}>
                {printedPages} pages • {sheets} sheets
              </Typography>
            </Box>
          </Box>
        );
      })}

      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addDocument}
        sx={{
          mt: 1,
          borderRadius: 3,
          borderStyle: "dashed",
          textTransform: "none",
          fontWeight: 800,
          color: "#0B8F4D",
          borderColor: "#A7F3D0",
        }}
      >
        Add Another Document
      </Button>
    </ModernCard>
  );
}

// ============================================
// Upload Type Selector
// ============================================

function UploadTypeButton({ active, icon, title, subtitle, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 3,
        cursor: "pointer",
        border: `1.5px solid ${active ? "#0B8F4D" : "#E2E8F0"}`,
        bgcolor: active ? "#EAF7EE" : "#FFFFFF",
        display: "flex",
        gap: 1.5,
        alignItems: "center",
      }}
    >
      <Box sx={{ color: active ? "#0B8F4D" : "#64748B" }}>{icon}</Box>

      <Box>
        <Typography fontWeight={900} color={active ? "#0B8F4D" : "#0F172A"}>
          {title}
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

// ============================================
// Request Summary Card
// ============================================

function RequestSummaryCard({
  selectedDepartmentName,
  selectedSubjectName,
  selectedPurposeName,
  summary,
  priority,
  requiredDate,
}) {
  return (
    <ModernCard icon={<SummarizeIcon />} title="Request Summary">
      <SummaryRow label="Department" value={selectedDepartmentName} />
      <SummaryRow label="Subject" value={selectedSubjectName} />
      <SummaryRow label="Purpose" value={selectedPurposeName} />

      <Divider sx={{ my: 2 }} />

      <SummaryRow label="Total Pages" value={summary.totalPages} />
      <SummaryRow label="Total Copies" value={summary.totalCopies} />
      <SummaryRow label="Total Sheets" value={summary.totalSheets} />
      <SummaryRow label="A4 Sheets" value={summary.totalA4} />
      <SummaryRow label="A3 Sheets" value={summary.totalA3} />

      <Divider sx={{ my: 2 }} />

      <SummaryRow
        label="Priority"
        value={
          <Chip
            label={priority}
            size="small"
            sx={{
              bgcolor: priority === "Urgent" ? "#FEE2E2" : "#FEF3C7",
              color: priority === "Urgent" ? "#DC2626" : "#D97706",
              fontWeight: 800,
            }}
          />
        }
      />

      <SummaryRow
        label="Required Date"
        value={requiredDate ? requiredDate : "Not selected"}
      />
    </ModernCard>
  );
}

// ============================================
// Approval Route Card
// ============================================

function ApprovalRouteCard({ approvalFlow }) {
  return (
    <ModernCard icon={<RouteIcon />} title="Approval Route">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {approvalFlow.map((step, index) => (
          <Box key={step} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor:
                  step === "HOD"
                    ? "#F97316"
                    : step === "HOS"
                    ? "#2563EB"
                    : step === "Printing Admin"
                    ? "#15803D"
                    : "#E2E8F0",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
              }}
            >
              {index + 1}
            </Box>

            <Box>
              <Typography fontWeight={900}>{step}</Typography>
              <Typography fontSize={13} color="text.secondary">
                {step === "Printing Admin"
                  ? "Final printing and processing"
                  : "Approval review required"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </ModernCard>
  );
}

// ============================================
// Actions Card
// ============================================

function ActionsCard({ submitting, handleSubmitRequest }) {
  return (
    <ModernCard title="Actions">
      <Button
        fullWidth
        variant="outlined"
        startIcon={<SaveIcon />}
        disabled
        sx={{
          mb: 2,
          borderRadius: 3,
          py: 1.2,
          textTransform: "none",
          fontWeight: 800,
        }}
      >
        Save as Draft
      </Button>

      <Button
        fullWidth
        variant="contained"
        endIcon={<SendIcon />}
        onClick={handleSubmitRequest}
        disabled={submitting}
        sx={{
          borderRadius: 3,
          py: 1.2,
          bgcolor: "#0B8F4D",
          textTransform: "none",
          fontWeight: 900,
          "&:hover": {
            bgcolor: "#087A41",
          },
        }}
      >
        {submitting ? "Submitting..." : "Review & Submit"}
      </Button>

      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 3,
          bgcolor: "#EAF7EE",
          color: "#166534",
        }}
      >
        <Typography fontSize={13}>
          Your request will be saved securely and can be tracked in My Requests.
        </Typography>
      </Box>
    </ModernCard>
  );
}

// ============================================
// Reusable Modern Card
// ============================================

function ModernCard({ icon, title, subtitle, action, children }) {
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            alignItems: "flex-start",
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {icon && (
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 3,
                  bgcolor: "#EAF7EE",
                  color: "#0B8F4D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </Box>
            )}

            <Box>
              <Typography variant="h6" fontWeight={900}>
                {title}
              </Typography>

              {subtitle && (
                <Typography color="text.secondary" fontSize={14}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {action}
        </Box>

        {children}
      </CardContent>
    </Card>
  );
}

// ============================================
// Reusable Summary Row
// ============================================

function SummaryRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        mb: 1.5,
      }}
    >
      <Typography color="text.secondary" fontWeight={600}>
        {label}
      </Typography>

      <Typography fontWeight={900} textAlign="right">
        {value}
      </Typography>
    </Box>
  );
}