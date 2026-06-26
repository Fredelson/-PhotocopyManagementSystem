// ============================================
// ARAB UNITY SCHOOL
// User Management Page
// Printing Admin / Admin / SuperAdmin
// Includes CSV User Import
// ============================================

import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Edit,
  ToggleOff,
  ToggleOn,
  UploadFile,
} from "@mui/icons-material";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";

import {
  getUsers,
  createUser,
  updateUser,
  activateUser,
  deactivateUser,
  importUsersFromCSV,
  downloadCSVUserTemplate,
  downloadExcelUserTemplate,
  importUsersFromExcel,
} from "../../services/userService";

import {
  getDepartments,
  getSubjects,
  getRoles,
} from "../../services/lookupService";

const initialForm = {
  fullName: "",
  employeeId: "",
  schoolEmail: "",
  role: "Teacher",
  departmentId: "",
  subject: "",
};


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  // ============================================
  // CSV Import State
  // ============================================
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // ============================================
  // Load Users
  // ============================================
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Load users error:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Load Lookup Data
  // ============================================
  const loadLookups = async () => {
    try {
      const deptData = await getDepartments();
      const subjectData = await getSubjects();
      const roleData = await getRoles();

      setDepartments(
        deptData.departments ||
          deptData.data ||
          deptData ||
          []
      );

      setSubjects(
        subjectData.subjects ||
          subjectData.data ||
          subjectData ||
          []
      );

      setRoles(roleData || []);

    } catch (error) {
      console.error("Load lookup error:", error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadLookups();
  }, []);

  // ============================================
  // Filter Users
  // ============================================
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        user.FullName?.toLowerCase().includes(keyword) ||
        user.EmployeeId?.toLowerCase().includes(keyword) ||
        user.SchoolEmail?.toLowerCase().includes(keyword);

      const matchesRole =
        roleFilter === "All" || user.Role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ============================================
  // Role-based Field Visibility
  // ============================================
    const showDepartment = [
      "Teacher",
      "TeachingAssistant",
      "HOD",
      "HOS",
      "Secretary",
    ].includes(form.role);
  const showSubject = ["HOD"].includes(form.role);

  // ============================================
  // Open Add Dialog
  // ============================================
  const handleAdd = () => {
    setEditingUser(null);
    setForm(initialForm);
    setOpen(true);
  };

  // ============================================
  // Open Edit Dialog
  // ============================================
  const handleEdit = (user) => {
    setEditingUser(user);

    setForm({
      fullName: user.FullName || "",
      employeeId: user.EmployeeId || "",
      schoolEmail: user.SchoolEmail || "",
      role: user.Role || "Teacher",
      departmentId: user.DepartmentId || "",
      subject: user.Subject || "",
    });

    setOpen(true);
  };

  // ============================================
  // Handle Role Change
  // Clears department/subject if not needed
  // ============================================
  const handleRoleChange = (role) => {
    setForm({
      ...form,
      role,
      departmentId: ["Teacher", "HOD", "HOS"].includes(role)
        ? form.departmentId
        : "",
      subject: role === "HOD" ? form.subject : "",
    });
  };

  // ============================================
  // Save User
  // Add new user or update existing user
  // ============================================
  const handleSave = async () => {
    try {
      if (!form.fullName || !form.employeeId || !form.schoolEmail || !form.role) {
        alert("Please complete all required fields");
        return;
      }

      if (showDepartment && !form.departmentId) {
        alert("Please select department");
        return;
      }

      if (showSubject && !form.subject) {
        alert("Please select subject");
        return;
      }

      const payload = {
        fullName: form.fullName,
        employeeId: form.employeeId,
        schoolEmail: form.schoolEmail,
        role: form.role,
        departmentId: showDepartment ? form.departmentId : null,
        subject: showSubject ? form.subject : null,
      };

      if (editingUser) {
        await updateUser(editingUser.UserId, payload);
        alert("User updated successfully");
      } else {
        await createUser(payload);
        alert(`User created successfully. Default password: ${form.employeeId}`);
      }

      setOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Save user error:", error);
      alert(error.response?.data?.message || "Failed to save user");
    }
  };

  // ============================================
  // Activate / Deactivate User
  // ============================================
  const handleToggleStatus = async (user) => {
    try {
      if (user.IsActive) {
        await deactivateUser(user.UserId);
      } else {
        await activateUser(user.UserId);
      }

      loadUsers();
    } catch (error) {
      console.error("Toggle user error:", error);
      alert("Failed to update user status");
    }
  };

  // ============================================
  // Import Users from CSV
  // CSV columns:
  // FullName, EmployeeId, SchoolEmail, Role, Department, Subject
  //
  // Backend will:
  // - Convert Department name to DepartmentId
  // - Set Password = EmployeeId
  // - Set MustChangePassword = 1
  // - Skip duplicate EmployeeId / SchoolEmail
  // ============================================
  const handleImportUsers = async () => {
    if (!importFile) {
      alert("Please select a CSV file first.");
      return;
    }

    try {
      setImportLoading(true);
      setImportResult(null);

      const result = await importUsersFromCSV(importFile);

      setImportResult(result);
      setImportFile(null);

      // Refresh user table after import
      loadUsers();
    } catch (error) {
      console.error("Import users error:", error);
      alert(error.response?.data?.message || "Failed to import users.");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <PageHeader
        title="User Management"
        subtitle="Manage teachers, HOD, HOS, admin, and printing users"
      />

      {/* ============================================ */}
      {/* CSV Import Section */}
      {/* ============================================ */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={800} gutterBottom>
          Import Users from CSV
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          CSV columns: FullName, EmployeeId, SchoolEmail, Role, Department, Subject
        </Typography>

        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
          sx={{ mb: 2 }}
        >
          <Button
            variant="outlined"
            onClick={downloadCSVUserTemplate}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Download CSV Template
          </Button>

          <Button
            variant="outlined"
            onClick={downloadExcelUserTemplate}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Download Excel Template
          </Button>
        </Box>

        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFile />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Select CSV File
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files[0])}
            />
          </Button>

          <Typography variant="body2">
            {importFile ? importFile.name : "No file selected"}
          </Typography>

          <Button
            variant="contained"
            disabled={!importFile || importLoading}
            onClick={handleImportUsers}
            sx={{
              bgcolor: "#2E8B3C",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#246f30" },
            }}
          >
            {importLoading ? "Importing..." : "Import Users"}
          </Button>
        </Box>

        {importResult && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Import completed. Total: {importResult.totalRows}, Inserted:{" "}
            {importResult.inserted}, Skipped: {importResult.skipped}
          </Alert>
        )}

        {importResult?.errors?.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Some rows were skipped. Please check duplicate users, invalid roles,
            missing fields, or department names.
          </Alert>
        )}
      </Paper>

      {/* ============================================ */}
      {/* User Table Section */}
      {/* ============================================ */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Search user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              select
              size="small"
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="All">All Roles</MenuItem>
              {roles.map((role) => (
                <MenuItem
                  key={role.RoleId}
                  value={role.RoleName}
                >
                  {role.DisplayName}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              bgcolor: "#2E8B3C",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#246f30" },
            }}
          >
            Add User
          </Button>
        </Box>

        <Typography fontWeight={700} mb={2}>
          Total Users: {filteredUsers.length}
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.UserId} hover>
                  <TableCell>
                    <Typography fontWeight={700}>{user.FullName}</Typography>
                  </TableCell>

                  <TableCell>{user.EmployeeId}</TableCell>
                  <TableCell>{user.SchoolEmail}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.Role}
                      size="small"
                      sx={{
                        bgcolor: "#EAF4EC",
                        color: "#2E8B3C",
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>

                  <TableCell>{user.DepartmentName || "-"}</TableCell>
                  <TableCell>{user.Subject || "-"}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.IsActive ? "Active" : "Inactive"}
                      size="small"
                      color={user.IsActive ? "success" : "default"}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleToggleStatus(user)}>
                      {user.IsActive ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading users...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ============================================ */}
      {/* Add / Edit User Dialog */}
      {/* ============================================ */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingUser ? "Edit User" : "Add New User"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 3,
              mt: 2,
            }}
          >
            <TextField
              fullWidth
              label="Full Name"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Employee ID"
              value={form.employeeId}
              disabled={!!editingUser}
              onChange={(e) =>
                setForm({ ...form, employeeId: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="School Email"
              value={form.schoolEmail}
              onChange={(e) =>
                setForm({ ...form, schoolEmail: e.target.value })
              }
            />

            <TextField
              select
              fullWidth
              label="Role"
              value={form.role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem
                  key={role.RoleId}
                  value={role.RoleName}
                >
                  {role.DisplayName}
                </MenuItem>
              ))}
            </TextField>

            {showDepartment && (
              <TextField
                select
                fullWidth
                label="Department"
                value={form.departmentId}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value })
                }
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.DepartmentId} value={dept.DepartmentId}>
                    {dept.DepartmentName}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {showSubject && (
              <TextField
                select
                fullWidth
                label="Subject"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.SubjectId} value={subject.SubjectName}>
                    {subject.SubjectName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#2E8B3C",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#246f30" },
            }}
          >
            Save User
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
