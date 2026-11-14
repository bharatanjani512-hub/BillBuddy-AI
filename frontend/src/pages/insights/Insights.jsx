import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Loader2,
  PackageOpen,
} from "lucide-react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { fetchInsights } from "../../services/insightService";

/* ── Helpers ── */
const confidenceColor = {
  High: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-rose-100 text-rose-700 border-rose-200",
};

function StatBadge({ label, value, icon: Icon, color }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 border ${color}`}>
      <div className="p-2 rounded-xl bg-white/60">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium opacity-70 uppercase tracking-wide">{label}</p>
        <p className="text-base font-bold">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function ListCard({ title, items, icon: ItemIcon, tint, emptyMsg }) {
  return (
    <div className={`rounded-3xl border p-6 ${tint}`}>
      <h3 className="text-base font-bold text-slate-800 mb-4">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-0.5 shrink-0 text-lg">{ItemIcon}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 italic">{emptyMsg}</p>
      )}
    </div>
  );
}

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchInsights();
      setData(result);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setError("Add some bills first to get insights.");
      } else {
        setError(err?.response?.data?.message || "Failed to load insights.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const ai = data?.ai_insights;
  const stats = data?.statistics;
  const ruleInsights = data?.rule_based_insights ?? [];
  const confidence = ai?.confidence;
  const level = confidence?.level;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-10">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
                <Sparkles size={22} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                AI Insights
              </h1>
            </div>
            <p className="text-slate-500 ml-14">
              Smart analysis of your financial habits
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Insights
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={40} className="animate-spin text-blue-500" />
            <p className="text-slate-500 text-sm font-medium">Analyzing your finances…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <PackageOpen size={56} className="text-slate-300" />
            <p className="text-slate-500 text-base font-medium">{error}</p>
            <button
              onClick={load}
              className="text-sm text-blue-600 underline underline-offset-2 hover:text-violet-600 transition"
            >
              Try again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && data && (
          <div className="space-y-8">

            {/* Statistics Strip */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatBadge
                  label="Total Expenses"
                  value={stats.total_expense != null ? `₹${Number(stats.total_expense).toLocaleString()}` : "—"}
                  icon={BarChart3}
                  color="bg-blue-50 border-blue-200 text-blue-700"
                />
                <StatBadge
                  label="Top Category"
                  value={stats.top_category ?? "—"}
                  icon={TrendingUp}
                  color="bg-violet-50 border-violet-200 text-violet-700"
                />
                <StatBadge
                  label="Top Merchant"
                  value={stats.top_merchant ?? "—"}
                  icon={ShieldCheck}
                  color="bg-slate-100 border-slate-200 text-slate-700"
                />
              </div>
            )}

            {/* AI Summary */}
            {ai?.summary && (
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 shadow-xl text-white">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                  <Sparkles size={18} />
                  <span className="text-sm font-semibold uppercase tracking-widest">AI Summary</span>
                </div>
                <p className="text-lg leading-relaxed font-medium">{ai.summary}</p>

                {/* Confidence badge */}
                {confidence && (
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-sm font-semibold">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        level === "High"
                          ? "bg-emerald-400"
                          : level === "Medium"
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }`}
                    />
                    Confidence: {level}
                    {confidence.reason && (
                      <span className="font-normal opacity-80">· {confidence.reason}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Three-column habit/recommendation cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ListCard
                title="✅ Good Habits"
                items={ai?.good_habits}
                icon="✅"
                tint="bg-emerald-50 border-emerald-200"
                emptyMsg="No good habits detected yet."
              />
              <ListCard
                title="⚠️ Risky Habits"
                items={ai?.risky_habits}
                icon="⚠️"
                tint="bg-orange-50 border-orange-200"
                emptyMsg="No risky habits detected."
              />
              <ListCard
                title="💡 Recommendations"
                items={ai?.recommendations}
                icon="💡"
                tint="bg-blue-50 border-blue-200"
                emptyMsg="No recommendations right now."
              />
            </div>

            {/* Rule-Based Insights */}
            {ruleInsights.length > 0 && (
              <div className="rounded-3xl bg-[#FEFDFB] border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <CheckCircle2 size={18} className="text-slate-500" />
                  <h3 className="text-base font-bold text-slate-800">Rule-Based Insights</h3>
                </div>
                <ul className="space-y-3">
                  {ruleInsights.map((insight, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="mt-0.5 shrink-0 text-slate-400">▸</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
