import React, { useState } from "react";
import { Info } from "lucide-react";
import toWords from "number-to-words";

// Function to format number as per Indian numbering system
const formatIndianNumber = (num) => {
  return num.toLocaleString("en-IN");
};

// Function to convert number to words in the Indian numbering system
const getIndianNumberInWords = (num, prefix, suffix) => {
  const [integer, decimal] = num.toString().replace(/,/g, "").split(".");
  let words = toWords
    .toWords(parseInt(integer))
    .replace(/^\w/, (c) => c.toUpperCase());

  // Handle Indian number system words
  const units = ["Thousand", "Lakh", "Crore"];
  const numValue = parseInt(integer);
  if (numValue >= 10000000) words = words.replace("million", units[2]); // Crore
  else if (numValue >= 100000)
    words = words.replace("hundred thousand", units[1]); // Lakh
  else if (numValue >= 1000) words = words.replace("thousand", units[0]); // Thousand

  if (decimal)
    words +=
      " point " +
      [...decimal].map((d) => toWords.toWords(parseInt(d))).join(" ");

  // Append relevant unit
  if (prefix) words += " rupees";
  else if (suffix) words += " Liters";

  return words;
};

const StatsCard = ({ title, value, icon: Icon, color = "blue", footer }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getGradient = () => {
    const colors = {
      blue: "from-blue-500/20 to-blue-900/20 border-blue-500/50 hover:border-blue-400",
      green:
        "from-green-500/20 to-green-900/20 border-green-500/50 hover:border-green-400",
      red: "from-red-500/20 to-red-900/20 border-red-500/50 hover:border-red-400",
      purple:
        "from-purple-500/20 to-purple-900/20 border-purple-500/50 hover:border-purple-400",
      yellow:
        "from-yellow-500/20 to-yellow-900/20 border-yellow-500/50 hover:border-yellow-400",
      indigo:
        "from-indigo-500/20 to-indigo-900/20 border-indigo-500/50 hover:border-indigo-400",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = () => {
    const colors = {
      blue: "text-blue-400",
      green: "text-green-400",
      red: "text-red-400",
      purple: "text-purple-400",
      yellow: "text-yellow-400",
      indigo: "text-indigo-400",
    };
    return colors[color] || colors.blue;
  };

  const getIconBackground = () => {
    const colors = {
      blue: "bg-blue-500/10 border-blue-500/20",
      green: "bg-green-500/10 border-green-500/20",
      red: "bg-red-500/10 border-red-500/20",
      purple: "bg-purple-500/10 border-purple-500/20",
      yellow: "bg-yellow-500/10 border-yellow-500/20",
      indigo: "bg-indigo-500/10 border-indigo-500/20",
    };
    return colors[color] || colors.blue;
  };

  const getShadowColor = () => {
    const colors = {
      blue: "hover:shadow-blue-500/10",
      green: "hover:shadow-green-500/10",
      red: "hover:shadow-red-500/10",
      purple: "hover:shadow-purple-500/10",
      yellow: "hover:shadow-yellow-500/10",
      indigo: "hover:shadow-indigo-500/10",
    };
    return colors[color] || colors.blue;
  };

  // Extract numeric value and check if it's a currency or quantity
  const valueStr = String(value);
  const numericValue = valueStr.replace(/[^0-9.]/g, "");
  const isCurrency = valueStr.includes("₹");
  const isQuantity = valueStr.includes("L");

  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br border backdrop-blur-sm 
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-lg ${getShadowColor()}
        cursor-pointer transform-gpu ${getGradient()}`}
    >
      <div className="flex items-center gap-4">
        {/* Left side - Icon */}
        <div
          className={`p-3 rounded-lg border ${getIconBackground()} 
          transition-all duration-300 group-hover:scale-110 shadow-lg`}
        >
          {Icon && (
            <Icon
              className={`w-8 h-8 ${getIconColor()} transition-transform duration-300`}
            />
          )}
        </div>

        {/* Right side - Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 transition-colors group-hover:text-white">
              {title}
            </span>
            {numericValue && (
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative p-1 text-gray-400 transition-colors hover:text-white"
              >
                <Info size={16} />
                {showTooltip && (
                  <div
                    className="absolute right-0 z-50 p-2 mt-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg shadow-xl whitespace-nowrap top-full min-w-max backdrop-blur-sm bg-opacity-95"
                  >
                    {getIndianNumberInWords(
                      numericValue,
                      isCurrency,
                      isQuantity
                    )}
                  </div>
                )}
              </button>
            )}
          </div>
          <div className="mt-1 text-2xl font-bold text-white transition-colors">
            {value}
          </div>
          {footer && (
            <div className="mt-1 text-sm text-gray-300 transition-colors">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
