const LoadingSkeleton = ({ rows = 6 }) => {
  return (
    <tbody>
      {[...Array(rows)].map((_, row) => (
        <tr
          key={row}
          className="border-t border-slate-100"
        >
          {[...Array(7)].map((__, cell) => (
            <td
              key={cell}
              className="px-6 py-5"
            >
              <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default LoadingSkeleton;