import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import {
  Download,
  RefreshCw,
  DollarSign,
  Zap,
  TrendingUp,
  Package,
  Users,
  BarChart2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";

// Import custom components and services
import DateFilter from "../components/DateFilter";
import { StatsCard } from "../components/features";
import ChartContainer from "../components/ChartContainer";
import CustomTooltip from "../components/CustomTooltip";
import {
  fetchSales,
  fetchInventory,
  fetchEmployees,
  fetchExpenses,
} from "../services/api";

const Reports = () => {
  // States consolidated
  const [data, setData] = useState({
    sales: [],
    inventory: [],
    employees: [],
    expenses: [],
    salesTrend: [],
  });
  const [dateFilter, setDateFilter] = useState({
    range: "all",
    isCustom: false,
    customRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
    },
    pickerOpen: false,
    isDirty: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  // Update color palette to be more visible on dark background
  const COLORS = [
    "#60a5fa", // bright blue
    "#34d399", // bright green
    "#fbbf24", // bright yellow
    "#f87171", // bright red
    "#a78bfa", // bright purple
    "#f472b6", // bright pink
    "#22d3ee", // bright cyan
    "#a3e635", // bright lime
  ];

  // Memoized filter data helper
  const filterDataByDate = useCallback(
    (data, dateField = "date") => {
      if (!Array.isArray(data)) return [];

      if (dateFilter.isCustom) {
        return data.filter((item) => {
          const itemDate = new Date(item[dateField]);
          return (
            !isNaN(itemDate) &&
            itemDate >= dateFilter.customRange.startDate &&
            itemDate <= dateFilter.customRange.endDate
          );
        });
      }

      if (dateFilter.range === "all") return data;

      const now = new Date();
      let startDate;

      const ranges = {
        today: () => {
          const d = new Date(now);
          d.setHours(0, 0, 0, 0);
          return d;
        },
        week: () => {
          const d = new Date(now);
          d.setDate(now.getDate() - 7);
          return d;
        },
        month: () => {
          const d = new Date(now);
          d.setMonth(now.getMonth() - 1);
          return d;
        },
        quarter: () => {
          const d = new Date(now);
          d.setMonth(now.getMonth() - 3);
          return d;
        },
        year: () => {
          const d = new Date(now);
          d.setFullYear(now.getFullYear() - 1);
          return d;
        },
      };

      startDate = ranges[dateFilter.range] ? ranges[dateFilter.range]() : now;
      return data.filter((item) => {
        const itemDate = new Date(item[dateField]);
        return !isNaN(itemDate) && itemDate >= startDate;
      });
    },
    [dateFilter]
  );

  // Memoized data processing
  const processData = useCallback(
    (rawData) => {
      if (!rawData)
        return {
          sales: [],
          inventory: [],
          employees: [],
          expenses: [],
          salesTrend: [],
        };

      const filteredSales = filterDataByDate(rawData.sales || []);

      // Process sales by product
      const salesByProduct = Object.values(
        filteredSales.reduce((acc, sale) => {
          if (!acc[sale.product]) {
            acc[sale.product] = {
              product: sale.product,
              quantity: 0,
              revenue: 0,
              count: 0,
              avgPrice: 0,
            };
          }
          acc[sale.product].quantity += Number(sale.quantity) || 0;
          acc[sale.product].revenue += Number(sale.total) || 0;
          acc[sale.product].count += 1;
          acc[sale.product].avgPrice =
            acc[sale.product].revenue / acc[sale.product].quantity;
          return acc;
        }, {})
      );

      // Generate sales trend with proper date handling
      const salesTrend = Object.values(
        filteredSales.reduce((acc, sale) => {
          const date = new Date(sale.date);
          if (isNaN(date)) return acc;

          const dateStr = date.toLocaleDateString();
          if (!acc[dateStr]) {
            acc[dateStr] = {
              date: dateStr,
              revenue: 0,
              quantity: 0,
              transactions: 0,
            };
          }
          acc[dateStr].revenue += Number(sale.total) || 0;
          acc[dateStr].quantity += Number(sale.quantity) || 0;
          acc[dateStr].transactions += 1;
          return acc;
        }, {})
      )
        .map((item) => ({
          ...item,
          avgTransactionValue:
            item.transactions > 0 ? item.revenue / item.transactions : 0,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Process expenses with validation
      const filteredExpenses = filterDataByDate(rawData.expenses || []);
      const totalExpenses = filteredExpenses.reduce(
        (sum, exp) => sum + (Number(exp.amount) || 0),
        0
      );

      const expensesByCategory = Object.values(
        filteredExpenses.reduce((acc, expense) => {
          if (!acc[expense.category]) {
            acc[expense.category] = {
              category: expense.category,
              amount: 0,
              count: 0,
            };
          }
          acc[expense.category].amount += Number(expense.amount) || 0;
          acc[expense.category].count += 1;
          return acc;
        }, {})
      ).map((item) => ({
        ...item,
        percentage:
          totalExpenses > 0
            ? ((item.amount / totalExpenses) * 100).toFixed(1)
            : "0.0",
      }));

      return {
        sales: salesByProduct,
        inventory: Array.isArray(rawData.inventory) ? rawData.inventory : [],
        employees: Array.isArray(rawData.employees) ? rawData.employees : [],
        expenses: expensesByCategory,
        salesTrend: salesTrend,
      };
    },
    [filterDataByDate]
  );

  // Fetch data with improved error handling
  const fetchAllData = useCallback(
    async (showToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const [salesData, inventoryData, employeesData, expensesData] =
          await Promise.all([
            fetchSales(),
            fetchInventory(),
            fetchEmployees(),
            fetchExpenses(),
          ]);

        const rawData = {
          sales: salesData,
          inventory: inventoryData,
          employees: employeesData,
          expenses: expensesData,
        };

        setData(processData(rawData));
        if (showToast) {
          toast.success("Data refreshed successfully!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        toast.error(error.message || "Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [processData]
  );

  // Initial data fetch on mount
  useEffect(() => {
    fetchAllData(false);
  }, [fetchAllData]);

  // Update debounced data fetch to only trigger on actual date changes
  useEffect(() => {
    // Don't fetch if dates haven't been changed
    if (!dateFilter.isDirty) return;

    // Don't fetch when picker is just being opened/closed
    if (dateFilter.pickerOpen) return;

    // Don't fetch if it's a custom date but dates haven't been selected yet
    if (
      dateFilter.isCustom &&
      (!dateFilter.customRange.startDate || !dateFilter.customRange.endDate)
    )
      return;

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(() => {
      fetchAllData(true);
    }, 500);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [
    dateFilter.range,
    dateFilter.isCustom,
    dateFilter.customRange.startDate,
    dateFilter.customRange.endDate,
  ]);

  // Memoized summary statistics
  const stats = useMemo(() => {
    const totals = {
      sales: data.sales.reduce((sum, item) => sum + item.revenue, 0),
      quantity: data.sales.reduce((sum, item) => sum + item.quantity, 0),
      inventory: data.inventory.reduce(
        (sum, item) => sum + item.currentStock,
        0
      ),
      expenses: data.expenses.reduce((sum, item) => sum + item.amount, 0),
      salaries: data.employees.reduce((sum, emp) => sum + emp.salary, 0),
      transactions: data.sales.reduce((sum, item) => sum + item.count, 0),
    };

    return {
      ...totals,
      lowStockItems: data.inventory.filter(
        (item) => item.currentStock <= item.reorderLevel
      ).length,
      totalEmployees: data.employees.length,
      profitLoss: totals.sales - totals.expenses - totals.salaries,
      profitMargin:
        totals.sales > 0
          ? (
              ((totals.sales - totals.expenses - totals.salaries) /
                totals.sales) *
              100
            ).toFixed(1)
          : 0,
      avgSaleValue:
        totals.transactions > 0
          ? (totals.sales / totals.transactions).toFixed(2)
          : 0,
      inventoryTurnover:
        totals.inventory > 0
          ? (totals.quantity / totals.inventory).toFixed(2)
          : 0,
    };
  }, [data]);

  // Generate PDF report - simplified
  const generatePDFReport = async () => {
    if (!reportRef.current) return;

    const toastId = toast.info("Generating PDF report...", {
      autoClose: false,
    });

    try {
      setTimeout(async () => {
        const canvas = await html2canvas(reportRef.current, {
          scale: 1,
          useCORS: true,
          logging: false,
          backgroundColor: "#1f2937",
        });

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          imgWidth,
          imgHeight
        );
        pdf.save(`business-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);

        toast.dismiss(toastId);
        toast.success("Report downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss(toastId);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="container p-6 mx-auto max-w-7xl">
        <div ref={reportRef}>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">
              Business Analytics & Reports
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <DateFilter
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />

              <button
                onClick={() => fetchAllData(true)}
                className="flex items-center h-10 gap-2 px-4 text-sm text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
                <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
              </button>

              <button
                onClick={generatePDFReport}
                className="flex items-center h-10 gap-2 px-4 text-sm text-white rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || error || !data.sales.length}
              >
                <Download size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-xl text-blue-400">
                <RefreshCw className="animate-spin" />
                Loading data...
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="text-xl text-red-400">{error}</div>
              <button
                onClick={() => fetchAllData(true)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          ) : !data.sales.length ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-gray-400">
                No data available for the selected period
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Total Sales"
                  value={`₹${stats.sales.toLocaleString()}`}
                  icon={DollarSign}
                  color="blue"
                  subValue1={
                    <span className="flex items-center">
                      <TrendingUp size={16} className="mr-1" />
                      {stats.quantity.toFixed(2)} Liters
                    </span>
                  }
                  subValue2={
                    <span className="flex items-center text-sm">
                      <ArrowUp size={14} className="mr-1" />
                      Avg ₹{stats.avgSaleValue}/sale
                    </span>
                  }
                />
                <StatsCard
                  title="Inventory Status"
                  value={`${stats.inventory.toLocaleString()} Units`}
                  icon={Package}
                  color="green"
                  subValue1={
                    <span className="flex items-center">
                      <Zap size={16} className="mr-1" />
                      {stats.lowStockItems} needs reorder
                    </span>
                  }
                  subValue2={
                    <span className="flex items-center text-sm">
                      Turnover: {stats.inventoryTurnover}x
                    </span>
                  }
                />
                <StatsCard
                  title="Total Expenses"
                  value={`₹${stats.expenses.toLocaleString()}`}
                  icon={DollarSign}
                  color="red"
                  subValue1={
                    <span className="flex items-center">
                      <RefreshCw size={16} className="mr-1" />
                      {data.expenses.length} records
                    </span>
                  }
                  subValue2={
                    <span className="flex items-center text-sm">
                      <ArrowDown size={14} className="mr-1" />
                      Salaries: ₹{stats.salaries.toLocaleString()}
                    </span>
                  }
                />
                <StatsCard
                  title="Net Profit/Loss"
                  value={`₹${stats.profitLoss.toLocaleString()}`}
                  icon={BarChart2}
                  color="purple"
                  subValue1={
                    <span className="flex items-center">
                      <Users size={16} className="mr-1" />
                      {stats.totalEmployees} employees
                    </span>
                  }
                  subValue2={
                    <span className="flex items-center text-sm">
                      Margin: {stats.profitMargin}%
                    </span>
                  }
                />
              </div>

              {/* Charts Section */}
              <div className="space-y-6">
                {/* Sales Analysis */}
                <div className="p-5 border shadow-lg rounded-xl border-gray-800/40 bg-gray-800/10 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-semibold">Sales Analysis</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <ChartContainer title="Sales by Product">
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={data.sales}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="product" stroke="#fff" />
                          <YAxis yAxisId="left" stroke="#fff" />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#fff"
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            contentStyle={{
                              backgroundColor: "rgba(17, 24, 39, 0.8)",
                              border: "1px solid #374151",
                              borderRadius: "0.5rem",
                              backdropFilter: "blur(4px)",
                            }}
                          />
                          <Legend wrapperStyle={{ color: "#fff" }} />
                          <Bar
                            yAxisId="left"
                            dataKey="revenue"
                            name="Revenue (₹)"
                            fill="#60a5fa"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="quantity"
                            name="Quantity (L)"
                            fill="#34d399"
                            radius={[4, 4, 0, 0]}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="avgPrice"
                            name="Avg Price (₹/L)"
                            stroke="#fbbf24"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#fbbf24" }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer title="Sales Trend">
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.salesTrend}>
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#60a5fa"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#60a5fa"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorQuantity"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#34d399"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#34d399"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="date" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip
                            content={<CustomTooltip />}
                            contentStyle={{
                              backgroundColor: "rgba(17, 24, 39, 0.8)",
                              border: "1px solid #374151",
                              borderRadius: "0.5rem",
                              backdropFilter: "blur(4px)",
                            }}
                          />
                          <Legend wrapperStyle={{ color: "#fff" }} />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue (₹)"
                            stroke="#60a5fa"
                            fill="url(#colorRevenue)"
                          />
                          <Area
                            type="monotone"
                            dataKey="quantity"
                            name="Quantity (L)"
                            stroke="#34d399"
                            fill="url(#colorQuantity)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>

                {/* Advanced Analytics */}
                <div className="p-5 border shadow-lg rounded-xl border-gray-800/40 bg-gray-800/10 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Advanced Analytics
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <ChartContainer title="Transaction Analysis">
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={data.salesTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="date" stroke="#CCC" />
                          <YAxis yAxisId="left" stroke="#CCC" />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#CCC"
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="transactions"
                            name="Transactions"
                            fill="#8b5cf6"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="avgTransactionValue"
                            name="Avg Transaction (₹)"
                            stroke="#ec4899"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer title="Expense vs Income">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            {
                              name: "Revenue",
                              value: stats.sales,
                              type: "Income",
                            },
                            {
                              name: "Expenses",
                              value: stats.expenses,
                              type: "Expense",
                            },
                            {
                              name: "Salaries",
                              value: stats.salaries,
                              type: "Expense",
                            },
                            {
                              name: "Profit",
                              value:
                                stats.profitLoss > 0 ? stats.profitLoss : 0,
                              type: "Income",
                            },
                            {
                              name: "Loss",
                              value:
                                stats.profitLoss < 0
                                  ? Math.abs(stats.profitLoss)
                                  : 0,
                              type: "Expense",
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="name" stroke="#CCC" />
                          <YAxis stroke="#CCC" />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="value"
                            name="Amount (₹)"
                            fill={(entry) =>
                              entry.type === "Income" ? "#10b981" : "#ef4444"
                            }
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>

                {/* Expense Analysis */}
                <div className="p-5 border shadow-lg rounded-xl border-gray-800/40 bg-gray-800/10 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Expense Analysis
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <ChartContainer title="Expense Distribution">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data.expenses}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="amount"
                            nameKey="category"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(1)}%`
                            }
                          >
                            {data.expenses.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [
                              `₹${value.toLocaleString()}`,
                              "Amount",
                            ]}
                            contentStyle={{
                              backgroundColor: "#333",
                              border: "none",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer title="Expense Categories">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={data.expenses.sort(
                            (a, b) => b.amount - a.amount
                          )}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis type="number" stroke="#CCC" />
                          <YAxis
                            dataKey="category"
                            type="category"
                            stroke="#CCC"
                            width={100}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="amount"
                            name="Amount (₹)"
                            fill="#ef4444"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>

                {/* Inventory Status */}
                <div className="p-5 border shadow-lg rounded-xl border-gray-800/40 bg-gray-800/10 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Inventory Status
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-4 overflow-auto border rounded-lg bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/30 max-h-72 backdrop-blur-sm">
                      <h3 className="mb-3 text-lg font-medium text-gray-300">
                        Current Stock
                      </h3>
                      <table className="w-full text-white border-collapse shadow-md">
                        <thead>
                          <tr className="text-gray-300 bg-gray-800/50">
                            <th className="p-3 text-left">Item</th>
                            <th className="p-3 text-left">Current Stock</th>
                            <th className="p-3 text-left">Reorder Level</th>
                            <th className="p-3 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.inventory.map((item) => {
                            const stockStatus =
                              item.currentStock <= item.reorderLevel
                                ? {
                                    class: "bg-red-900 text-red-200",
                                    text: "Low Stock",
                                  }
                                : item.currentStock <= item.reorderLevel * 1.5
                                ? {
                                    class: "bg-yellow-900 text-yellow-200",
                                    text: "Medium Stock",
                                  }
                                : {
                                    class: "bg-green-900 text-green-200",
                                    text: "Sufficient",
                                  };

                            return (
                              <tr
                                key={item._id}
                                className="transition-colors border-b border-gray-700/50 hover:bg-gray-800/50"
                              >
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">{item.currentStock}</td>
                                <td className="p-3">{item.reorderLevel}</td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-sm ${stockStatus.class}`}
                                  >
                                    {stockStatus.text}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <ChartContainer title="Stock Levels">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={data.inventory.map((item) => ({
                            name: item.name,
                            stock: item.currentStock,
                            reorderLevel: item.reorderLevel,
                            buffer: Math.max(
                              0,
                              item.currentStock - item.reorderLevel
                            ),
                          }))}
                          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                          barGap={0}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="name" stroke="#CCC" />
                          <YAxis stroke="#CCC" />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="reorderLevel"
                            name="Reorder Level"
                            fill="#ef4444"
                          />
                          <Bar
                            dataKey="buffer"
                            name="Buffer Stock"
                            fill="#10b981"
                            stackId="a"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ fontSize: "0.875rem" }}
        />
      </main>
    </div>
  );
};

export default Reports;
