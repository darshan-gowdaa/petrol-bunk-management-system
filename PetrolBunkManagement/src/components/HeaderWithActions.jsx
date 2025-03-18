import { Plus, Filter, Download, PlusCircle, Database } from "lucide-react";

const HeaderWithActions = ({
  title,
  icon,
  onAdd,
  onFilter,
  onExport,
  addLabel,
  filterLabel,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6">
      <h1 className="flex items-center text-3xl font-bold text-white">
        {icon && <span className="mr-2">{icon}</span>} {title}
      </h1>

      <div className="flex items-center gap-3">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-700 rounded-lg shadow-md hover:bg-green-800"
        >
          <Plus size={16} /> {addLabel || "Add"}
        </button>

        <button
          onClick={onFilter}
          className="flex items-center gap-2 px-4 py-2 text-white bg-purple-700 rounded-lg shadow-md hover:bg-purple-800"
        >
          <Filter size={16} /> {filterLabel || "Filter"}
        </button>

        <button
          onClick={() => onExport()}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-700 rounded-lg shadow-md hover:bg-blue-800"
        >
          <Download size={16} /> Export
        </button>
      </div>
    </div>
  );
};

export default HeaderWithActions;
