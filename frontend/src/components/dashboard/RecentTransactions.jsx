import { useEffect, useState } from "react";
import {
  ArrowRight,
  Receipt,
} from "lucide-react";

import { getRecentTransactions } from "../../api/dashboard";

function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getRecentTransactions();

        if (response.success) {
          setTransactions(response.data || []);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Header */}

      <div className="mb-5 flex items-start justify-between">

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest expenses you've added
          </p>
        </div>

        <button
          className="flex items-center gap-1 text-sm font-medium transition"
          style={{
            color: "var(--color-primary)",
          }}
        >
          View All
          <ArrowRight size={16} />
        </button>

      </div>

      {/* Loading */}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}

      {!loading &&
        !error &&
        transactions.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
            <Receipt
              size={34}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-medium text-slate-600">
              No transactions yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Your latest expenses will appear here.
            </p>
          </div>
        )}

      {/* Transactions */}

      {!loading &&
        !error &&
        transactions.length > 0 && (
          <div className="space-y-3">

            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">

                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor:
                        "var(--color-primary-light)",
                    }}
                  >
                    <Receipt
                      size={18}
                      style={{
                        color:
                          "var(--color-primary)",
                      }}
                    />
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold text-slate-800">
                      {transaction.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2">

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {transaction.category}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatDate(transaction.date)}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-sm font-bold text-slate-900">
                    {formatAmount(transaction.amount)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {transaction.payment_mode}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

    </div>
  );
}

export default RecentTransactions;