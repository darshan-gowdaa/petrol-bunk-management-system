// frontend/src/pages/Dashboard.jsx - Dashboard page component
import React from "react";
import { Package, BarChart2, Users, DollarSign, ChartArea, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { useAuth } from "../hooks/useAuth";
import { showToast } from "../utils/toastConfig";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    showToast.success("Logged out successfully!");
    logout();
  };

  const cards = [
    { id: 1, title: "Inventory", description: "Track and manage product inventory", icon: Package, path: "/inventory", color: "blue" },
    { id: 2, title: "Sales", description: "Monitor sales of Petrol and Diesel", icon: BarChart2, path: "/sales", color: "green" },
    { id: 3, title: "Employees", description: "Manage staff salary distribution", icon: Users, path: "/employees", color: "purple" },
    { id: 4, title: "Expenses", description: "Track business expenses and budgets", icon: DollarSign, path: "/expenses", color: "orange" },
    { id: 5, title: "Reports", description: "Generate business insights and reports", icon: ChartArea, path: "/reports", color: "teal" },
    { id: 6, title: "Logout", description: "Exit Petrol Bunk Management System?", icon: LogOut, action: handleLogout, color: "red" },
  ];

  const getIconStyles = (color) => {
    const styles = "text-{color}-400 bg-{color}-400/10 ring-{color}-400/20 group-hover:text-{color}-300 group-hover:bg-{color}-400/20 group-hover:ring-{color}-400/30";
    return styles.replace(/{color}/g, color);
  };

  const getGradientBackground = (color) => 
    `bg-gradient-to-br from-${color}-500/20 to-${color}-900/20 border-${color}-500/50 hover:border-${color}-400 hover:shadow-${color}-500/20`;

  const handleCardClick = (card) => card.action ? card.action() : navigate(card.path);

  return (
    <div className="flex flex-col justify-center min-h-screen text-gray-100 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="flex flex-col w-full max-w-6xl p-6 mx-auto">
        <div className="flex-1 p-3 ml-16 overflow-auto bg-transparent">
          <h1 className="self-start mb-10 text-4xl font-black leading-tight tracking-tight text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text animate-gradient-flow drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            <Typewriter words={["Welcome to Petrol Bunk Management System!"]} typeSpeed={32} />
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`flex flex-col items-center justify-center space-y-2 ${getGradientBackground(card.color)} border shadow-none cursor-pointer px-6 py-4 rounded-xl group hover:shadow-[0_4px_12px] hover:scale-[1.02] backdrop-blur-sm h-[180px] transition-all duration-200 ease-out`}
              >
                <div className={`p-2.5 rounded-full ring-2 transform ${getIconStyles(card.color)} group-hover:rotate-6 group-hover:scale-110 transition-all duration-200 ease-out`}>
                  <card.icon size={28} className="transition-transform duration-200 group-hover:animate-pulse" />
                </div>
                <div className="text-center transition-all duration-200 ease-out group-hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-100">{card.title}</h3>
                  <p className="text-sm text-gray-400 transition-all duration-200 group-hover:text-gray-200 line-clamp-1">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;