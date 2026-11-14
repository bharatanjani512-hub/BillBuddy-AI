const BudgetTable = ({
  budgets = [],
  loading,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        Loading budgets...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>

              <th className="px-6 py-4 text-left">
                Title
              </th>

              <th className="px-6 py-4 text-left">
                Category
              </th>

              <th className="px-6 py-4 text-left">
                Month
              </th>

              <th className="px-6 py-4 text-left">
                Year
              </th>

              <th className="px-6 py-4 text-left">
                Amount
              </th>

            </tr>
          </thead>

          <tbody>

            {budgets.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-slate-500"
                >
                  No budgets found.
                </td>
              </tr>
            ) : (
              budgets.map((budget) => (
                <tr
                  key={budget._id}
                  className="border-t"
                >
                  <td className="px-6 py-5 font-medium">
                    {budget.title}
                  </td>

                  <td className="px-6 py-5">
                    {budget.category}
                  </td>

                  <td className="px-6 py-5">
                    {budget.month}
                  </td>

                  <td className="px-6 py-5">
                    {budget.year}
                  </td>

                  <td className="px-6 py-5 font-semibold text-green-600">
                    ₹{budget.amount}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default BudgetTable;