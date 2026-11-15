import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  amount: "",
  category: "Electricity",
  merchant: "",
  payment_mode: "UPI",
  date: new Date().toISOString().split("T")[0],
  due_date: "",
  status: "Paid",
  notes: "",
};

const BillModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount || "",
        category: initialData.category || "Electricity",
        merchant: initialData.merchant || "",
        payment_mode: initialData.payment_mode || "UPI",
        date: initialData.date || new Date().toISOString().split("T")[0],
        due_date: initialData.due_date || "",
        status: initialData.status || "Paid",
        notes: initialData.notes || "",
      });
    } else {
      setForm({
        ...initialForm,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-[#FEFDFB] p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {initialData ? "Edit Bill Details" : "Record New Bill"}
          </h2>
          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
            {form.status === "Paid" ? "✓ Paid Bill" : "⏳ Pending Payment"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Bill Title / Service
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Electricity Bill - May"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Amount (₹)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 1850.00"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Electricity">Electricity</option>
                <option value="Water">Water & Utilities</option>
                <option value="Internet">Internet & Broadband</option>
                <option value="Phone">Mobile / Phone</option>
                <option value="Rent">Office / Property Rent</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Software">Software & Subscriptions</option>
                <option value="Food">Food & Dining</option>
                <option value="Travel">Travel & Transport</option>
                <option value="Medical">Healthcare & Insurance</option>
                <option value="Tax">Taxes & Legal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Merchant / Vendor
              </label>
              <input
                name="merchant"
                value={form.merchant}
                onChange={handleChange}
                placeholder="e.g. Tata Power / Airtel / Amazon"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Payment Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending / Unpaid</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Payment Mode
              </label>
              <select
                name="payment_mode"
                value={form.payment_mode}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Auto-Debit">Auto-Debit</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Bill Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Due Date {form.status === "Pending" && <span className="text-red-500 font-bold">*</span>}
              </label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 ${
                  form.status === "Pending"
                    ? "border-amber-400 bg-amber-50/50 focus:border-amber-500 focus:ring-amber-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Notes / Account or Consumer Number
            </label>
            <textarea
              rows={3}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. Consumer No: 1029384, Meter Reading: 340 units"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-60 transition active:scale-[0.99]"
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Update Bill"
                : "Save Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillModal;
