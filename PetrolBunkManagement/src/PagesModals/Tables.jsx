import { RefreshCw, Edit, Trash2, AlertTriangle } from "lucide-react";

const Table = ({ columns, data, loading, onEdit, onDelete, type }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded shadow-[0px_0px_12px_rgba(255,255,255,0.1)]">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-900">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-400">
                <div className="flex items-center justify-center">
                  <RefreshCw size={20} className="mr-2 text-gray-300 animate-spin" />
                  Loading...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-400">
                No records found. Add a new entry to get started.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-700">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-300 bg-blue-900 rounded-full hover:bg-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-2 text-red-300 bg-red-900 rounded-full hover:bg-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
