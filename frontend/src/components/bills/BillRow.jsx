import { Pencil, Trash2, CheckCircle, Clock } from "lucide-react";

const BillRow = ({
  bill,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const isPaid = (bill.status || "Paid").toLowerCase() === "paid";

  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50">
      <td className="px-6 py-5">
        <p className="font-semibold text-slate-800">{bill.title}</p>
        {bill.notes && (
          <p className="text-xs text-slate-400 truncate max-w-xs">{bill.notes}</p>
        )}
      </td>

      <td className="px-6 py-5">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {bill.category}
        </span>
      </td>

      <td className="px-6 py-5 text-slate-600 font-medium">
        {bill.merchant}
      </td>

      <td className="px-6 py-5 font-bold text-slate-900">
        ₹{Number(bill.amount).toLocaleString("en-IN")}
      </td>

      <td className="px-6 py-5">
        <button
          onClick={() => onToggleStatus && onToggleStatus(bill)}
          title="Click to toggle Paid / Pending"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition hover:opacity-80 ${
            isPaid
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-amber-100 text-amber-700 border border-amber-200 animate-pulse"
          }`}
        >
          {isPaid ? <CheckCircle size={13} /> : <Clock size={13} />}
          {isPaid ? "Paid" : "Pending"}
        </button>
        {bill.due_date && !isPaid && (
          <p className="text-[11px] font-medium text-amber-600 mt-1">
            Due: {bill.due_date}
          </p>
        )}
      </td>

      <td className="px-6 py-5">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          {bill.payment_mode}
        </span>
      </td>

      <td className="px-6 py-5 text-sm text-slate-500">
        {bill.date}
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onEdit(bill)}
            className="rounded-lg border border-amber-200 p-2 text-amber-600 transition hover:bg-amber-50"
            title="Edit Bill"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(bill)}
            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
            title="Delete Bill"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BillRow;
