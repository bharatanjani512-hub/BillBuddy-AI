import { useEffect, useState } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Wallet,
  TrendingDown,
  Tag,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import {
  fetchBudgets,
  fetchBudgetStatistics,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../../services/budgetService";

const CATEGORIES = [
  "Food",
  "Electricity",
  "Water",
  "Internet",
  "Phone",
  "Rent",
  "Medical",
  "Transport",
  "Shopping",
  "Subscription",
  "Insurance",
  "Tax",
  "Other",
];

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);

const emptyForm = {
  title: "",
  category: "Food",
  amount: "",
  month: new Date().getMonth() + 1,
  year: CURRENT_YEAR,
  notes: "",
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm flex items-center gap-5">
      <div className={`rounded-2xl p-3 ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ spent, total }) {
  const pct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
  const over = spent > total;
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>₹{(spent || 0).toLocaleString("en-IN")} spent</span>
        <span className={over ? "font-semibold text-red-500" : ""}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full transition-all ${over ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function BudgetModal({ title, form, onChange, onSubmit, onClose, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
        <h3 className="mb-6 text-xl font-bold text-slate-800">{title}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Title
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              placeholder="Budget title"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Category
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              placeholder="0"
              value={form.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Month
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                value={form.month}
                onChange={(e) => onChange("month", parseInt(e.target.value))}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Year
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                value={form.year}
                onChange={(e) => onChange("year", parseInt(e.target.value))}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Notes
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              placeholder="Optional notes"
              value={form.notes}
              onChange={(e) => onChange("notes", e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-60 active:scale-[0.99]"
          >
            {saving ? "Saving…" : "Save Budget"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteModal({ budget, onConfirm, onClose, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl border border-stone-200 bg-[#FEFDFB] p-8 shadow-xl text-center">
        <Trash2 className="mx-auto mb-4 text-red-400" size={36} />
        <h3 className="mb-2 text-lg font-bold text-slate-800">Delete Budget</h3>
        <p className="mb-6 text-sm text-slate-500">
          Are you sure you want to delete &quot;{budget?.title}&quot;? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {saving ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const Budget = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [budgets, setBudgets] = useState([]);
  const [statistics, setStatistics] = useState({
    total_budget: 0,
    total_spent: 0,
    categories_count: 0,
    over_budget_count: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: "",
    month: "",
    year: "",
    sort: "latest",
  });

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // ── Load data ──────────────────────────────────────────────────────────────
  const loadBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetchBudgets(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""))
      );
      setBudgets(response.payload || response.budgets || []);
      if (response.pagination) setPagination(response.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetchBudgetStatistics();
      setStatistics(response.payload || response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [filters]);

  useEffect(() => {
    loadStatistics();
  }, []);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    try {
      setSaving(true);
      await createBudget({ ...data, amount: parseFloat(data.amount) });
      setShowAdd(false);
      setForm({ ...emptyForm });
      await Promise.all([loadBudgets(), loadStatistics()]);
    } catch (err) {
      console.error(err);
      alert("Failed to create budget.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setSaving(true);
      await updateBudget(selected._id, { ...data, amount: parseFloat(data.amount) });
      setShowEdit(false);
      setSelected(null);
      await Promise.all([loadBudgets(), loadStatistics()]);
    } catch (err) {
      console.error(err);
      alert("Failed to update budget.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteBudget(selected._id);
      setShowDelete(false);
      setSelected(null);
      await Promise.all([loadBudgets(), loadStatistics()]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete budget.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (b) => {
    setSelected(b);
    setForm({
      title: b.title || "",
      category: b.category || "Food",
      amount: b.amount ?? "",
      month: b.month ?? new Date().getMonth() + 1,
      year: b.year ?? CURRENT_YEAR,
      notes: b.notes || "",
    });
    setShowEdit(true);
  };

  const openDelete = (b) => {
    setSelected(b);
    setShowDelete(true);
  };

  const setPage = (p) => setFilters((f) => ({ ...f, page: p }));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-w-0">

        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Budget</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your category-wise spending limits.</p>
          </div>
          <button
            onClick={() => { setForm({ ...emptyForm }); setShowAdd(true); }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.99]"
          >
            <PlusCircle size={16} />
            Add Budget
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Wallet}
            label="Total Budget"
            value={`₹${(statistics.total_budget || 0).toLocaleString("en-IN")}`}
            color="blue"
          />
          <StatCard
            icon={TrendingDown}
            label="Total Spent"
            value={`₹${(statistics.total_spent || 0).toLocaleString("en-IN")}`}
            color="violet"
          />
          <StatCard
            icon={Tag}
            label="Categories"
            value={statistics.categories_count ?? 0}
            color="emerald"
          />
          <StatCard
            icon={AlertTriangle}
            label="Over Budget"
            value={statistics.over_budget_count ?? 0}
            color="red"
          />
        </div>

        {/* ── Filter Toolbar ── */}
        <div className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-stone-200 bg-[#FEFDFB] p-4 shadow-sm">
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
            value={filters.month}
            onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value, page: 1 }))}
          >
            <option value="">All Months</option>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>

          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
            value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value, page: 1 }))}
          >
            <option value="">All Years</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

        {/* ── Budget List ── */}
        <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] shadow-sm overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              Loading budgets…
            </div>
          ) : budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Wallet size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No budgets found. Add one to get started.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Title / Category</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 w-56">Progress</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b, idx) => {
                  const spent = b.spent || 0;
                  const over = spent > b.amount;
                  return (
                    <tr
                      key={b._id || idx}
                      className="border-b border-stone-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{b.title}</p>
                        <span className="mt-0.5 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                          {b.category}
                        </span>
                        {over && (
                          <span className="ml-1 inline-block rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">
                            Over Budget
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {MONTHS[(b.month || 1) - 1]} {b.year}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        ₹{(b.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <ProgressBar spent={spent} total={b.amount} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                        {b.notes || "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(b)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => openDelete(b)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && pagination.total_pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(Math.max(1, filters.page - 1))}
              disabled={filters.page <= 1}
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <span className="text-sm text-slate-500">
              Page {filters.page} of {pagination.total_pages}
            </span>
            <button
              onClick={() => setPage(Math.min(pagination.total_pages, filters.page + 1))}
              disabled={filters.page >= pagination.total_pages}
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}

        <div className="mt-10 text-center text-sm text-slate-400">
          BillBuddy AI • Budget Management
        </div>
      </main>

      {/* ── Modals ── */}
      {showAdd && (
        <BudgetModal
          title="Add Budget"
          form={form}
          onChange={updateForm}
          onSubmit={handleCreate}
          onClose={() => setShowAdd(false)}
          saving={saving}
        />
      )}
      {showEdit && (
        <BudgetModal
          title="Edit Budget"
          form={form}
          onChange={updateForm}
          onSubmit={handleUpdate}
          onClose={() => setShowEdit(false)}
          saving={saving}
        />
      )}
      {showDelete && (
        <DeleteModal
          budget={selected}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
          saving={saving}
        />
      )}
    </div>
  );
};

export default Budget;
