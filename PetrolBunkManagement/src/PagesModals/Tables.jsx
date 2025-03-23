import React, { useState, useCallback } from "react";
import {
  Edit,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  Database,
} from "lucide-react";

const Table = ({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  emptyStateMessage = "No records found. Add a new entry to get started.",
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const getGridTemplate = () =>
    columns.length === 0
      ? ""
      : `1.5fr repeat(${columns.length - 1}, 1fr) 100px`;

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useCallback(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const EmptyState = () => (
    <div className="px-4 py-12 text-center">
      <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg text-gray-400">{emptyStateMessage}</p>
    </div>
  );

  const LoadingState = () => (
    <div className="px-4 py-12 text-center">
      <Loader2 className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
      <p className="text-lg text-gray-400">Loading data...</p>
    </div>
  );

  return (
    <div className="overflow-hidden bg-gray-900 rounded-lg shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-medium text-white">Records</h2>
        <div className="px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md">
          Showing {data.length} entries
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-auto max-h-[calc(100vh-12rem)]">
        {isLoading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="min-w-full">
            <div
              className="sticky top-0 z-10 grid bg-gray-800 border-b border-gray-700"
              style={{ gridTemplateColumns: getGridTemplate() }}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase transition-colors bg-gray-600 cursor-pointer hover:bg-gray-500"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase bg-gray-600">
                Actions
              </div>
            </div>

            <div className="bg-gray-800 divide-y divide-gray-700">
              {sortedData().map((item) => (
                <div
                  key={item._id}
                  className="grid transition-colors hover:bg-gray-700"
                  style={{ gridTemplateColumns: getGridTemplate() }}
                >
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className={`px-4 py-3 text-gray-300 ${
                        col.centered ? "text-center" : "text-left"
                      }`}
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </div>
                  ))}
                  <div className="flex items-center justify-end px-4 py-3 space-x-2">
                    {onView && (
                      <ActionButton
                        onClick={() => onView?.(item)}
                        Icon={Eye}
                        colorClass="text-blue-300 bg-blue-800/40 hover:bg-blue-700/60"
                        title="View Details"
                      />
                    )}
                    <ActionButton
                      onClick={() => onEdit?.(item)}
                      Icon={Edit}
                      colorClass="text-green-300 bg-green-800/40 hover:bg-green-700/60"
                      title="Edit"
                    />
                    <ActionButton
                      onClick={() => onDelete?.(item)}
                      Icon={Trash2}
                      colorClass="text-red-300 bg-red-800/40 hover:bg-red-700/60"
                      title="Delete"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile view */}
      <div className="md:hidden overflow-auto max-h-[calc(100vh-12rem)]">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-700">
            {data.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-200 truncate max-w-[70%]">
                    {item[columns[0]?.key]}
                  </div>
                  <div className="flex items-center space-x-1">
                    {onView && (
                      <ActionButton
                        onClick={() => onView?.(item)}
                        Icon={Eye}
                        colorClass="text-blue-300 bg-blue-800/40 hover:bg-blue-700/60"
                        title="View Details"
                      />
                    )}
                    <ActionButton
                      onClick={() => onEdit?.(item)}
                      Icon={Edit}
                      colorClass="text-green-300 bg-green-800/40 hover:bg-green-700/60"
                      title="Edit"
                    />
                    <ActionButton
                      onClick={() => onDelete?.(item)}
                      Icon={Trash2}
                      colorClass="text-red-300 bg-red-800/40 hover:bg-red-700/60"
                      title="Delete"
                    />
                  </div>
                </div>
                {columns.slice(1).map((col) => (
                  <div
                    key={col.key}
                    className="grid grid-cols-2 gap-2 py-1 text-sm"
                  >
                    <div className="text-gray-400">{col.label}:</div>
                    <div className="text-gray-300">
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, Icon, colorClass, title }) => (
  <button
    onClick={onClick}
    className={`p-1.5 ${colorClass} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800`}
    title={title}
    aria-label={title}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export default Table;
