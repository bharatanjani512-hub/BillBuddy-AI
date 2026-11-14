import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fetchMonthlyChart } from "../../services/dashboardService";

function ExpenseChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {
    try {
      const data = await fetchMonthlyChart();
      setChartData(data);
    } catch (error) {
      console.error("Error loading monthly chart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] w-full animate-pulse rounded-2xl bg-gray-100" />
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
        No expense data available.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "#64748B",
              fontSize: 13,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#64748B",
              fontSize: 13,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "Expense",
            ]}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#2563EB",
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 8,
              fill: "#2563EB",
              stroke: "#FFFFFF",
              strokeWidth: 3,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;