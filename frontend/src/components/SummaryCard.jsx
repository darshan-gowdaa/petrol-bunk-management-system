import React from "react";

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color,
  subValue1,
  subValue2,
}) => {
  const getGradient = () => {
    const colors = {
      blue: "from-blue-500/20 to-blue-900/20 border-blue-500/50 hover:border-blue-400",
      green:
        "from-green-500/20 to-green-900/20 border-green-500/50 hover:border-green-400",
      red: "from-red-500/20 to-red-900/20 border-red-500/50 hover:border-red-400",
      purple:
        "from-purple-500/20 to-purple-900/20 border-purple-500/50 hover:border-purple-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br border backdrop-blur-sm 
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-lg hover:shadow-${color}-500/10
        cursor-pointer transform-gpu ${getGradient()}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
          {title}
        </span>
        {Icon && (
          <Icon
            className={`w-5 h-5 text-${color}-400 transition-transform duration-300 group-hover:scale-110`}
          />
        )}
      </div>
      <div className="mb-2 text-2xl font-bold transition-colors">{value}</div>
      <div className="space-y-1">
        <div className="text-sm text-gray-300 transition-colors">
          {subValue1}
        </div>
        <div className="text-sm text-gray-300 transition-colors">
          {subValue2}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
