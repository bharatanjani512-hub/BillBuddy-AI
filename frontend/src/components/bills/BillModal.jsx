import { useEffect, useState } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { Building2, User, Wallet } from "lucide-react";

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
  workspace_id: "",
  folder_name: "",
  wallet_id: "",
  is_corporate: false,
};

const BillModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const { workspaces, currentWorkspace, wallets } = useWorkspace();
  const [form, setForm] = useState(initialForm);

  const activeWallet = wallets && wallets.length > 0 ? wallets[0] : null;

  useEffect(() => {
    if (!isOpen) return;

    const defaultWsId = currentWorkspace?._id || "";
    const defaultWsName = currentWorkspace?.name || "Personal Finances";
    const defaultIsCorp = currentWorkspace?.type === "corporate";

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
        workspace_id: initialData.workspace_id || defaultWsId,
        folder_name: initialData.folder_name || defaultWsName,
        wallet_id: initialData.wallet_id || (defaultIsCorp && activeWallet ? activeWallet._id : ""),
        is_corporate: initialData.is_corporate !== undefined ? initialData.is_corporate : defaultIsCorp,
      });
    } else {
      setForm({
        ...initialForm,
        date: new Date().toISOString().split("T")[0],
        workspace_id: defaultWsId,
        folder_name: defaultWsName,
        wallet_id: defaultIsCorp && activeWallet ? activeWallet._id : "",
        is_corporate: defaultIsCorp,
      });
    }
  }, [initialData, isOpen, currentWorkspace, activeWallet]);

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

          {/* Folder & Corporate Allocation */}
          <div className="rounded-2xl border border-stone-200 bg-[#F4F7F2] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Assign To Folder / Workspace
                </label>
                <select
                  name="workspace_id"
                  value={form.workspace_id}
                  onChange={(e) => {
                    const selectedWs = workspaces.find((w) => w._id === e.target.value);
                    const isCorp = selectedWs?.type === "corporate";
                    setForm((prev) => ({
                      ...prev,
                      workspace_id: e.target.value,
                      folder_name: selectedWs?.name || "",
                      is_corporate: isCorp,
                      wallet_id: isCorp && activeWallet ? activeWallet._id : "",
                    }));
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm font-semibold text-stone-900 outline-none focus:border-[#365314]"
                >
                  {workspaces.map((ws) => (
                    <option key={ws._id} value={ws._id}>
                      {ws.type === "corporate" ? "🏢 [Corporate] " : "📁 "}
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeWallet && (
                <div className="sm:w-60 rounded-xl border border-stone-300 bg-white p-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_corporate}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          is_corporate: e.target.checked,
                          wallet_id: e.target.checked && activeWallet ? activeWallet._id : "",
                        }))
                      }
                      className="mt-1 h-4 w-4 rounded accent-[#365314]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900 flex items-center gap-1">
                        <Wallet size={12} className="text-[#365314]" />
                        Charge Corporate Wallet
                      </span>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Pool Balance: ₹{activeWallet.balance?.toLocaleString("en-IN") || "0"}
                      </p>
                    </div>
                  </label>
                </div>
              )}
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
              className="rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] hover:from-[#152213] hover:to-[#2B4210] px-6 py-2.5 font-semibold text-white shadow-xs disabled:opacity-60 transition active:scale-[0.99]"
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
