import React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";

const Table = ({ 
  columns = [], 
  data = [], 
  onEdit, 
  onDelete, 
  onView, 
  emptyStateMessage = "No records found. Add a new entry to get started." 
}) => {
  const getGridTemplate = () => columns.length === 0 ? "" : `1.5fr repeat(${columns.length - 1}, 1fr) 100px`;

  // Extracted as a separate component for better readability
  const EmptyState = () => (
    <div className="px-4 py-12 text-center">
      <p className="text-lg text-gray-400">{emptyStateMessage}</p>
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
        {data.length === 0 ? (
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
                  className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase bg-gray-600"
                >
                  {col.label}
                </div>
              ))}
              <div className="px-4 py-3 text-xs font-medium tracking-wider text-gray-200 uppercase bg-gray-600">
                Actions
              </div>
            </div>

            <div className="bg-gray-800 divide-y divide-gray-700">
              {data.map((item) => (
                <div 
                  key={item._id} 
                  className="grid transition-colors hover:bg-gray-700" 
                  style={{ gridTemplateColumns: getGridTemplate() }}
                >
                  {columns.map((col) => (
                    <div 
                      key={col.key} 
                      className={`px-4 py-3 text-gray-300 ${col.centered ? "text-center" : "text-left"}`}
                    >
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </div>
                  ))}
                  <div className="flex items-center justify-end px-4 py-3 space-x-2">
                    {onView && (
                      <ActionButton 
                        onClick={() => onView(item)} 
                        Icon={Eye} 
                        colorClass="text-blue-300 bg-blue-800/40 hover:bg-blue-700/60" 
                        title="View Details" 
                      />
                    )}
                    <ActionButton 
                      onClick={() => onEdit(item)} 
                      Icon={Edit} 
                      colorClass="text-green-300 bg-green-800/40 hover:bg-green-700/60" 
                      title="Edit" 
                    />
                    <ActionButton 
                      onClick={() => onDelete(item)} 
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
                        onClick={() => onView(item)} 
                        Icon={Eye} 
                        colorClass="text-blue-300 bg-blue-800/40 hover:bg-blue-700/60" 
                        title="View Details" 
                      />
                    )}
                    <ActionButton 
                      onClick={() => onEdit(item)} 
                      Icon={Edit} 
                      colorClass="text-green-300 bg-green-800/40 hover:bg-green-700/60" 
                      title="Edit" 
                    />
                    <ActionButton 
                      onClick={() => onDelete(item)} 
                      Icon={Trash2} 
                      colorClass="text-red-300 bg-red-800/40 hover:bg-red-700/60" 
                      title="Delete" 
                    />
                  </div>
                </div>
                {columns.slice(1).map((col) => (
                  <div key={col.key} className="grid grid-cols-2 gap-2 py-1 text-sm">
                    <div className="text-gray-400">{col.label}:</div>
                    <div className="text-gray-300">
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

const ActionButton = ({ onClick, Icon, colorClass, title }) => (
  <button
    onClick={onClick}
    className={`p-1.5 ${colorClass} rounded-full transition-colors duration-200`}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export default Table;