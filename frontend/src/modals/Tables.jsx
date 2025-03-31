// frontend/src/modals/Tables.jsx - Table component

import React, { useState, useCallback } from "react";
import {
  Edit,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  Database,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, formatNumber } from "../utils/formatters";

const ActiveFilters = ({ activeFilters, onRemoveFilter }) => {
  const hasActiveFilters = Object.entries(activeFilters || {}).some(([_, value]) => value && value !== "" && value !== "All");
  if (!hasActiveFilters) return null;

  const renderFilterValue = (key, value) => {
    if (!value || value === "" || value === "All") return null;

    if (key === "dateFrom" || key === "dateTo") {
      return (
        <span key={key} className="inline-flex items-center px-2 py-1 text-sm text-gray-200 bg-gray-700 rounded-full">
          {key === "dateFrom" ? "From: " : "To: "}{format(new Date(value), "dd/MM/yyyy")}
          <button onClick={() => onRemoveFilter(key)} className="ml-1 text-gray-400 hover:text-gray-200">×</button>
        </span>
      );
    }

    if (key.endsWith("Min") || key.endsWith("Max")) {
      const baseKey = key.slice(0, -3);
      const rangeKey = key.endsWith("Min") ? "Min" : "Max";
      const displayKey = baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
      return (
        <span key={key} className="inline-flex items-center px-2 py-1 text-sm text-gray-200 bg-gray-700 rounded-full">
          {displayKey} {rangeKey}: {value}
          <button onClick={() => onRemoveFilter(key)} className="ml-1 text-gray-400 hover:text-gray-200">×</button>
        </span>
      );
    }

    return (
      <span key={key} className="inline-flex items-center px-2 py-1 text-sm text-gray-200 bg-gray-700 rounded-full">
        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
        <button onClick={() => onRemoveFilter(key)} className="ml-1 text-gray-400 hover:text-gray-200">×</button>
      </span>
    );
  };

  return (
    <div className="px-4 py-2 border-b border-gray-700 bg-gray-800/50">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-300">Active Filters:</span>
        <div className="flex items-center gap-2">
          {Object.entries(activeFilters).map(([key, value]) => renderFilterValue(key, value))}
        </div>
      </div>
    </div>
  );
};

const Table = ({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  emptyStateMessage = "No records found. Add a new entry to get started.",
  activeFilters = {},
  onRemoveFilter,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const getGridTemplate = () =>
    columns.length === 0
      ? ""
      : `1.5fr repeat(${columns.length - 1}, 1fr) 100px`;

  const handleSort = (key) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc" });
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

  const formatCellValue = (value, col) => {
    if (col.isCurrency) {
      return formatCurrency(value);
    }
    if (col.isNumber) {
      return formatNumber(value);
    }
    if (col.render) {
      return col.render(value);
    }
    if (col.format) {
      return col.format(value);
    }
    return value?.toString();
  };

  const ActionButton = ({ onClick, Icon, colorClass, title }) => (
    <button
      onClick={onClick}
      className={`p-1 transition-all duration-200 rounded-lg ${colorClass} hover:scale-110 active:scale-95`}
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  const renderState = (Icon, message) => (
    <div className="px-4 py-12 text-center bg-gradient-to-b from-gray-900 to-gray-800">
      <Icon className={`w-8 h-8 mx-auto mb-4 text-gray-400 ${Icon === Loader2 ? 'animate-spin' : ''}`} />
      <p className="text-lg text-gray-400">{message}</p>
    </div>
  );

  const renderTableHeader = () => (
    <div className="sticky top-0 z-10 grid border-b-2 border-gray-600 shadow-md bg-gradient-to-r from-gray-800 to-gray-700" style={{ gridTemplateColumns: getGridTemplate() }}>
      {columns.map((col) => (
        <div
          key={col.key}
          className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase transition-all duration-200 cursor-pointer hover:bg-gray-600/50"
          onClick={() => handleSort(col.key)}
        >
          <div className="flex items-center gap-1">
            {col.label}
            {sortConfig.key === col.key && (
              <span className="text-blue-400">
                {sortConfig.direction === "asc" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </span>
            )}
          </div>
        </div>
      ))}
      <div className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase">
        Actions
      </div>
    </div>
  );

  const renderTableRow = (row, rowIndex) => (
    <div
      key={rowIndex}
      className="grid transition-all duration-200 hover:bg-gray-800/50"
      style={{ gridTemplateColumns: getGridTemplate() }}
    >
      {columns.map((col) => (
        <div
          key={col.key}
          className="px-4 py-3 text-sm text-gray-300 truncate"
        >
          {formatCellValue(row[col.key], col)}
        </div>
      ))}
      <div className="flex items-center gap-1 px-4 py-3">
        {onView && (
          <ActionButton
            onClick={() => onView(row)}
            Icon={Eye}
            colorClass="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20"
            title="View Details"
          />
        )}
        {onEdit && (
          <ActionButton
            onClick={() => onEdit(row)}
            Icon={Edit}
            colorClass="text-green-400 hover:text-green-300 hover:bg-green-400/20"
            title="Edit"
          />
        )}
        {onDelete && (
          <ActionButton
            onClick={() => onDelete(row)}
            Icon={Trash2}
            colorClass="text-red-400 hover:text-red-300 hover:bg-red-400/20"
            title="Delete"
          />
        )}
      </div>
    </div>
  );

  const renderMobileRow = (row, rowIndex) => (
    <div
      key={rowIndex}
      className="p-4 transition-all duration-200 hover:bg-gray-800/50"
    >
      {columns.map((col) => (
        <div key={col.key} className="flex justify-between py-1">
          <span className="text-sm font-medium text-gray-400">
            {col.label}:
          </span>
          <span className="text-sm text-gray-300">
            {formatCellValue(row[col.key], col)}
          </span>
        </div>
      ))}
      <div className="flex justify-end gap-2 mt-3">
        {onView && (
          <ActionButton
            onClick={() => onView(row)}
            Icon={Eye}
            colorClass="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20"
            title="View Details"
          />
        )}
        {onEdit && (
          <ActionButton
            onClick={() => onEdit(row)}
            Icon={Edit}
            colorClass="text-green-400 hover:text-green-300 hover:bg-green-400/20"
            title="Edit"
          />
        )}
        {onDelete && (
          <ActionButton
            onClick={() => onDelete(row)}
            Icon={Trash2}
            colorClass="text-red-400 hover:text-red-300 hover:bg-red-400/20"
            title="Delete"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden border rounded-lg shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b-2 border-gray-600 shadow-md">
        <h2 className="text-lg font-medium text-white">Records</h2>
        <div className="px-3 py-1 text-sm font-medium text-gray-300 rounded-md bg-gray-700/50">
          Showing {data.length} entries
        </div>
      </div>

      <ActiveFilters
        activeFilters={activeFilters}
        onRemoveFilter={onRemoveFilter}
      />

      <div className="hidden md:block overflow-auto max-h-[calc(100vh-12rem)]">
        {isLoading ? renderState(Loader2, "Loading data...") : data.length === 0 ? renderState(Database, emptyStateMessage) : (
          <div key={JSON.stringify(data)} className="min-w-full animate-fadeIn">
            {renderTableHeader()}
            <div className="divide-y divide-gray-700">
              {sortedData().map((row, rowIndex) => renderTableRow(row, rowIndex))}
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden">
        {isLoading ? renderState(Loader2, "Loading data...") : data.length === 0 ? renderState(Database, emptyStateMessage) : (
          <div
            key={JSON.stringify(data)}
            className="divide-y divide-gray-700 animate-fadeIn"
          >
            {sortedData().map((row, rowIndex) => renderMobileRow(row, rowIndex))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
