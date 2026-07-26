import { Sparkles, AlertCircle, CheckCircle2, TriangleAlert, BarChart3 } from "lucide-react";

function AIInsightsCard({
  loading = false,
  error = null,
  insights = {},
}) {
  const {
    summary = "",
    good_habits = [],
    risky_habits = [],
    recommendations = [],
  } = insights;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              AI Financial Coach
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Personalized financial insights powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 animate-pulse text-violet-500" />
              <p className="text-sm text-slate-500">
                BillBuddy AI is analyzing your finances...
              </p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          !summary &&
          recommendations.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm text-slate-500">
                Add more expenses to receive personalized AI insights.
              </p>
            </div>
          )}

        {!loading && !error && (
          <>
            {summary && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">
                    Summary
                  </h3>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm leading-7 text-slate-700">
                    {summary}
                  </p>
                </div>
              </section>
            )}

            {good_habits.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-slate-900">
                    Good Habits
                  </h3>
                </div>

                <div className="space-y-3">
                  {good_habits.map((habit, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-green-100 bg-green-50 p-3"
                    >
                      <p className="text-sm text-slate-700">
                        ✅ {habit}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {risky_habits.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <TriangleAlert className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-slate-900">
                    Watch Out
                  </h3>
                </div>

                <div className="space-y-3">
                  {risky_habits.map((risk, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-amber-100 bg-amber-50 p-3"
                    >
                      <p className="text-sm text-slate-700">
                        ⚠️ {risk}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {recommendations.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  <h3 className="font-semibold text-slate-900">
                    Recommendations
                  </h3>
                </div>

                <div className="space-y-3">
                  {recommendations.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-violet-100 bg-violet-50 p-3 transition-all duration-200 hover:border-violet-300"
                    >
                      <p className="text-sm leading-7 text-slate-700">
                        💡 {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AIInsightsCard;