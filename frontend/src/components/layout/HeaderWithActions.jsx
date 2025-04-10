// frontend/src/components/layout/HeaderWithActions.jsx
import { Plus, Filter, Download } from "lucide-react";

const actions = [
  { key: "onAdd", label: "addLabel", default: "Add", color: "blue", Icon: Plus },
  { key: "onFilter", label: "filterLabel", default: "Filter", color: "indigo", Icon: Filter },
  { key: "onExport", label: "exportLabel", default: "Export", color: "emerald", Icon: Download },
];

const HeaderWithActions = (props) => {
  const { title, icon } = props;

  return (
    <div className="px-4 py-4 mb-4 bg-transparent rounded-lg sm:px-6 sm:py-5 sm:mb-6 sm:rounded-xl">
      <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center text-xl font-bold text-white sm:text-2xl md:text-3xl" 
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          {icon && <span className="mr-2 sm:mr-3">{icon}</span>}
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {actions.map(({ key, label, default: def, color, Icon }) => (
            <button
              key={key}
              onClick={props[key]}
              aria-label={props[label] || def}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white 
                bg-${color}-700 hover:bg-${color}-800 rounded-lg shadow-md transition-all duration-200 ease-in-out 
                hover:shadow-lg hover:shadow-${color}-700/30 active:transform active:scale-95 
                focus:outline-none focus:ring-2 focus:ring-${color}-600 focus:ring-offset-2 focus:ring-offset-gray-900 
                disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center
              `}
            >
              <Icon size={16} className={`text-${color}-100 sm:w-5 sm:h-5`} />
              <span>{props[label] || def}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderWithActions;
