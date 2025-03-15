import React, { useState, useEffect } from "react";
import {
  Package,
  BarChart2,
  Users,
  DollarSign,
  ChartArea,
  LogOut,
  Menu,
  Bell,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "HP PBMS Dashboard";
  }, []);

  const cards = [
    {
      id: 1,
      title: "Inventory Management",
      description: "Track and manage product inventory",
      icon: Package,
      path: "/inventory",
      color: "blue",
    },
    {
      id: 2,
      title: "Sales Management",
      description: "Monitor sales of Petrol and Diesel",
      icon: BarChart2,
      path: "/sales",
      color: "green",
    },
    {
      id: 3,
      title: "Employee Management",
      description: "Manage staff salary distribution",
      icon: Users,
      path: "/employees",
      color: "purple",
    },
    {
      id: 4,
      title: "Expense Tracking",
      description: "Track business expenses and budgets",
      icon: DollarSign,
      path: "/expenses",
      color: "orange",
    },
    {
      id: 5,
      title: "Reports",
      description: "Generate business insights and reports",
      icon: ChartArea,
      path: "/reports",
      color: "teal",
    },
    {
      id: 6,
      title: "Logout",
      description: "Exit - Petrol Bunk Management System?",
      icon: LogOut,
      path: "/",
      color: "red",
    },
  ];

  const getColorClass = (color) => {
    const colorMap = {
      blue: "text-blue-400 bg-blue-400/10 ring-blue-400/20",
      green: "text-green-400 bg-green-400/10 ring-green-400/20",
      purple: "text-purple-400 bg-purple-400/10 ring-purple-400/20",
      orange: "text-orange-400 bg-orange-400/10 ring-orange-400/20",
      teal: "text-teal-400 bg-teal-400/10 ring-teal-400/20",
      red: "text-red-400 bg-red-400/10 ring-red-400/20",
    };
    return colorMap[color] || colorMap.blue;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen text-gray-100 bg-gray-900">
      

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 p-10 mt-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-8 text-2xl font-bold text-center">Dashboard</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => navigate(card.path)}
                  className="overflow-hidden transition-all bg-gray-800 shadow-lg cursor-pointer rounded-xl hover:shadow-xl group"
                >
                  <div className="flex flex-col items-center justify-center p-6 space-y-4 transition-transform transform group-hover:scale-105">
                    <div className={`p-3 rounded-full ring-2 ${getColorClass(card.color)}`}>
                      <card.icon size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-center">
                      {card.title}
                    </h3>
                    <p className="text-sm text-center text-gray-400">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;