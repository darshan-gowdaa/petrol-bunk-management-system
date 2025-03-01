// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Package,
  BarChart2,
  Users,
  DollarSign,
  ChartArea,
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
      icon: Package,
      path: "/inventory",
    },
    {
      id: 2,
      title: "Sales Management",
      icon: BarChart2,
      path: "/sales",
    },
    {
      id: 3,
      title: "Employee Management",
      icon: Users,
      path: "/employees",
    },
    {
      id: 4,
      title: "Expense Tracking",
      icon: DollarSign,
      path: "/expenses",
    },
    {
      id: 5,
      title: "Reports",
      icon: ChartArea,
      path: "/reports",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen text-gray-100 bg-gray-900">
      <main className={`flex-1 p-12 transition-all duration-300 my-12`}>
        <div className="grid justify-center max-w-5xl grid-cols-2 gap-8 mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer min-h-[200px] flex flex-col items-center justify-center space-y-4 transform hover:scale-105"
            >
              <card.icon size={48} className="text-blue-400" />
              <h3 className="text-xl font-semibold text-center">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
