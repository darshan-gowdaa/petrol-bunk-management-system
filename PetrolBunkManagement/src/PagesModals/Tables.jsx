import React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";

const Table = ({ columns, data, onEdit, onDelete, onView, emptyStateMessage = "No records found. Add a new entry to get started." }) => {
  const getGridTemplate = () =>
    columns.length === 0 ? "" : `1.5fr repeat(${columns.length - 1}, 1fr) 100px`;

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

      <div className="hidden md:block overflow-auto max-h-[calc(100vh-12rem)]">
        <div className="min-w-full">
          <div className="sticky top-0 z-10 grid bg-gray-800 border-b border-gray-700" style={{ gridTemplateColumns: getGridTemplate() }}>
            {columns.map((col) => (
              <div key={col.key} className={`px-4 py-3 text-xs font-medium tracking-wider text-gray-300 uppercase ${col.centered ? "text-center" : "text-left"}`}>
                {col.label}
              </div>
            ))}
            <div className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-300 uppercase me-2">Actions</div>
          </div>

          <div className="bg-gray-800 divide-y divide-gray-700">
            {data.length === 0 ? (
              <EmptyState />
            ) : (
              data.map((item) => (
                <div key={item._id} className="grid transition-colors hover:bg-gray-700" style={{ gridTemplateColumns: getGridTemplate() }}>
                  {columns.map((col) => (
                    <div key={col.key} className={`px-4 py-3 text-gray-300 ${col.centered ? "text-center" : "text-left"}`}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </div>
                  ))}
                  <div className="flex items-center justify-end px-4 py-3 space-x-2">
                    {onView && <ActionButton onClick={() => onView(item)} Icon={Eye} color="blue" title="View Details" />}
                    <ActionButton onClick={() => onEdit(item)} Icon={Edit} color="green" title="Edit" />
                    <ActionButton onClick={() => onDelete(item)} Icon={Trash2} color="red" title="Delete" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden overflow-auto max-h-[calc(100vh-12rem)]">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-700">
            {data.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-200 truncate max-w-[70%]">{item[columns[0]?.key]}</div>
                  <div className="flex items-center space-x-1">
                    {onView && <ActionButton onClick={() => onView(item)} Icon={Eye} color="blue" title="View Details" />}
                    <ActionButton onClick={() => onEdit(item)} Icon={Edit} color="green" title="Edit" />
                    <ActionButton onClick={() => onDelete(item)} Icon={Trash2} color="red" title="Delete" />
                  </div>
                </div>
                {columns.slice(1).map((col) => (
                  <div key={col.key} className="grid grid-cols-2 gap-2 py-1 text-sm">
                    <div className="text-gray-400">{col.label}:</div>
                    <div className="text-gray-300">{col.render ? col.render(item[col.key], item) : item[col.key]}</div>
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

const ActionButton = ({ onClick, Icon, color, title }) => (
  <button
    onClick={onClick}
    className={`p-1.5 text-${color}-300 bg-${color}-800/40 rounded-full hover:bg-${color}-700/60 transition-colors duration-200`}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export default Table;
