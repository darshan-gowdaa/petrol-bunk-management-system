import React, { useState } from "react";
import { Info } from "lucide-react";

// Format number as per Indian numbering system
const formatIndianNumber = (num) => num.toLocaleString("en-IN");

// Convert number to words in Indian numbering system
const getIndianNumberInWords = (num, prefix, suffix) => {
  const [integer, decimal] = num.toString().replace(/,/g, "").split(".");
  let numValue = parseInt(integer);
  const wordsMap = {
    ones: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
    tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    teens: ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
  };

  const convert = (n) =>
    n < 10 ? wordsMap.ones[n] :
    n < 20 ? wordsMap.teens[n - 10] :
    n < 100 ? wordsMap.tens[Math.floor(n / 10)] + (n % 10 ? " " + wordsMap.ones[n % 10] : "") :
    wordsMap.ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + convert(n % 100) : "");

  const sections = [{ value: 10000000, label: "crore" }, { value: 100000, label: "lakh" }, { value: 1000, label: "thousand" }];
  let words = sections.reduce((acc, { value, label }) => {
    if (numValue >= value) {
      acc += convert(Math.floor(numValue / value)) + " " + label + " ";
      numValue %= value;
    }
    return acc;
  }, "");

  words += convert(numValue);
  if (decimal) words += " point " + [...decimal].map((d) => convert(parseInt(d))).join(" ");
  return (words.trim().replace(/^\w/, (c) => c.toUpperCase()) + (prefix ? " rupees" : suffix ? " liters" : ""));
};

const StatsCard = ({ title, value, icon: Icon, color = "blue", footer, subValue1, subValue2 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const colorStyles = {
    blue: { gradient: "from-blue-500/20 to-blue-900/20", text: "text-blue-400", border: "border-blue-500/50", glow: "hover:border-blue-400" },
    green: { gradient: "from-green-500/20 to-green-900/20", text: "text-green-400", border: "border-green-500/50", glow: "hover:border-green-400" },
    red: { gradient: "from-red-500/20 to-red-900/20", text: "text-red-400", border: "border-red-500/50", glow: "hover:border-red-400" },
    purple: { gradient: "from-purple-500/20 to-purple-900/20", text: "text-purple-400", border: "border-purple-500/50", glow: "hover:border-purple-400" },
    yellow: { gradient: "from-yellow-500/20 to-yellow-900/20", text: "text-yellow-400", border: "border-yellow-500/50", glow: "hover:border-yellow-400" },
    indigo: { gradient: "from-indigo-500/20 to-indigo-900/20", text: "text-indigo-400", border: "border-indigo-500/50", glow: "hover:border-indigo-400" },
  }[color];

  const numericValue = String(value).replace(/[^0-9.]/g, "");
  const isCurrency = String(value).includes("₹");
  const isQuantity = String(value).includes("L");

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorStyles.gradient} border ${colorStyles.border} ${colorStyles.glow} transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg border ${colorStyles.border} transition-all shadow-lg`}>
          {Icon && <Icon className={`w-8 h-8 ${colorStyles.text}`} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{title}</span>
            {numericValue && (
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative flex items-center justify-center w-6 h-6 text-gray-400 hover:text-white"
              >
                <Info size={16} />
                {showTooltip && (
                  <div className="absolute right-0 z-50 p-2 mt-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg shadow-xl top-full min-w-max">
                    {getIndianNumberInWords(numericValue, isCurrency, isQuantity)}
                  </div>
                )}
              </button>
            )}
          </div>
          <div className="mt-1 text-2xl font-bold text-white">{value}</div>
          {footer && <div className="mt-1 text-sm text-gray-300">{footer}</div>}
          {subValue1 && <div className="mt-1 text-sm text-gray-300">{subValue1}</div>}
          {subValue2 && <div className="mt-0.5 text-sm text-gray-400">{subValue2}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
