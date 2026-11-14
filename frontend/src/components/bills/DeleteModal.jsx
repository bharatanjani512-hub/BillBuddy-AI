const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  bill,
  loading = false,
}) => {
  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <h2 className="text-2xl font-bold text-slate-800">
          Delete Bill
        </h2>

        <p className="mt-4 text-slate-600">
          Are you sure you want to delete
        </p>

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">

          <h3 className="font-semibold text-red-700">
            {bill.title}
          </h3>

          <p className="mt-1 text-sm text-red-600">
            ₹{Number(bill.amount).toLocaleString("en-IN")}
          </p>

        </div>

        <p className="mt-5 text-sm text-slate-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteModal;