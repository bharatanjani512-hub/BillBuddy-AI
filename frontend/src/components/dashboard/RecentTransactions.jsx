import {
  Calendar,
  CreditCard,
  IndianRupee,
  Receipt,
  Store,
} from "lucide-react";

function RecentTransactions({
  transactions = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
        <Receipt
          size={48}
          className="mb-4 text-slate-300"
        />

        <h3 className="text-lg font-semibold text-slate-700">
          No Transactions Yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Start adding bills to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Title
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Merchant
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Category
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Date
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Payment
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((bill) => (
            <tr
              key={bill._id}
              className="border-t transition hover:bg-slate-50"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2">
                    <Receipt
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <span className="font-medium text-slate-800">
                    {bill.title}
                  </span>
                </div>
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Store
                    size={16}
                    className="text-slate-400"
                  />

                  {bill.merchant}
                </div>
              </td>

              <td className="px-6 py-5">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  {bill.category}
                </span>
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Calendar
                    size={16}
                    className="text-slate-400"
                  />

                  {bill.date}
                </div>
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <CreditCard
                    size={16}
                    className="text-slate-400"
                  />

                  {bill.payment_mode}
                </div>
              </td>

              <td className="px-6 py-5 text-right">
                <div className="flex justify-end">
                  <span className="flex items-center gap-1 rounded-full bg-red-50 px-4 py-2 font-semibold text-red-600">
                    <IndianRupee size={16} />
                    {Number(bill.amount).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentTransactions;