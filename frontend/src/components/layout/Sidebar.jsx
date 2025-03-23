import React, { useState, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  BarChart2,
  Users,
  DollarSign,
  ChartArea,
  Menu,
  ChevronLeft,
} from "lucide-react";

// Color mapping extracted outside component to avoid recreation on each render
const COLOR_MAP = {
  blue: "text-blue-400",
  green: "text-green-400",
  purple: "text-purple-400",
  orange: "text-orange-400",
  teal: "text-teal-400",
  cyan: "text-cyan-400",
};

// Navigation items configuration
const NAV_ITEMS = [
  { icon: Home, label: "Dashboard", path: "/dashboard", color: "cyan" },
  { icon: Package, label: "Inventory", path: "/inventory", color: "blue" },
  { icon: BarChart2, label: "Sales", path: "/sales", color: "green" },
  { icon: Users, label: "Employees", path: "/employees", color: "purple" },
  { icon: DollarSign, label: "Expenses", path: "/expenses", color: "orange" },
  { icon: ChartArea, label: "Reports", path: "/reports", color: "teal" },
];

const NavItem = memo(({ item, isActive, isExpanded }) => {
  const { icon: Icon, label, path, color } = item;

  return (
    <Link
      to={path}
      className={`
        flex items-center px-4 py-3 text-gray-300 transition-all duration-300 
        hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 hover:text-white group relative overflow-hidden
        ${
          isActive
            ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-white border-l-4 border-blue-500"
            : ""
        }
      `}
      title={!isExpanded ? label : ""}
    >
      {/* Modern hover effect - subtle glow */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out transform -translate-x-full opacity-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent group-hover:translate-x-full group-hover:opacity-100" />

      <Icon
        className={`
          transition-all duration-300 relative z-10
          ${COLOR_MAP[color] || "text-gray-300"} 
          ${
            !isExpanded
              ? "mx-auto scale-100 group-hover:scale-110"
              : "mr-3 group-hover:translate-x-1"
          }
        `}
        size={20}
      />
      <span
        className={`
        overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out relative z-10
        ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}
      `}
      >
        {label}
      </span>
    </Link>
  );
});

const Sidebar = ({ updateSidebarState }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Memoize expanded state calculation
  const isExpanded = !isCollapsed || isHovered;

  // Update parent component when sidebar state changes
  useEffect(() => {
    updateSidebarState?.(isExpanded ? "w-64" : "w-16");
  }, [isExpanded, updateSidebarState]);

  // Toggle sidebar collapsed state
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`
        fixed h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-[4px_0_10px_-3px_rgba(0,0,0,0.3)] z-20 
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64" : "w-16"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Header with logo animation */}
      <div className="relative flex items-center justify-between p-4 overflow-hidden border-b border-gray-700/50">
        <div
          className={`
          overflow-hidden whitespace-nowrap 
          transition-all duration-300 ease-in-out
          ${isExpanded ? "w-40 opacity-100" : "w-0 opacity-0"}
        `}
        >
          <h2 className="text-xl font-bold text-white">Petrol Bunk MS</h2>
        </div>

        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center w-10 h-10 text-gray-300 transition-all duration-300 rounded-full "
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed && !isHovered ? (
            <Menu
              size={20}
              className="transition-transform duration-300 hover:rotate-90"
            />
          ) : (
            <ChevronLeft
              size={20}
              className="transition-transform duration-300 hover:-translate-x-1"
            />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1 mt-6">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            isExpanded={isExpanded}
          />
        ))}
      </nav>
    </aside>
  );
};

export default memo(Sidebar);
