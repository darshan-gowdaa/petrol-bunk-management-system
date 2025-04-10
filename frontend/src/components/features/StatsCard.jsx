// frontend/src/components/features/StatsCard.jsx

import React, { useState } from "react";
import {
  Info, Package, AlertTriangle, CheckCircle,
  DollarSign, BarChart2, Users, Calculator, TrendingUp,
} from "lucide-react";
import { formatIndianNumber } from "../../utils/formatters";

export const statsConfigs = {
  inventory: [
    { title: "Total Items", getValue: s => s.totalCount, icon: Package, color: "blue", footer: "Total inventory items" },
    { title: "Items to Reorder", getValue: s => s.itemsToReorder, icon: AlertTriangle, color: "red", footer: "Items below reorder level" },
    { title: "In Stock Items", getValue: s => s.inStockItems, icon: CheckCircle, color: "green", footer: "Items above reorder level" },
  ],
  sales: [
    { title: "Total Sales", getValue: s => formatIndianNumber(s.totalCount), icon: BarChart2, color: "blue", footer: "Total number of sales" },
    { title: "Total Revenue", getValue: s => `₹${formatIndianNumber(s.totalRevenue)}`, icon: DollarSign, color: "green", footer: "Total revenue generated" },
    { title: "Total Quantity", getValue: s => `${formatIndianNumber(s.totalQuantity)}L`, icon: Package, color: "purple", footer: "Total quantity sold" },
  ],
  employee: [
    { title: "Total Employees", getValue: s => formatIndianNumber(s.totalCount || 0), icon: Users, color: "blue", footer: "Active workforce" },
    { title: "Total Salary", getValue: s => `₹${formatIndianNumber(s.totalSalary)}`, icon: DollarSign, color: "green", footer: "Monthly payout" },
    { title: "Average Salary", getValue: s => `₹${formatIndianNumber(s.averageSalary)}`, icon: Calculator, color: "purple", footer: "Per employee" },
  ],
  expense: [
    { title: "Total Expenses", getValue: s => `₹${s.totalAmount?.toLocaleString() || "0"}`, icon: Package, color: "indigo", footer: "Total expenditure" },
    { title: "Total Entries", getValue: s => s.totalCount || 0, icon: CheckCircle, color: "green", footer: "Number of transactions" },
    { title: "Average Expense", getValue: s => `₹${s.averageAmount?.toFixed(2) || "0.00"}`, icon: TrendingUp, color: "blue", footer: "Per transaction" },
  ],
};

const getIndianNumberInWords = (number, isRupees, isLiters) => {
  const [integerPart, decimalPart] = number.toString().replace(/,/g, "").split(".");
  let remainingValue = parseInt(integerPart);

  const numberWords = {
    ones: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
    tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    teens: ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
  };

  const convertToWords = (num) => {
    if (num < 10) return numberWords.ones[num];
    if (num < 20) return numberWords.teens[num - 10];
    if (num < 100) {
      const tens = numberWords.tens[Math.floor(num / 10)];
      const ones = numberWords.ones[num % 10];
      return tens + (ones ? " " + ones : "");
    }
    const hundreds = numberWords.ones[Math.floor(num / 100)] + " hundred";
    const rest = num % 100 ? " and " + convertToWords(num % 100) : "";
    return hundreds + rest;
  };

  const indianSections = [
    { value: 1e7, label: "crore" },
    { value: 1e5, label: "lakh" },
    { value: 1e3, label: "thousand" },
  ];

  let words = indianSections.reduce((output, section) => {
    if (remainingValue >= section.value) {
      const sectionValue = Math.floor(remainingValue / section.value);
      output += convertToWords(sectionValue) + " " + section.label + " ";
      remainingValue %= section.value;
    }
    return output;
  }, "");

  words += convertToWords(remainingValue);

  if (decimalPart) {
    const decimalWords = [...decimalPart].map(digit => convertToWords(+digit)).join(" ");
    words += " point " + decimalWords;
  }

  const finalLabel = isRupees ? " rupees" : isLiters ? " liters" : "";
  return words.trim().replace(/^\w/, c => c.toUpperCase()) + finalLabel;
};


const StatsCard = ({ title, value, icon: Icon, color = "blue", footer, subValue1, subValue2 }) => {
  const [tooltip, setTooltip] = useState(false);
  const numericValue = String(value).replace(/[^0-9.]/g, "");
  const isCurrency = String(value).includes("₹");
  const isQuantity = String(value).includes("L");

  const styles = {
    blue: ["from-blue-500/20 to-blue-900/20", "text-blue-400", "border-blue-500/50", "hover:border-blue-400"],
    green: ["from-green-500/20 to-green-900/20", "text-green-400", "border-green-500/50", "hover:border-green-400"],
    red: ["from-red-500/20 to-red-900/20", "text-red-400", "border-red-500/50", "hover:border-red-400"],
    purple: ["from-purple-500/20 to-purple-900/20", "text-purple-400", "border-purple-500/50", "hover:border-purple-400"],
    yellow: ["from-yellow-500/20 to-yellow-900/20", "text-yellow-400", "border-yellow-500/50", "hover:border-yellow-400"],
    indigo: ["from-indigo-500/20 to-indigo-900/20", "text-indigo-400", "border-indigo-500/50", "hover:border-indigo-400"],
  }[color];

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${styles[0]} border ${styles[2]} ${styles[3]} transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg border ${styles[2]} shadow-lg`}>
          {Icon && <Icon className={`w-8 h-8 ${styles[1]}`} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{title}</span>
            {numericValue && (
              <button
                onMouseEnter={() => setTooltip(true)}
                onMouseLeave={() => setTooltip(false)}
                className="relative flex items-center justify-center w-6 h-6 text-gray-400 hover:text-white"
              >
                <Info size={16} />
                {tooltip && (
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
