import api from "./api";

// ================================
// Dashboard Summary
// ================================
export const fetchDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

// ================================
// Monthly Expense Chart
// ================================
export const fetchMonthlyChart = async () => {
  const response = await api.get("/dashboard/monthly-chart");
  return response.data;
};

// ================================
// Category Expense Chart
// ================================
export const fetchCategoryChart = async () => {
  const response = await api.get("/dashboard/category-chart");
  return response.data;
};

// ================================
// Recent Transactions
// ================================
export const fetchRecentTransactions = async () => {
  const response = await api.get("/dashboard/recent-transactions");
  return response.data;
};

// ================================
// Upcoming & Pending Bills
// ================================
export const fetchUpcomingBills = async () => {
  const response = await api.get("/bills/upcoming");
  return response.data?.data || response.data;
};

// ================================
// Search Bills
// ================================
export const searchBills = async (query) => {
  const response = await api.get("/dashboard/search", {
    params: { query },
  });

  return response.data;
};

// ================================
// Filter Bills By Date
// ================================
export const filterBills = async (startDate, endDate) => {
  const response = await api.get("/dashboard/filter", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};

// ================================
// Filter Bills By Payment Mode
// ================================
export const filterPaymentMode = async (mode) => {
  const response = await api.get("/dashboard/payment-mode", {
    params: { mode },
  });

  return response.data;
};
