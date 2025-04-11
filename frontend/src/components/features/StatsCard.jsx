// frontend/src/components/features/StatsCard.jsx
import React, { useState } from "react";
import {
  Info, Package, AlertTriangle, CheckCircle, DollarSign,
  BarChart2, Users, TrendingUpDown, IndianRupee, ChartNoAxesCombined
} from "lucide-react";
import { formatIndianNumber, getIndianNumberInWords } from "../../utils/formatters";

// Formatter for values
const formatValue = (type, value, unit = "") =>
  value == null ? "0" + unit
  : type === "currency" ? `₹${formatIndianNumber(value)}`
  : type === "number" ? formatIndianNumber(value)
  : `${formatIndianNumber(value)}${unit}`;

// Dynamic styles with color validation
const getStyles = color => {
  const c = ["blue", "green", "red", "purple", "indigo"].includes(color) ? color : "blue";
  return { grad: `from-${c}-500/20 to-${c}-900/20`, text: `text-${c}-400`, border: `border-${c}-500/50`, hover: `hover:border-${c}-400` };
};

export const statsConfigs = {
  inventory: [
    {title:"Total Items",getValue:s=>formatValue("number",s.totalCount),icon:Package,color:"blue",footer:"Total inventory items"},
    {title:"Items to Reorder",getValue:s=>formatValue("number",s.itemsToReorder),icon:AlertTriangle,color:"red",footer:"Items below reorder level"},
    {title:"In Stock Items",getValue:s=>formatValue("number",s.inStockItems),icon:CheckCircle,color:"green",footer:"Items above reorder level"}
  ],
  sales: [
    {title:"Total Sales",getValue:s=>formatValue("number",s.totalCount),icon:BarChart2,color:"blue",footer:"Total number of sales"},
    {title:"Total Revenue",getValue:s=>formatValue("currency",s.totalRevenue),icon:DollarSign,color:"green",footer:"Total revenue generated"},
    {title:"Total Quantity",getValue:s=>formatValue("number",s.totalQuantity,"L"),icon:Package,color:"green",footer:"Total quantity sold"}
  ],
  employee: [
    {title:"Total Employees",getValue:s=>formatValue("number",s.totalCount||0),icon:Users,color:"blue",footer:"Active workforce"},
    {title:"Total Salary",getValue:s=>formatValue("currency",s.totalSalary),icon:DollarSign,color:"green",footer:"Monthly payout"},
    {title:"Average Salary",getValue:s=>formatValue("currency",s.averageSalary),icon:TrendingUpDown,color:"purple",footer:"Per employee"}
  ],
  expense: [
    {title:"Total Expenses",getValue:s=>formatValue("currency",s.totalAmount||0),icon:Package,color:"blue",footer:"Total expenditure"},
    {title:"Total Entries",getValue:s=>formatValue("number",s.totalCount||0),icon:CheckCircle,color:"green",footer:"Number of transactions"},
    {title:"Average Expense",getValue:s=>formatValue("currency",s.averageAmount?.toFixed(2)||0),icon:TrendingUpDown,color:"purple",footer:"Per transaction"}
  ],
  business: [
    {title:"Sales Overview",getValue:s=>formatValue("currency",s.sales),icon:IndianRupee,color:"blue",getFooter:(s,data)=>`${formatIndianNumber(s.quantity)}L • ₹${formatIndianNumber(s.avgSaleValue)}/sale`},
    {title:"Inventory",getValue:s=>formatValue("number",s.inventory," Units"),icon:Package,color:"green",getFooter:(s,data)=>`${s.lowStockItems} low stock • ${s.inventoryTurnover}x turnover`},
    {title:"Expenses",getValue:s=>formatValue("currency",s.expenses),icon:IndianRupee,color:"red",getFooter:(s,data)=>`${data?.expenses?.length||0} records • ₹${formatIndianNumber(s.salaries)} salaries`},
    {title:"Profit/Loss",getValue:s=>formatValue("currency",s.profitLoss),icon:ChartNoAxesCombined,color:"purple",getFooter:(s,data)=>`${s.totalEmployees} employees • ${s.profitMargin}% margin`}
  ]
};

const StatsCard = ({ title, value, icon: Icon, color = "blue", footer, getFooter, data }) => {
  const [tooltip, setTooltip] = useState(false);
  const numericValue = String(value).replace(/[^0-9.]/g, "");
  const isCurrency = value.includes("₹");
  const isQuantity = value.includes("L");
  const { grad, text, border, hover } = getStyles(color);
  const displayFooter = getFooter ? getFooter(data?.stats || {}, data) : footer;

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${grad} border ${border} ${hover} transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg border ${border} shadow-lg`}>
          {Icon && <Icon className={`w-8 h-8 ${text}`}/>}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{title}</span>
            {numericValue && (
              <button
                onMouseEnter={()=>setTooltip(true)}
                onMouseLeave={()=>setTooltip(false)}
                className="relative w-6 h-6 text-gray-400 hover:text-white"
              >
                <Info size={16}/>
                {tooltip && (
                  <div className="absolute right-0 z-50 p-2 mt-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg shadow-xl top-full min-w-max">
                    {getIndianNumberInWords(numericValue, isCurrency, isQuantity)}
                  </div>
                )}
              </button>
            )}
          </div>
          <div className="mt-1 text-2xl font-bold text-white">{value}</div>
          {displayFooter && <div className="mt-1 text-sm text-gray-300">{displayFooter}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;