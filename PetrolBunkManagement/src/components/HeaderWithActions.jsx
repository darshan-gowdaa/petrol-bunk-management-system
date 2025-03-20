import { Plus, Filter, Download } from "lucide-react";

const HeaderWithActions = ({
  title,
  icon,
  onAdd,
  onFilter,
  onExport,
  addLabel = "Add",
  filterLabel = "Filter",
  exportLabel = "Export"
}) => {
  return (
    <div className="px-4 py-3 bg-gray-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center text-2xl font-bold text-white md:text-3xl">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-white bg-green-700 rounded-lg shadow-md hover:bg-green-800 transition-colors"
            aria-label={addLabel}
          >
            <Plus size={16} /> {addLabel}
          </button>

          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-white bg-purple-700 rounded-lg shadow-md hover:bg-purple-800 transition-colors"
            aria-label={filterLabel}
          >
            <Filter size={16} /> {filterLabel}
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-white bg-blue-700 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
            aria-label={exportLabel}
          >
            <Download size={16} /> {exportLabel || "Export"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderWithActions;