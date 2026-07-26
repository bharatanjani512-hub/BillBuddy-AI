import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { ChevronDown } from "lucide-react";

const sampleData = [
  { month: "Jan", expense: 12000 },
  { month: "Feb", expense: 9500 },
  { month: "Mar", expense: 14200 },
  { month: "Apr", expense: 11000 },
  { month: "May", expense: 16800 },
  { month: "Jun", expense: 13500 },
];

function ExpenseTrendChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Header */}

      <div className="mb-4 flex items-start justify-between">

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Monthly Expense Trend
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your monthly spending over time.
          </p>
        </div>

        <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          Last 6 Months
          <ChevronDown size={16} />
        </button>

      </div>

      {/* Chart */}

      <div className="h-52">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={sampleData}>

            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#64748B",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748B",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow:
                  "0 8px 24px rgba(15,23,42,0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#7C83FD"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#7C83FD",
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ExpenseTrendChart;