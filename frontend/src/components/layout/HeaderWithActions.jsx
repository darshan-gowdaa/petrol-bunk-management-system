// frontend/src/components/layout/HeaderWithActions.jsx - Header with actions component

import { Plus, Filter, Download } from "lucide-react";

const HeaderWithActions = ({
  title,
  icon,
  onAdd,
  onFilter,
  onExport,
  addLabel = "Add",
  filterLabel = "Filter",
  exportLabel = "Export",
}) => {
  return (
    <div className="px-4 py-4 mb-4 bg-transparent rounded-lg sm:px-6 sm:py-5 sm:mb-6 sm:rounded-xl">
      <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="flex items-center text-xl font-bold text-white sm:text-2xl md:text-3xl"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
        >
          {icon && <span className="mr-2 sm:mr-3">{icon}</span>}
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white 
              bg-blue-700 hover:bg-blue-800
              rounded-lg shadow-md
              transition-all duration-200 ease-in-out
              hover:shadow-lg hover:shadow-blue-700/30
              active:transform active:scale-95
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed
              w-full sm:w-auto justify-center"
            aria-label={addLabel}
          >
            <Plus size={16} className="text-blue-100 sm:w-5 sm:h-5" />
            <span>{addLabel}</span>
          </button>

          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white 
              bg-indigo-700 hover:bg-indigo-800
              rounded-lg shadow-md
              transition-all duration-200 ease-in-out
              hover:shadow-lg hover:shadow-indigo-700/30
              active:transform active:scale-95
              focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed
              w-full sm:w-auto justify-center"
            aria-label={filterLabel}
          >
            <Filter size={16} className="text-indigo-100 sm:w-5 sm:h-5" />
            <span>{filterLabel}</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white 
              bg-emerald-700 hover:bg-emerald-800
              rounded-lg shadow-md
              transition-all duration-200 ease-in-out
              hover:shadow-lg hover:shadow-emerald-700/30
              active:transform active:scale-95
              focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed
              w-full sm:w-auto justify-center"
            aria-label={exportLabel}
          >
            <Download size={16} className="text-emerald-100 sm:w-5 sm:h-5" />
            <span>{exportLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderWithActions;