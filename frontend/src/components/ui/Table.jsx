import { Inbox } from 'lucide-react'

const Table = ({ columns, data, onRowClick, loading = false, isLoading, emptyMessage }) => {
  const busy = isLoading ?? loading

  if (busy) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden min-h-[400px] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-green-200 border-t-green-600 animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/50 overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-200 mb-4">
          <Inbox size={32} strokeWidth={1.5} />
        </div>
        <h4 className="text-base font-semibold text-gray-700 mb-1">{emptyMessage || 'No records found'}</h4>
        <p className="text-sm text-gray-400 text-center max-w-xs">Nothing to display here yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((column, idx) => (
                <th
                  key={column.key || idx}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row, index) => (
              <tr
                key={row._id || row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-green-50/50' : 'hover:bg-gray-50/70'}`}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={column.key || colIdx}
                    className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-700"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
