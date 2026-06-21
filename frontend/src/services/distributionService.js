// ============================================
// ARAB UNITY SCHOOL
// Paper Distribution Service
// ============================================

import api from "./api";

export const getDistributions = async () => {
  const response = await api.get("/distributions");
  return response.data;
};

export const searchDistributionUsers = async (query) => {
  const response = await api.get("/distributions/users/search", {
    params: { query },
  });

  return response.data;
};

export const addDistribution = async (distributionData) => {
  const response = await api.post("/distributions", distributionData);
  return response.data;
};

