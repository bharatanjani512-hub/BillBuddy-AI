const Pagination = ({
  pagination,
  filters,
  setFilters,
}) => {
  if (!pagination || pagination.total_pages <= 0) {
    return null;
  }

  const currentPage = pagination.page || 1;
  const totalPages = pagination.total_pages || 1;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white px-6 py-5 shadow-sm md:flex-row">

      <div className="text-sm text-slate-600">
        Showing page{" "}
        <span className="font-semibold">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">

        <button
          disabled={!pagination.has_previous}
          onClick={() =>
            setFilters({
              ...filters,
              page: currentPage - 1,
            })
          }
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            pagination.has_previous
              ? "border border-slate-200 hover:bg-slate-100"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          Previous
        </button>

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, index) => startPage + index
        ).map((page) => (
          <button
            key={page}
            onClick={() =>
              setFilters({
                ...filters,
                page,
              })
            }
            className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={!pagination.has_next}
          onClick={() =>
            setFilters({
              ...filters,
              page: currentPage + 1,
            })
          }
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            pagination.has_next
              ? "border border-slate-200 hover:bg-slate-100"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default Pagination;