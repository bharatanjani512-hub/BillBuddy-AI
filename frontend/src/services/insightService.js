import api from "./api";

export const fetchInsights = async () => {
  const response = await api.get("/insights/");
  return response.data;
};
