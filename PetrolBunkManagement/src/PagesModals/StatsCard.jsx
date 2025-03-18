import React from 'react';

const StatsCard = ({ icon, iconBgColor, iconColor, title, value, suffix = '' }) => {
  return (
    <div className="p-6 transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 hover:cursor-pointer">
      <div className="flex items-center">
        <div className={`p-3 mr-4 ${iconColor} ${iconBgColor} rounded-full`}>
          {icon}
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white">
            {value}
            {suffix}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
