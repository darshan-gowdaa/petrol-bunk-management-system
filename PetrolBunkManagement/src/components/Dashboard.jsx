import React from "react";
import { Package, BarChart2, Users, DollarSign, ChartArea, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { id: 1, title: "Inventory", description: "Track and manage product inventory", icon: Package, path: "/inventory", color: "blue" },
    { id: 2, title: "Sales", description: "Monitor sales of Petrol and Diesel", icon: BarChart2, path: "/sales", color: "green" },
    { id: 3, title: "Employees", description: "Manage staff salary distribution", icon: Users, path: "/employees", color: "purple" },
    { id: 4, title: "Expenses", description: "Track business expenses and budgets", icon: DollarSign, path: "/expenses", color: "orange" },
    { id: 5, title: "Reports", description: "Generate business insights and reports", icon: ChartArea, path: "/reports", color: "teal" },
    { id: 6, title: "Logout", description: "Exit Petrol Bunk Management System?", icon: LogOut, path: "/", color: "red" },
  ];

  // Function to determine the appropriate color classes for each card
  const getIconStyles = (color) => {
    switch (color) {
      case "blue":
        return "text-blue-400 bg-blue-400/10 ring-blue-400/20";
      case "green":
        return "text-green-400 bg-green-400/10 ring-green-400/20";
      case "purple":
        return "text-purple-400 bg-purple-400/10 ring-purple-400/20";
      case "orange":
        return "text-orange-400 bg-orange-400/10 ring-orange-400/20";
      case "teal":
        return "text-teal-400 bg-teal-400/10 ring-teal-400/20";
      case "red":
        return "text-red-400 bg-red-400/10 ring-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 ring-gray-400/20";
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen text-gray-100 bg-gray-900">
      <main className="flex flex-col w-full max-w-6xl p-6 mx-auto">
        <h1 className="self-start mb-6 text-3xl font-bold">
          <Typewriter words={["Welcome to Petrol Bunk Management System!"]} typeSpeed={32} />
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className="flex flex-col items-center space-y-4 transition-all bg-gray-800 shadow-lg cursor-pointer p-7 rounded-xl hover:shadow-xl group hover:scale-105 lg:p-9"
            >
              <div className={`p-4 rounded-full ring-2 ${getIconStyles(card.color)}`}>
                <card.icon size={36} />
              </div>
              <div className="text-center ">
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="text-base text-gray-400">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;