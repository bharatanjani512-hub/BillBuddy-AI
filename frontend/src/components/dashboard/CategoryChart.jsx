import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { fetchCategoryChart } from "../../services/dashboardService";

const COLORS = [
  "#2563EB",
  "#14B8A6",
  "#F97316",
  "#8B5CF6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#6366F1",
];

function CategoryChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {
    try {
      const response = await fetchCategoryChart();
      setChartData(response);
    } catch (error) {
      console.error("Error loading category chart:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = chartData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  if (loading) {
    return (
      <div className="h-[320px] w-full animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200">
        <div className="text-center">
          <div className="text-5xl">📊</div>

          <h3 className="mt-3 font-semibold text-slate-700">
            No Category Data
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Add a few bills to see category insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            stroke="#FFFFFF"
            strokeWidth={2}
            label={({ percent }) =>
              `${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.category}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.08)",
            }}
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "Expense",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              fontSize: "13px",
              paddingTop: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 text-center">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Total Categorized Expenses
        </p>

        <h3 className="mt-1 text-2xl font-bold text-slate-800">
          ₹{totalExpense.toLocaleString("en-IN")}
        </h3>
      </div>
    </div>
  );
}

export default CategoryChart;