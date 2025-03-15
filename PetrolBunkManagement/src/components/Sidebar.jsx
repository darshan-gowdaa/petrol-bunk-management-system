import React, { useEffect } from 'react';
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

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'white' },
    { icon: Package, label: 'Inventory', path: '/inventory', color: 'blue' },
    { icon: BarChart2, label: 'Sales', path: '/sales', color: 'green' },
    { icon: Users, label: 'Employees', path: '/employees', color: 'purple' },
    { icon: DollarSign, label: 'Expenses', path: '/expenses', color: 'orange' },
    { icon: ChartArea, label: 'Reports', path: '/reports', color: 'teal' }
  ];

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  return (
    <aside 
      className={`fixed h-full bg-gray-800 shadow-lg z-20 transition-all duration-500 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`p-4 border-b border-gray-700 flex items-center transition-all duration-500 ease-in-out ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        {!isCollapsed && <h2 className="text-xl font-bold text-white transition-opacity duration-500 opacity-100">Petrol Bunk Management</h2>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="text-gray-300 transition-all duration-500 hover:text-white"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-300 transition-all duration-500 ease-in-out hover:bg-gray-700 hover:text-white ${
                isActive ? 'bg-gray-700 text-white border-l-4 border-blue-500' : ''
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className={`transition-transform duration-500 ${getColorClass(item.color)} ${isCollapsed ? 'scale-110' : 'mr-3'}`} size={20} />
              <span className={`transition-opacity duration-500 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
