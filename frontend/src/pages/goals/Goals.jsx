import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../../services/goalService";
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  TrendingUp,
  CheckCircle2,
  X,
} from "lucide-react";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    target_amount: "",
    saved_amount: "",
    target_date: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const res = await fetchGoals();
      const list = res.data || res.payload || [];
      setGoals(list);
    } catch (err) {
      console.error("Failed to load goals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setFormData({
      title: "",
      target_amount: "",
      saved_amount: "0",
      target_date: new Date(Date.now() + 90 * 24 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      target_amount: goal.target_amount,
      saved_amount: goal.saved_amount || 0,
      target_date: goal.target_date || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.target_amount) return;

    try {
      setSaving(true);
      const payload = {
        title: formData.title,
        target_amount: parseFloat(formData.target_amount),
        saved_amount: parseFloat(formData.saved_amount || 0),
        target_date: formData.target_date,
      };

      if (editingGoal) {
        await updateGoal(editingGoal._id, payload);
      } else {
        await createGoal(payload);
      }

      setShowModal(false);
      await loadGoals();
    } catch (err) {
      console.error("Failed to save goal", err);
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to save goal. Please check all fields.";
      alert(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      setDeleteId(null);
      await loadGoals();
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  // Calculations
  const totalTarget = goals.reduce((acc, g) => acc + (parseFloat(g.target_amount) || 0), 0);
  const totalSaved = goals.reduce((acc, g) => acc + (parseFloat(g.saved_amount) || 0), 0);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const completedGoals = goals.filter((g) => (parseFloat(g.saved_amount) || 0) >= (parseFloat(g.target_amount) || 0)).length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F4F6F2]">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-w-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
              Financial Goals
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Set savings targets for investments, emergency reserves, and major purchases.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] hover:from-[#152213] hover:to-[#2B4210] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition active:scale-[0.99]"
          >
            <Plus size={18} />
            Add Goal
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Goals</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">{goals.length}</p>
            <p className="mt-1 text-xs text-slate-400">{completedGoals} completed</p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Target Amount</p>
            <p className="mt-2 text-3xl font-extrabold text-blue-600">
              ₹{totalTarget.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-slate-400">Total target capital</p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Saved</p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600">
              ₹{totalSaved.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-slate-400">Funds accumulated</p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Overall Progress</p>
            <p className="mt-2 text-3xl font-extrabold text-[#23381E]">{overallProgress}%</p>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#243A21] to-[#46693D] rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-[#FEFDFB] p-16 text-center shadow-sm">
            <Target size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No Goals Created Yet</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              Start building your financial cushion or plan for major business purchases.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => {
              const target = parseFloat(goal.target_amount) || 1;
              const saved = parseFloat(goal.saved_amount) || 0;
              const pct = Math.min(100, Math.round((saved / target) * 100));
              const isDone = saved >= target;

              return (
                <div
                  key={goal._id}
                  className="rounded-3xl border border-stone-200 bg-[#FEFDFB] p-6 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isDone ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>
                          <Target size={22} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">{goal.title}</h3>
                          {goal.target_date && (
                            <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <Calendar size={13} /> Target: {goal.target_date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(goal)}
                          className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                          title="Edit Goal"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(goal._id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                          title="Delete Goal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="mt-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-semibold text-slate-600">
                          ₹{saved.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            of ₹{target.toLocaleString("en-IN")}
                          </span>
                        </span>
                        <span className={`text-sm font-bold ${isDone ? "text-emerald-600" : "text-blue-600"}`}>
                          {pct}%
                        </span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? "bg-gradient-to-r from-[#1C2C1A] to-[#2D4527]" : "bg-gradient-to-r from-[#243A21] to-[#46693D]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    {isDone ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <CheckCircle2 size={15} /> Goal Completed!
                      </span>
                    ) : (
                      <span>
                        Remaining:{" "}
                        <strong className="text-slate-700">
                          ₹{Math.max(0, target - saved).toLocaleString("en-IN")}
                        </strong>
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenEdit(goal)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Update Savings →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add / Edit Goal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-[#FEFDFB] p-8 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingGoal ? "Edit Financial Goal" : "Create New Goal"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. New Office Servers or Tax Reserve"
                    className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Target Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={formData.target_amount}
                      onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                      placeholder="e.g. 50000"
                      className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Already Saved (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.saved_amount}
                      onChange={(e) => setFormData({ ...formData, saved_amount: e.target.value })}
                      placeholder="e.g. 10000"
                      className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] hover:from-[#152213] hover:to-[#2B4210] px-6 py-2.5 text-sm font-semibold text-white shadow-xs disabled:opacity-60 transition active:scale-[0.99]"
                  >
                    {saving ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-[#FEFDFB] p-6 shadow-xl border border-stone-200">
              <h3 className="text-lg font-bold text-slate-800">Delete Goal?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete this goal? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Goals;
