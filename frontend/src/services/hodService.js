// ============================================
// ARAB UNITY SCHOOL
// HOD Service
// ============================================

import api from "./api";

// Dashboard KPI Data
export const getHodDashboard = async () => {
  const response = await api.get("/hod/dashboard");
  return response.data;
};

// Pending Requests Assigned To HOD
export const getHodRequests = async () => {
  const response = await api.get("/hod/requests");
  return response.data;
};

// Approve Request
export const approveHodRequest = async (
  requestId,
  remarks = "Approved by HOD"
) => {
  const response = await api.put(
    `/hod/requests/${requestId}/approve`,
    {
      remarks,
    }
  );

  return response.data;
};

// Reject Request
export const rejectHodRequest = async (
  requestId,
  remarks = "Rejected by HOD"
) => {
  const response = await api.put(
    `/hod/requests/${requestId}/reject`,
    {
      remarks,
    }
  );

  return response.data;
};