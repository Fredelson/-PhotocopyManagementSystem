// ============================================
// ARAB UNITY SCHOOL
// Printing Service
// Handles all frontend API calls for Printing Admin
// ============================================

import api from "./api";

// Get Printing Dashboard KPI data
export const getPrintingDashboard = async () => {
  const response = await api.get("/printing/dashboard");
  return response.data;
};

// Get print queue requests
export const getPrintingRequests = async () => {
  const response = await api.get("/printing/requests");
  return response.data;
};

// Get printing history
export const getPrintingHistory = async () => {
  const response = await api.get("/printing/history");
  return response.data;
};

// Start printing request
export const startPrintingRequest = async (requestId) => {
  const response = await api.put(
    `/printing/requests/${requestId}/start`
  );

  return response.data;
};

// Complete printing request
export const completePrintingRequest = async (
  requestId,
  remarks = "Printing completed"
) => {
  const response = await api.put(
    `/printing/requests/${requestId}/complete`,
    {
      remarks,
    }
  );

  return response.data;
};