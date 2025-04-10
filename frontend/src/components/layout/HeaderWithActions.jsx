// frontend/src/components/layout/HeaderWithActions.jsx
import { Plus, Filter, Download } from "lucide-react";
// Predefined buttons with static Tailwind classes
const actionButtons = [
  {key: "add", label: "Add", bgColor: "bg-blue-700", hoverBgColor: "hover:bg-blue-800",
   hoverShadowColor: "hover:shadow-blue-700/30", focusRingColor: "focus:ring-blue-600",
   iconColor: "text-blue-100", Icon: Plus, handler: "onAdd"},
  {key: "filter", label: "Filter", bgColor: "bg-indigo-700", hoverBgColor: "hover:bg-indigo-800",
   hoverShadowColor: "hover:shadow-indigo-700/30", focusRingColor: "focus:ring-indigo-600",
   iconColor: "text-indigo-100", Icon: Filter, handler: "onFilter"},
  {key: "export", label: "Export", bgColor: "bg-emerald-700", hoverBgColor: "hover:bg-emerald-800",
   hoverShadowColor: "hover:shadow-emerald-700/30", focusRingColor: "focus:ring-emerald-600",
   iconColor: "text-emerald-100", Icon: Download, handler: "onExport"},
];

const HeaderWithActions = ({
  title, icon, onAdd, onFilter, onExport,
  addLabel = "Add", filterLabel = "Filter", exportLabel = "Export",
}) =>
 {
  const handlers = { onAdd, onFilter, onExport };
  const labels = { add: addLabel, filter: filterLabel, export: exportLabel };
  
  return (
    <div className="px-4 py-4 mb-4 bg-transparent rounded-lg sm:px-6 sm:py-5 sm:mb-6 sm:rounded-xl">
      <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center text-xl font-bold text-white sm:text-2xl md:text-3xl" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          {icon && <span className="mr-2 sm:mr-3">{icon}</span>}
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {actionButtons.map(({ key, label, handler, Icon, ...styles }) => (
            <button
              key={key}
              onClick={handlers[handler]}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white
                ${styles.bgColor} ${styles.hoverBgColor} ${styles.hoverShadowColor} ${styles.focusRingColor}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                rounded-lg shadow-md transition-all duration-200 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                w-full sm:w-auto justify-center`}
              aria-label={labels[key] || label}
            >
              <Icon size={16} className={`${styles.iconColor} sm:w-5 sm:h-5`} />
              <span>{labels[key] || label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderWithActions;