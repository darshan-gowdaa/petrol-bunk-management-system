// frontend/src/pages/Reports.jsx - Reports and analytics page component
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { Download, RefreshCw, IndianRupee, Zap, TrendingUp, Package, Users, BarChart2, ArrowUp, ArrowDown, ChartNoAxesCombined, ChartSpline } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, ComposedChart } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import DateFilter from "../components/DateFilter";
import { StatsCard, statsConfigs } from "../components/features";
import ChartContainer from "../components/ChartContainer";
import CustomTooltip from "../components/CustomTooltip";
import { fetchSales, fetchInventory, fetchEmployees, fetchExpenses } from "../services/api";
import { formatCurrency, formatNumber } from "../utils/formatters";
import { generatePDF } from "../utils/pdfGenerator";
import SalesAnalysis from "../components/charts/SalesAnalysis";
import SalesTrend from "../components/charts/SalesTrend";
import ExpenseAnalysis from "../components/charts/ExpenseAnalysis";
import InventoryStatus from "../components/charts/InventoryStatus";
import { filterDataByDate as filterDataByDateUtil, getDateRange } from "../utils/dateUtils";
import { calculateSalesByProduct, calculateSalesTrend, calculateExpensesByCategory, calculateBusinessStats } from "../utils/analyticsCalculations";
import { showToast, toastConfig } from "../utils/toastConfig";
import { formatLargeCurrency, formatLargeNumber } from "../utils/formatters";

// Main Reports component
const Reports = () => {
  // State declarations
  const [data, setData] = useState({ sales: [], inventory: [], employees: [], expenses: [], salesTrend: [] });
  const [dateFilter, setDateFilter] = useState({
    range: "all",
    isCustom: false,
    customRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date()
    },
    pickerOpen: false,
    isDirty: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  // Apply date filter to data
  const applyDateFilter = useCallback((dataToFilter, dateField = "date") => {
    const dateRange = getDateRange(dateFilter.range, dateFilter.isCustom ? dateFilter.customRange : null);
    return filterDataByDateUtil(dataToFilter, dateRange, dateField);
  }, [dateFilter]);

  // Process raw data for charts
  const processData = useCallback((rawData) => {
    if (!rawData) return { sales: [], inventory: [], employees: [], expenses: [], salesTrend: [] };
    const filteredSales = applyDateFilter(rawData.sales || []);
    const filteredExpenses = applyDateFilter(rawData.expenses || [], "date");
    const salesByProduct = calculateSalesByProduct(filteredSales);
    const salesTrend = calculateSalesTrend(filteredSales);
    const expensesByCategory = calculateExpensesByCategory(filteredExpenses);
    return {
      sales: salesByProduct,
      inventory: Array.isArray(rawData.inventory) ? rawData.inventory : [],
      employees: Array.isArray(rawData.employees) ? rawData.employees : [],
      expenses: expensesByCategory,
      salesTrend
    };
  }, [applyDateFilter]);

  // Fetch all data from APIs
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [salesData, inventoryData, employeesData, expensesData] = await Promise.all([
        fetchSales(),fetchInventory(),fetchEmployees(),fetchExpenses()
      ]);
      setData(processData({ sales: salesData, inventory: inventoryData, employees: employeesData, expenses: expensesData }));
      showToast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      showToast.error(error.message || "Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [processData]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch data when date filter changes
  useEffect(() => {
    if (!dateFilter.isDirty || dateFilter.pickerOpen) return;
    if (dateFilter.isCustom && (!dateFilter.customRange.startDate || !dateFilter.customRange.endDate)) return;
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => fetchAllData(), 500);
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [dateFilter, fetchAllData]);

  // Calculate business stats
  const stats = useMemo(() => calculateBusinessStats(data), [data]);

  // Generate PDF report
  const generatePDFReport = async (e) => {
    e?.preventDefault();
    try {
      const success = await generatePDF(reportRef, "business-report");
      if (success) toast.success("Report downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Handle refresh button click
  const handleRefresh = (e) => {
    e.preventDefault();
    fetchAllData();
  };

  // Render chart components
  const renderCharts = () => (
    <div className="space-y-6">
      <div className="p-5 border shadow-lg rounded-xl border-gray-800/40 bg-gradient-to-br from-gray-800/20 via-gray-800/10 to-gray-900/5 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-semibold">Sales Analysis</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SalesAnalysis data={data.sales} />
          <SalesTrend data={data.salesTrend} />
        </div>
      </div>
      <div className="p-5 border shadow-lg rounded-xl border-gray-800/40 bg-gray-800/10 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-semibold">Expense Analysis</h2>
        <ExpenseAnalysis expenses={data.expenses} stats={stats} />
      </div>
      <div className="p-5 border shadow-lg rounded-xl border-gray-800/40 bg-gray-800/10 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-semibold">Inventory Status</h2>
        <InventoryStatus inventory={data.inventory} />
      </div>
    </div>
  );

  // Main render
  return (
    <div className="flex flex-col min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="container p-6 mx-auto max-w-7xl">
        <div ref={reportRef}>
          {/* Header section */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">Business Analytics & Reports</h1>
            <div className="flex flex-wrap items-center gap-3">
              <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter}/>
              <button onClick={handleRefresh} className="flex items-center h-10 gap-2 px-4 text-sm text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""}/>
                <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
              </button>
              <button onClick={generatePDFReport} className="flex items-center h-10 gap-2 px-4 text-sm text-white rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || error || !data.sales.length}>
                <Download size={16}/>
                <span>Export PDF</span>
              </button>
            </div>
          </div>
          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-xl text-blue-400">
                <RefreshCw className="animate-spin"/> Loading data...
              </div>
            </div>
          ) : error ? (
            /* Error state */
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="text-xl text-red-400">{error}</div>
              <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <RefreshCw size={16}/> Try Again
              </button>
            </div>
          ) : !data.sales.length ? (
            /* No data state */
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-gray-400">No data available or some records are missing for the selected period</div>
            </div>
          ) : (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                {statsConfigs.business.map((config, index) => (
                  <StatsCard
                    key={index}
                    title={config.title}
                    value={config.getValue(stats)}
                    icon={config.icon}
                    color={config.color}
                    footer={config.getFooter(stats, data)}
                  />
                ))}
              </div>
              {/* Render charts */}
              {renderCharts()}
            </>
          )}
        </div>
        {/* Toast notifications */}
        <ToastContainer {...toastConfig}/>
      </main>
    </div>
    );
};

export default Reports;