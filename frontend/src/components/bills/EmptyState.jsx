import { ReceiptIndianRupee } from "lucide-react";

const EmptyState = () => {
  return (
    <tr>
      <td
        colSpan={7}
        className="px-6 py-16 text-center"
      >
        <div className="flex flex-col items-center">

          <div className="mb-5 rounded-full bg-slate-100 p-5">
            <ReceiptIndianRupee
              size={42}
              className="text-slate-400"
            />
          </div>

          <h3 className="text-xl font-semibold text-slate-700">
            No Bills Found
          </h3>

          <p className="mt-2 max-w-sm text-slate-500">
            Start by adding your first bill or change your
            search and filter options.
          </p>

        </div>
      </td>
    </tr>
  );
};

export default EmptyState;