// ============================================
// ARAB UNITY SCHOOL
// Main App Routes
// Role-based protected routes
//
// Notes:
// - Pages are now organized under src/modules
// - Shared pages like Profile are under modules/shared
// - ProtectedRoute controls role access
// ============================================

import { Routes, Route, Navigate } from "react-router-dom";

// ============================================
// Auth
// ============================================
import { LoginPage } from "./modules/auth/pages";
import ProtectedRoute from "./routes/ProtectedRoute";

// ============================================
// Teacher Pages
// ============================================
import {
  TeacherDashboard,
  MyRequests,
  CreateRequest,
  RequestDetails,
  TeacherReports,
  Attachments,
} from "./modules/teacher/pages";

// ============================================
// HOD / HOS Pages
// ============================================
import { HodDashboard, HodRequestsPage } from "./modules/hod/pages";
import { HosDashboard, SubjectAllocationPage } from "./modules/hos/pages";

// ============================================
// Printing / Platform Admin Pages
// ============================================
import {
  DepartmentLimitsPage,
  PaperStockPage,
  PaperPurchases,
  PaperDistributions,
  InventoryTransactions,
  MasterData,
  AccessLevelsPage,
} from "./modules/printing-admin/pages";

import PrintingAdminDashboard from "./modules/printing-admin/pages/PrintingAdminDashboard";
import printingAdminLayoutRoutes from "./modules/printing-admin/routes/PrintingAdminLayoutRoutes";

// ============================================
// Admin Pages
// ============================================
import { UserManagement } from "./modules/admin/pages";

// ============================================
// Super Admin Routes
// ============================================
import superAdminLayoutRoutes from "./modules/super-admin/routes/SuperAdminLayoutRoutes";

// ============================================
// Shared Pages
// ============================================
import { Profile } from "./modules/shared/pages";

// ============================================
// Role Groups
// ============================================
const teacherRoles = ["Teacher", "TeachingAssistant", "SuperAdmin"];
const hodRoles = ["HOD", "SuperAdmin"];
const hosRoles = ["HOS", "Secretary", "SuperAdmin"];
const printingRoles = ["PrintingAdmin", "SuperAdmin"];
const printingAdminRoles = ["PrintingAdmin", "Admin", "SuperAdmin"];

// ============================================
// App Routes
// ============================================
export default function App() {
  return (
    <Routes>
      {/* ===================================== */}
      {/* PUBLIC ROUTES */}
      {/* ===================================== */}
      <Route path="/login" element={<LoginPage />} />

      {/* ===================================== */}
      {/* SUPER ADMIN LAYOUT ROUTES */}
      {/* ===================================== */}
      {superAdminLayoutRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child) => (
            <Route
              key={child.path || "index"}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}

      {/* ===================================== */}
      {/* TEACHER ROUTES */}
      {/* ===================================== */}
      <Route
        path="/teacher"
        element={<Navigate to="/teacher/dashboard" replace />}
      />

      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={teacherRoles}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={teacherRoles}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/my-requests"
        element={
          <ProtectedRoute allowedRoles={teacherRoles}>
            <MyRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/create-request"
        element={
          <ProtectedRoute allowedRoles={teacherRoles}>
            <CreateRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/attachments"
        element={
          <ProtectedRoute allowedRoles={teacherRoles}>
            <Attachments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/reports"
        element={
          <ProtectedRoute allowedRoles={teacherRoles}>
            <TeacherReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/request-details/:id"
        element={
          <ProtectedRoute allowedRoles={teacherRoles}>
            <RequestDetails />
          </ProtectedRoute>
        }
      />

      {/* ===================================== */}
      {/* HOD ROUTES */}
      {/* ===================================== */}
      <Route path="/hod" element={<Navigate to="/hod/dashboard" replace />} />

      <Route
        path="/hod/dashboard"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <HodDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/profile"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/pending-requests"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <HodRequestsPage type="pending" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/approved-requests"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <HodRequestsPage type="approved" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/rejected-requests"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <HodRequestsPage type="rejected" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/returned-requests"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <HodRequestsPage type="returned" />
          </ProtectedRoute>
        }
      />

      {/* HOD reuses teacher request pages */}
      <Route
        path="/hod/my-requests"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <MyRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/create-request"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <CreateRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/attachments"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <Attachments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/request-details/:id"
        element={
          <ProtectedRoute allowedRoles={hodRoles}>
            <RequestDetails />
          </ProtectedRoute>
        }
      />

      {/* ===================================== */}
      {/* HOS ROUTES */}
      {/* ===================================== */}
      <Route path="/hos" element={<Navigate to="/hos/dashboard" replace />} />

      <Route
        path="/hos/dashboard"
        element={
          <ProtectedRoute allowedRoles={hosRoles}>
            <HosDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hos/profile"
        element={
          <ProtectedRoute allowedRoles={hosRoles}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hos/subject-allocation"
        element={
          <ProtectedRoute allowedRoles={hosRoles}>
            <SubjectAllocationPage />
          </ProtectedRoute>
        }
      />

      {/* ===================================== */}
      {/* PRINTING ADMIN / PLATFORM ADMIN ROUTES */}
      {/* ===================================== */}
      <Route
        path="/printing"
        element={<Navigate to="/printing/dashboard" replace />}
      />

      {/* New layout-based printing routes */}
      {printingAdminLayoutRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child) => (
            <Route
              key={child.path || "index"}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}

      {/* Legacy printing routes kept while migration is ongoing */}
      <Route
        path="/printing/dashboard"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <PrintingAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/department-limits"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <DepartmentLimitsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/paper-stock"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <PaperStockPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/inventory-transactions"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <InventoryTransactions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/distributions"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <PaperDistributions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/purchases"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <PaperPurchases />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/user-management"
        element={
          <ProtectedRoute allowedRoles={printingAdminRoles}>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/access-levels"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <AccessLevelsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing/master-data"
        element={
          <ProtectedRoute allowedRoles={printingRoles}>
            <MasterData />
          </ProtectedRoute>
        }
      />

      {/* ===================================== */}
      {/* DEFAULT / FALLBACK ROUTES */}
      {/* ===================================== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}