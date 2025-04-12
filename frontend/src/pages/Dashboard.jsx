import React from "react";
import { Package, BarChart2, Users, IndianRupee, ChartArea, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { useAuth } from "../hooks/useAuth";
import { showToast, toastConfig } from "../utils/toastConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    showToast.info("Logged out successfully!");
    setTimeout(() => logout(), 1000);
  };

  const cards = [
    {id: 1,title: "Inventory",description: "Track and manage product inventory",icon: Package,path: "/inventory",color: "blue"},
    {id: 2,title: "Sales",description: "Monitor sales of Petrol and Diesel",icon: BarChart2,path: "/sales",color: "green"},
    {id: 3,title: "Employees",description: "Manage staff salary distribution",icon: Users,path: "/employees",color: "purple"},
    {id: 4,title: "Expenses",description: "Track business expenses and budgets",icon: IndianRupee,path: "/expenses",color: "orange"},
    {id: 5,title: "Reports",description: "Generate business insights and reports",icon: ChartArea,path: "/reports",color: "teal"},
    {id: 6,title: "Logout",description: "Exit Petrol Bunk Management System?",icon: LogOut,action: handleLogout,color: "red"},
  ];
  
  //Custom CSS
  const iconStyles = {
    blue: "text-blue-400 bg-blue-400/10 ring-blue-400/20 group-hover:text-blue-300 group-hover:bg-blue-400/20 group-hover:ring-blue-400/30",
    green: "text-green-400 bg-green-400/10 ring-green-400/20 group-hover:text-green-300 group-hover:bg-green-400/20 group-hover:ring-green-400/30",
    purple: "text-purple-400 bg-purple-400/10 ring-purple-400/20 group-hover:text-purple-300 group-hover:bg-purple-400/20 group-hover:ring-purple-400/30",
    orange: "text-orange-400 bg-orange-400/10 ring-orange-400/20 group-hover:text-orange-300 group-hover:bg-orange-400/20 group-hover:ring-orange-400/30",
    teal: "text-teal-400 bg-teal-400/10 ring-teal-400/20 group-hover:text-teal-300 group-hover:bg-teal-400/20 group-hover:ring-teal-400/30",
    red: "text-red-400 bg-red-400/10 ring-red-400/20 group-hover:text-red-300 group-hover:bg-red-400/20 group-hover:ring-red-400/30",
    default: "text-gray-400 bg-gray-400/10 ring-gray-400/20 group-hover:text-gray-300 group-hover:bg-gray-400/20 group-hover:ring-gray-400/30"
  };

  const gradientBackgrounds = {
    blue: "bg-gradient-to-br from-blue-500/20 to-blue-900/20 border-blue-500/50 hover:border-blue-400 hover:shadow-blue-500/20",
    green: "bg-gradient-to-br from-green-500/20 to-green-900/20 border-green-500/50 hover:border-green-400 hover:shadow-green-500/20",
    purple: "bg-gradient-to-br from-purple-500/20 to-purple-900/20 border-purple-500/50 hover:border-purple-400 hover:shadow-purple-500/20",
    orange: "bg-gradient-to-br from-orange-500/20 to-orange-900/20 border-orange-500/50 hover:border-orange-400 hover:shadow-orange-500/20",
    teal: "bg-gradient-to-br from-teal-500/20 to-teal-900/20 border-teal-500/50 hover:border-teal-400 hover:shadow-teal-500/20",
    red: "bg-gradient-to-br from-red-500/20 to-red-900/20 border-red-500/50 hover:border-red-400 hover:shadow-red-500/20",
    default: "bg-gradient-to-br from-gray-500/20 to-gray-900/20 border-gray-500/50 hover:border-gray-400 hover:shadow-gray-500/20"
  };

  const getIconStyles = (color) => iconStyles[color] || iconStyles.default;
  const getGradientBackground = (color) => gradientBackgrounds[color] || gradientBackgrounds.default;

  const handleCardClick = (card) => {
    if (card.action) card.action();
    else navigate(card.path);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="flex flex-col w-full max-w-6xl p-6 mx-auto">
        <div className="flex-1 p-3 ml-16 overflow-auto transition-all duration-300 bg-transparent">
          <h1 className="self-start mb-10 text-4xl font-black leading-tight tracking-tight text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text animate-gradient-flow drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            <Typewriter words={["Welcome to Petrol Bunk Management System!"]} typeSpeed={32} />
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.id} onClick={() => handleCardClick(card)} className={`flex flex-col items-center justify-center space-y-2 transition-all duration-200 ease-out ${getGradientBackground(card.color)} border shadow-none cursor-pointer px-6 py-4 rounded-xl group hover:shadow-[0_4px_12px] hover:scale-[1.02] backdrop-blur-sm h-[180px]`}>
                <div className={`p-2.5 rounded-full ring-2 transform transition-all duration-200 ease-out ${getIconStyles(card.color)} group-hover:rotate-6 group-hover:scale-110`}>
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
      <ToastContainer {...toastConfig} />
    </div>
  );
};

export default Dashboard;