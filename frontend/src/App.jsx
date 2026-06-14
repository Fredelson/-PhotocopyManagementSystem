// ============================================
// ARAB UNITY SCHOOL
// Main App Routes
// Uses /role/dashboard route structure
// ============================================

import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import MyRequests from "./pages/teacher/MyRequests";
import CreateRequest from "./pages/teacher/CreateRequest";
import RequestDetails from "./pages/teacher/RequestDetails";

// HOD / HOS pages
import HodDashboard from "./pages/hod/HodDashboard";
import HosDashboard from "./pages/hos/HosDashboard";

// Printing page
import PrintingDashboard from "./pages/printing/PrintingDashboard";

// Reusable profile page
import Profile from "./pages/common/Profile";

export default function App() {
  return (
    <Routes>
      {/* Public login route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Teacher routes */}
      <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />

      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Teacher", "SuperAdmin"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={["Teacher", "SuperAdmin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/my-requests"
        element={
          <ProtectedRoute allowedRoles={["Teacher", "SuperAdmin"]}>
            <MyRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/create-request"
        element={
          <ProtectedRoute allowedRoles={["Teacher", "SuperAdmin"]}>
            <CreateRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/request-details/:id"
        element={
          <ProtectedRoute allowedRoles={["Teacher", "SuperAdmin"]}>
            <RequestDetails />
          </ProtectedRoute>
        }
      />

      {/* HOD routes */}
      <Route path="/hod" element={<Navigate to="/hod/dashboard" replace />} />

      <Route
        path="/hod/dashboard"
        element={
          <ProtectedRoute allowedRoles={["HOD", "SuperAdmin"]}>
            <HodDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/profile"
        element={
          <ProtectedRoute allowedRoles={["HOD", "SuperAdmin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* HOS routes */}
      <Route path="/hos" element={<Navigate to="/hos/dashboard" replace />} />

      <Route
        path="/hos/dashboard"
        element={
          <ProtectedRoute allowedRoles={["HOS", "SuperAdmin"]}>
            <HosDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hos/profile"
        element={
          <ProtectedRoute allowedRoles={["HOS", "SuperAdmin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Printing routes */}
      <Route path="/printing" element={<Navigate to="/printing/dashboard" replace />} />

      <Route
        path="/printing/dashboard"
        element={
          <ProtectedRoute allowedRoles={["PrintingAdmin", "SuperAdmin"]}>
            <PrintingDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/profile"
        element={
          <ProtectedRoute allowedRoles={["PrintingAdmin", "SuperAdmin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}