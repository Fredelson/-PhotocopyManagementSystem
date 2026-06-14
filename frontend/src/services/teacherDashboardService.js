// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard API Service
// ============================================

import api from "./api";

export const getTeacherDashboardKpis = async () => {
  const response = await api.get("/teacher/kpis");
  return response.data;
};