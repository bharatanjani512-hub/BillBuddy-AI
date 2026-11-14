export const formatCurrency = (amount, currency = "INR") => {
  const num = Number(amount) || 0;
  if (currency === "INR") {
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return `$${num.toLocaleString("en-US")}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const isBillOverdue = (dueDate, status) => {
  if (!dueDate || (status || "").toLowerCase() === "paid") return false;
  const today = new Date().toISOString().split("T")[0];
  return dueDate < today;
};
