import React from 'react';
import { Edit, Trash2, Eye } from "lucide-react";

const Table = ({ 
  columns, 
  data,
  onEdit, 
  onDelete, 
  onView,
  emptyStateMessage = "No records found. Add a new entry to get started."
}) => {
  // Calculate column widths - make first column slightly larger
  const getGridTemplate = () => {
    if (columns.length === 0) return '';
    const firstColWidth = '1.5fr';
    const otherColWidth = '1fr';
    return `${firstColWidth} repeat(${columns.length - 1}, ${otherColWidth}) 100px`;
  };

  const EmptyState = () => (
    <div className="px-4 py-12 text-center">
      <p className="text-lg text-gray-400">{emptyStateMessage}</p>
    </div>
  );

  return (
    <div className="overflow-hidden bg-gray-900 rounded-lg shadow-lg">
      {/* Header with entry count */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-medium text-white">Records</h2>
        <div className="px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md">
          Showing {data.length} entries
        </div>
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:block overflow-auto max-h-[calc(100vh-12rem)]">
        <div className="min-w-full">
          {/* Table header */}
          <div className="sticky top-0 z-10 grid min-w-full bg-gray-800 border-b border-gray-700" 
               style={{ gridTemplateColumns: getGridTemplate() }}>
            {columns.map((col) => (
              <div
                key={col.key}
                className={`px-4 py-3 text-xs font-medium tracking-wider text-gray-300 uppercase ${
                  col.centered ? 'text-center' : 'text-left'
                }`}
              >
                {col.label}
              </div>
            ))}
            <div className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-300 uppercase me-2">
              Actions
            </div>
          </div>
          
          {/* Table body */}
          <div className="bg-gray-800 divide-y divide-gray-700">
            {data.length === 0 ? <EmptyState /> : (
              data.map((item) => (
                <div key={item._id} className="grid min-w-full transition-colors hover:bg-gray-700" 
                     style={{ gridTemplateColumns: getGridTemplate() }}>
                  {columns.map((col) => (
                    <div 
                      key={col.key} 
                      className={`px-4 py-3 overflow-hidden text-gray-300 text-ellipsis ${
                        col.centered ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </div>
                  ))}
                  <div className="flex items-center justify-end px-4 py-3 space-x-2">
                    {onView && (
                      <button onClick={() => onView(item)} className="p-1.5 text-blue-300 bg-blue-900/30 rounded-full hover:bg-blue-800/50 transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                    )}
                    <button onClick={() => onEdit(item)} className="p-1.5 text-emerald-300 bg-emerald-900/30 rounded-full hover:bg-emerald-800/50 transition-colors" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDelete(item)} className="p-1.5 text-red-300 bg-red-900/30 rounded-full hover:bg-red-800/50 transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden overflow-auto max-h-[calc(100vh-12rem)]">
        {data.length === 0 ? <div className="p-4 text-center text-gray-400">{emptyStateMessage}</div> : (
          <div className="divide-y divide-gray-700">
            {data.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-200 truncate max-w-[70%]">
                    {item[columns[0]?.key]}
                  </div>
                  <div className="flex items-center space-x-1">
                    {onView && (
                      <button onClick={() => onView(item)} className="p-1.5 text-blue-300 bg-blue-900/30 rounded-full hover:bg-blue-800/50" title="View Details">
                        <Eye size={14} />
                      </button>
                    )}
                    <button onClick={() => onEdit(item)} className="p-1.5 text-emerald-300 bg-emerald-900/30 rounded-full hover:bg-emerald-800/50" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => onDelete(item)} className="p-1.5 text-red-300 bg-red-900/30 rounded-full hover:bg-red-800/50" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {columns.slice(1).map((col) => (
                  <div key={col.key} className="grid grid-cols-2 gap-2 py-1 text-sm">
                    <div className="text-gray-400">{col.label}:</div>
                    <div className="overflow-hidden text-gray-300 text-ellipsis">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
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

export default Table;