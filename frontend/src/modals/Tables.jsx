import React from "react";
import { Edit, Eye, Trash2, Loader2, Database } from "lucide-react";
import { formatCurrency, formatNumber } from "../utils/formatters";

// Active Filters Display
const ActiveFilters = ({ activeFilters, onRemoveFilter }) => {
  const hasFilters = Object.entries(activeFilters || {}).some(
    ([_, value]) => value && value !== "" && value !== "All"
  );
  if (!hasFilters) return null;

  const renderFilterValue = (key, value) => {
    if (!value || value === "" || value === "All") return null;
    const isDate = key === "dateFrom" || key === "dateTo";
    const isRange = key.endsWith("Min") || key.endsWith("Max");
    const displayKey = isRange
      ? `${key.slice(0, -3).charAt(0).toUpperCase() + key.slice(1, -3)} ${key.slice(-3)}`
      : key.charAt(0).toUpperCase() + key.slice(1);

    return (
      <span key={key} className="inline-flex items-center px-2 py-1 text-sm text-gray-200 bg-gray-700 rounded-full">
        {isDate
          ? `${key === "dateFrom" ? "From" : "To"}: ${format(new Date(value), "dd/MM/yyyy")}`
          : `${displayKey}: ${value}`}
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

// Main Table Component
const Table = ({
  columns = [], data = [], onEdit, onDelete, onView,
  isLoading = false, emptyStateMessage = "No records found. Add a new entry to get started.",
  activeFilters = {}, onRemoveFilter
}) => {
  const getGridTemplate = () =>
    columns.length ? `1.5fr repeat(${columns.length - 1}, 1fr) 100px` : "";

  const formatCellValue = (value, col) =>
    col.isCurrency ? formatCurrency(value) :
    col.isNumber ? formatNumber(value) :
    col.render ? col.render(value) :
    col.format ? col.format(value) :
    value?.toString();

  const ActionButton = ({ onClick, Icon, colorClass, title }) => (
    <button onClick={onClick} className={`p-1 rounded-lg ${colorClass} hover:scale-110 active:scale-95 transition-all`} title={title}>
      <Icon size={16} />
    </button>
  );

  const renderState = (Icon, message) => (
    <div className="px-4 py-12 text-center bg-gradient-to-b from-gray-900 to-gray-800">
      <Icon className={`w-8 h-8 mx-auto mb-4 text-gray-400 ${Icon === Loader2 ? "animate-spin" : ""}`} />
      <p className="text-lg text-gray-400">{message}</p>
    </div>
  );

  const renderTableHeader = () => (
    <div className="sticky top-0 z-10 grid border-b-2 border-gray-600 shadow-md bg-gradient-to-r from-gray-800 to-gray-700" style={{ gridTemplateColumns: getGridTemplate() }}>
      {columns.map(col => (
        <div key={col.key} className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase">{col.label}</div>
      ))}
      <div className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase">Actions</div>
    </div>
  );

  const renderTableRow = (row, i) => (
    <div key={i} className="grid transition-all hover:bg-gray-800/50" style={{ gridTemplateColumns: getGridTemplate() }}>
      {columns.map(col => (
        <div key={col.key} className="px-4 py-3 text-sm text-gray-300 truncate">
          {formatCellValue(row[col.key], col)}
        </div>
      ))}
      <div className="flex items-center gap-1 px-4 py-3">
        {onView && <ActionButton onClick={() => onView(row)} Icon={Eye} colorClass="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20" title="View Details" />}
        {onEdit && <ActionButton onClick={() => onEdit(row)} Icon={Edit} colorClass="text-green-400 hover:text-green-300 hover:bg-green-400/20" title="Edit" />}
        {onDelete && <ActionButton onClick={() => onDelete(row)} Icon={Trash2} colorClass="text-red-400 hover:text-red-300 hover:bg-red-400/20" title="Delete" />}
      </div>
    </div>
  );

  const renderMobileRow = (row, i) => (
    <div key={i} className="p-4 transition-all hover:bg-gray-800/50">
      {columns.map(col => (
        <div key={col.key} className="flex justify-between py-1">
          <span className="text-sm font-medium text-gray-400">{col.label}:</span>
          <span className="text-sm text-gray-300">{formatCellValue(row[col.key], col)}</span>
        </div>
      ))}
      <div className="flex justify-end gap-2 mt-3">
        {onView && <ActionButton onClick={() => onView(row)} Icon={Eye} colorClass="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20" title="View Details" />}
        {onEdit && <ActionButton onClick={() => onEdit(row)} Icon={Edit} colorClass="text-green-400 hover:text-green-300 hover:bg-green-400/20" title="Edit" />}
        {onDelete && <ActionButton onClick={() => onDelete(row)} Icon={Trash2} colorClass="text-red-400 hover:text-red-300 hover:bg-red-400/20" title="Delete" />}
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

      <ActiveFilters activeFilters={activeFilters} onRemoveFilter={onRemoveFilter} />

      {/* Desktop Table */}
      <div className="hidden md:block overflow-auto max-h-[calc(100vh-12rem)]">
        {isLoading
          ? renderState(Loader2, "Loading data...")
          : data.length === 0
          ? renderState(Database, emptyStateMessage)
          : (
            <div key={JSON.stringify(data)} className="min-w-full animate-fadeIn">
              {renderTableHeader()}
              <div className="divide-y divide-gray-700">{data.map(renderTableRow)}</div>
            </div>
          )}
      </div>

      {/* Mobile Table */}
      <div className="md:hidden">
        {isLoading
          ? renderState(Loader2, "Loading data...")
          : data.length === 0
          ? renderState(Database, emptyStateMessage)
          : (
            <div key={JSON.stringify(data)} className="divide-y divide-gray-700 animate-fadeIn">
              {data.map(renderMobileRow)}
            </div>
          )}
      </div>
    </div>
  );
};

export default Table;
