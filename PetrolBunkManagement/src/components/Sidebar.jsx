import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  BarChart2, 
  Users, 
  DollarSign 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: BarChart2, label: 'Sales', path: '/sales' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: DollarSign, label: 'Expenses', path: '/expenses' },
    { icon: BarChart2, label: 'Reports', path: '/reports' } 

  ];

  return (
    <aside className="fixed w-64 h-full bg-gray-800 shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Petrol Bunk Management System</h2>
      </div>
      <nav className="mt-6">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${location.pathname === item.path ? 'bg-gray-700 text-white' : ''}`}
          >
            <item.icon className="mr-3" size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
