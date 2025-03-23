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
    <div className="px-4 py-4 mb-4 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center text-2xl font-bold text-white md:text-3xl">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white 
              bg-gradient-to-r from-emerald-600 to-emerald-500
              hover:from-emerald-500 hover:to-emerald-400
              rounded-lg shadow-lg shadow-emerald-500/20
              transition-all duration-300 hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={addLabel}
          >
            <Plus size={18} />
            <span>{addLabel}</span>
          </button>

          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white 
              bg-gradient-to-r from-indigo-600 to-indigo-500
              hover:from-indigo-500 hover:to-indigo-400
              rounded-lg shadow-lg shadow-indigo-500/20
              transition-all duration-300 hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={filterLabel}
          >
            <Filter size={18} />
            <span>{filterLabel}</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white 
              bg-gradient-to-r from-cyan-600 to-cyan-500
              hover:from-cyan-500 hover:to-cyan-400
              rounded-lg shadow-lg shadow-cyan-500/20
              transition-all duration-300 hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={exportLabel}
          >
            <Download size={18} />
            <span>{exportLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderWithActions;
