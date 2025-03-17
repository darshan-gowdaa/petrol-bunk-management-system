import React, { useState, useEffect } from "react";
import {
  Package,
  BarChart2,
  Users,
  DollarSign,
  ChartArea,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "HP PBMS Dashboard";
  }, []);

  const cards = [
    { id: 1, title: "Inventory", description: "Track and manage product inventory", icon: Package, path: "/inventory", color: "blue" },
    { id: 2, title: "Sales", description: "Monitor sales of Petrol and Diesel", icon: BarChart2, path: "/sales", color: "green" },
    { id: 3, title: "Employees", description: "Manage staff salary distribution", icon: Users, path: "/employees", color: "purple" },
    { id: 4, title: "Expenses", description: "Track business expenses and budgets", icon: DollarSign, path: "/expenses", color: "orange" },
    { id: 5, title: "Reports", description: "Generate business insights and reports", icon: ChartArea, path: "/reports", color: "teal" },
    { id: 6, title: "Logout", description: "Exit - Petrol Bunk Management System?", icon: LogOut, path: "/", color: "red" },
  ];

  const getColorClass = (color) => {
    return `text-${color}-400 bg-${color}-400/10 ring-${color}-400/20`;
  };

  return (
    <div className="flex flex-col h-screen text-gray-100 bg-gray-900">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-6 text-2xl font-bold text-center">Dashboard</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="flex flex-col items-center p-6 space-y-4 transition-all bg-gray-800 shadow-lg cursor-pointer rounded-xl hover:shadow-xl group hover:scale-105"
              >
                <div className={`p-3 rounded-full ring-2 ${getColorClass(card.color)}`}>
                  <card.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-center">{card.title}</h3>
                <p className="text-sm text-center text-gray-400">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;