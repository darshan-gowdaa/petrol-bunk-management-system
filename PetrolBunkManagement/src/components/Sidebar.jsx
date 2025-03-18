import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  BarChart2, 
  Users, 
  DollarSign,
  ChartArea,
  Menu,
  ChevronLeft
} from 'lucide-react';

const Sidebar = ({ updateSidebarState }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Navigation items configuration
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'white' },
    { icon: Package, label: 'Inventory', path: '/inventory', color: 'blue' },
    { icon: BarChart2, label: 'Sales', path: '/sales', color: 'green' },
    { icon: Users, label: 'Employees', path: '/employees', color: 'purple' },
    { icon: DollarSign, label: 'Expenses', path: '/expenses', color: 'orange' },
    { icon: ChartArea, label: 'Reports', path: '/reports', color: 'teal' }
  ];

  // Get color class based on color name
  const getColorClass = (color) => {
    const colorMap = {
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      orange: "text-orange-400",
      teal: "text-teal-400",
    };
    return colorMap[color] || "text-gray-300";
  };

  // Determine if sidebar should be expanded
  const isExpanded = !isCollapsed || isHovered;
  
  // Update parent component when sidebar state changes
  useEffect(() => {
    if (updateSidebarState) {
      updateSidebarState(isExpanded ? 'w-64' : 'w-16');
    }
  }, [isExpanded, updateSidebarState]);

  return (
    <aside 
      className={`fixed h-full bg-gray-800 shadow-lg z-20 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-40 opacity-100' : 'w-0 opacity-0'
        }`}>
          <h2 className="text-xl font-bold text-white">Petrol Bunk MS</h2>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="flex items-center justify-center w-10 h-10 text-gray-300 transition-transform duration-300 hover:text-white"
        >
          {isCollapsed && !isHovered ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Navigation Items */}
      <nav className="mt-6">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:text-white group ${
                isActive ? 'bg-gray-700 text-white border-l-4 border-blue-500' : ''
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <item.icon 
                className={`transition-all duration-300 ${getColorClass(item.color)} ${
                  !isExpanded ? 'mx-auto' : 'mr-3'
                }`} 
                size={20} 
              />
              <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                isExpanded ? 'w-32 opacity-100' : 'w-0 opacity-0'
              }`}>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;