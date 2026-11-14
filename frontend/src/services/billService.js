import api from "./api";

/* ==========================================================
   Fetch Bills
   Supports:
   - Pagination
   - Search
   - Filters (Category, Payment Mode, Status, Amount, Date)
   - Sorting
========================================================== */

export const fetchBills = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  payment_mode = "",
  status = "",
  min_amount = "",
  max_amount = "",
  from_date = "",
  to_date = "",
  sort = "latest",
} = {}) => {
  const params = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (category) params.category = category;
  if (payment_mode) params.payment_mode = payment_mode;
  if (status && status !== "all") params.status = status;

  if (min_amount !== "") params.min_amount = min_amount;
  if (max_amount !== "") params.max_amount = max_amount;

  if (from_date) params.from_date = from_date;
  if (to_date) params.to_date = to_date;

  const response = await api.get("/bills/", {
    params,
  });

  return response.data;
};

/* ==========================================================
   Bill Statistics
========================================================== */

export const fetchBillStatistics = async () => {
  const response = await api.get("/bills/statistics");
  return response.data;
};

/* ==========================================================
   Recent Bills
========================================================== */

export const fetchRecentBills = async (limit = 5) => {
  const response = await api.get("/bills/recent", {
    params: {
      limit,
    },
  });

  return response.data;
};

/* ==========================================================
   Upcoming & Pending Bills
========================================================== */

export const fetchUpcomingBills = async () => {
  const response = await api.get("/bills/upcoming");
  return response.data?.data || response.data;
};

/* ==========================================================
   Scan Bill / Receipt using AI (Gemini Vision)
========================================================== */

export const scanBillFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/bills/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.data || response.data;
};

/* ==========================================================
   Toggle Bill Status (Paid <-> Pending)
========================================================== */

export const toggleBillStatus = async (billId) => {
  const response = await api.patch(`/bills/${billId}/toggle-status`);
  return response.data;
};

/* ==========================================================
   Create Bill
========================================================== */

export const createBill = async (billData) => {
  const response = await api.post("/bills/create", billData);
  return response.data;
};

/* ==========================================================
   Update Bill
========================================================== */

export const updateBill = async (billId, billData) => {
  const response = await api.put(
    `/bills/${billId}`,
    billData
  );

  return response.data;
};

/* ==========================================================
   Delete Bill
========================================================== */

export const deleteBill = async (billId) => {
  const response = await api.delete(
    `/bills/${billId}`
  );

  return response.data;
};
