import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import BillRow from "./BillRow";

const BillsTable = ({
  bills = [],
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const billsList = Array.isArray(bills) ? bills : [];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Merchant
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Date
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          {loading ? (
            <LoadingSkeleton />
          ) : billsList.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {billsList.map((bill) => (
                <BillRow
                  key={bill._id}
                  bill={bill}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default BillsTable;
