import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Download, RefreshCw, DollarSign, Zap, TrendingUp,
  Package, Users, BarChart2, Calendar, Filter
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Reports = () => {
  // States
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [dateRange, setDateRange] = useState('all'); // Default to show all data
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Refs for PDF generation
  const reportRef = useRef(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchAllData();
  }, [dateRange, isCustomDate, customDateRange]);

  // Combined fetch function
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [salesRes, inventoryRes, employeeRes, expenseRes] = await Promise.all([
        axios.get('http://localhost:5000/api/sales'),
        axios.get('http://localhost:5000/api/inventory'),
        axios.get('http://localhost:5000/api/employees'),
        axios.get('http://localhost:5000/api/expenses')
      ]);

      // Process and set data
      setSalesData(processSalesData(salesRes.data));
      setInventoryData(inventoryRes.data);
      setEmployeeData(employeeRes.data);
      setExpenseData(processExpenseData(expenseRes.data));

      setIsLoading(false);
      toast.success('Data refreshed successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again.');
      setIsLoading(false);
    }
  };

  // Filter data by date range
  const filterDataByDateRange = (data, dateField = 'date') => {
    if (isCustomDate) {
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= customDateRange.startDate && itemDate <= customDateRange.endDate;
      });
    }

    if (dateRange === 'all') return data; // Return all data when 'all' is selected

    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'today': 
        startDate = new Date(now); 
        startDate.setHours(0, 0, 0, 0); 
        break;
      case 'week': 
        startDate = new Date(now); 
        startDate.setDate(now.getDate() - 7); 
        break;
      case 'month': 
        startDate = new Date(now); 
        startDate.setMonth(now.getMonth() - 1); 
        break;
      case 'quarter': 
        startDate = new Date(now); 
        startDate.setMonth(now.getMonth() - 3); 
        break;
      case 'year': 
        startDate = new Date(now); 
        startDate.setFullYear(now.getFullYear() - 1); 
        break;
      default: 
        return data;
    }

    return data.filter(item => new Date(item[dateField]) >= startDate);
  };

  // Process sales data
  const processSalesData = (data) => {
    const filteredData = filterDataByDateRange(data);

    return Object.values(filteredData.reduce((acc, sale) => {
      const product = sale.product;
      if (!acc[product]) {
        acc[product] = { product, quantity: 0, revenue: 0, count: 0 };
      }
      acc[product].quantity += sale.quantity;
      acc[product].revenue += sale.total;
      acc[product].count += 1;
      return acc;
    }, {}));
  };

  // Process expense data
  const processExpenseData = (data) => {
    const filteredData = filterDataByDateRange(data);

    return Object.values(filteredData.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = { category, amount: 0, count: 0 };
      }
      acc[category].amount += expense.amount;
      acc[category].count += 1;
      return acc;
    }, {}));
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    const totalSales = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalQuantity = salesData.reduce((sum, item) => sum + item.quantity, 0);
    const totalInventory = inventoryData.reduce((sum, item) => sum + item.currentStock, 0);
    const lowStockItems = inventoryData.filter(item => item.currentStock <= item.reorderLevel).length;
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const totalEmployees = employeeData.length;
    const totalSalaries = employeeData.reduce((sum, emp) => sum + emp.salary, 0);

    return {
      totalSales,
      totalQuantity,
      totalInventory,
      lowStockItems,
      totalExpenses,
      totalEmployees,
      totalSalaries,
      profitLoss: totalSales - totalExpenses - totalSalaries
    };
  };

  // Generate and download PDF report
  const generatePDFReport = async () => {
    if (!reportRef.current) return;

    toast.info('Generating PDF report...', { autoClose: false, toastId: 'generating-pdf' });

    try {
      // Wait for any state updates to propagate
      setTimeout(async () => {
        const reportElement = reportRef.current;
        const canvas = await html2canvas(reportElement, {
          scale: 1,
          useCORS: true,
          logging: false,
          backgroundColor: '#1f2937' // Match bg-gray-800
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`business-report-${new Date().toLocaleDateString()}.pdf`);

        toast.dismiss('generating-pdf');
        toast.success('Report downloaded successfully!');
      }, 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss('generating-pdf');
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setIsCustomDate(false);
  };

  // Handle custom date range
  const toggleCustomDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const applyCustomDateRange = () => {
    setIsCustomDate(true);
    setDateRange('custom');
    setIsDatePickerOpen(false);
    toast.info(`Showing data from ${customDateRange.startDate.toLocaleDateString()} to ${customDateRange.endDate.toLocaleDateString()}`);
  };

  // Get summary statistics
  const stats = getSummaryStats();

  return (
    <div
      className="max-w-full p-4 text-white bg-gray-800 shadow-xl md:p-6 rounded-xl"
    >
      <div ref={reportRef}>
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold md:text-3xl">Business Analytics & Reports</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="p-2 text-white bg-gray-700 border border-gray-600 rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                {isCustomDate && <option value="custom">Custom Range</option>}
              </select>
            </div>

            <button
              onClick={toggleCustomDatePicker}
              className="flex items-center gap-2 p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Calendar size={16} />
              <span>Custom Date</span>
            </button>

            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>

            <button
              onClick={generatePDFReport}
              className="flex items-center gap-2 p-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Download size={16} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Custom Date Picker Dropdown */}
        {isDatePickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 p-4 bg-gray-700 rounded-lg shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Start Date</label>
                  <DatePicker
                    selected={customDateRange.startDate}
                    onChange={(date) => setCustomDateRange({ ...customDateRange, startDate: date })}
                    className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-lg"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">End Date</label>
                  <DatePicker
                    selected={customDateRange.endDate}
                    onChange={(date) => setCustomDateRange({ ...customDateRange, endDate: date })}
                    className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-lg"
                    dateFormat="dd/MM/yyyy"
                    minDate={customDateRange.startDate}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="px-3 py-1 text-gray-300 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCustomDateRange}
                  className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-blue-400">Loading data...</div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {/* Sales Card */}
              <div className="p-5 transition-shadow shadow-lg bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200">Total Sales</p>
                    <h3 className="text-2xl font-bold text-white">₹{stats.totalSales.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <DollarSign size={24} className="text-blue-200" />
                  </div>
                </div>
                <div className="mt-3 text-blue-200">
                  <span className="flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    {stats.totalQuantity.toFixed(2)} Liters sold
                  </span>
                </div>
              </div>

              {/* Inventory Card */}
              <div className="p-5 transition-shadow shadow-lg bg-gradient-to-r from-green-900 to-green-700 rounded-xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200">Inventory Status</p>
                    <h3 className="text-2xl font-bold text-white">{stats.totalInventory.toLocaleString()} Units</h3>
                  </div>
                  <div className="p-3 bg-green-800 rounded-lg">
                    <Package size={24} className="text-green-200" />
                  </div>
                </div>
                <div className="mt-3 text-green-200">
                  <span className="flex items-center">
                    <Zap size={16} className="mr-1" />
                    {stats.lowStockItems} items need reordering
                  </span>
                </div>
              </div>

              {/* Expenses Card */}
              <div className="p-5 transition-shadow shadow-lg bg-gradient-to-r from-red-900 to-red-700 rounded-xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200">Total Expenses</p>
                    <h3 className="text-2xl font-bold text-white">₹{stats.totalExpenses.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-red-800 rounded-lg">
                    <DollarSign size={24} className="text-red-200" />
                  </div>
                </div>
                <div className="mt-3 text-red-200">
                  <span className="flex items-center">
                    <RefreshCw size={16} className="mr-1" />
                    {expenseData.length} expense records
                  </span>
                </div>
              </div>

              {/* Profit/Loss Card */}
              <div className="p-5 transition-shadow shadow-lg bg-gradient-to-r from-purple-900 to-purple-700 rounded-xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200">Net Profit/Loss</p>
                    <h3 className="text-2xl font-bold text-white">₹{stats.profitLoss.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-purple-800 rounded-lg">
                    <BarChart2 size={24} className="text-purple-200" />
                  </div>
                </div>
                <div className="mt-3 text-purple-200">
                  <span className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {stats.totalEmployees} employees (₹{stats.totalSalaries.toLocaleString()})
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <div className="space-y-6">
              {/* Sales Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-5 bg-gray-700 shadow-lg rounded-xl"
              >
                <h2 className="mb-4 text-xl font-semibold">Sales Analysis</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Sales by Product Bar Chart */}
                  <div className="p-4 bg-gray-800 rounded-lg h-72 md:h-80">
                    <h3 className="mb-3 text-lg font-medium text-gray-300">Sales by Product</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="product" stroke="#CCC" />
                        <YAxis stroke="#CCC" />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue (₹)" fill="#0088FE" />
                        <Bar dataKey="quantity" name="Quantity (L)" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sales Trend Line Chart */}
                  <div className="p-4 bg-gray-800 rounded-lg h-72 md:h-80">
                    <h3 className="mb-3 text-lg font-medium text-gray-300">Sales Trend</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={salesData.map((item, index) => ({
                        name: item.product,
                        sales: item.revenue,
                        units: item.quantity
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#CCC" />
                        <YAxis stroke="#CCC" />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" name="Sales (₹)" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="units" name="Units" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* Expense Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-5 bg-gray-700 shadow-lg rounded-xl"
              >
                <h2 className="mb-4 text-xl font-semibold">Expense Analysis</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Expense Categories Pie Chart */}
                  <div className="p-4 bg-gray-800 rounded-lg h-72 md:h-80">
                    <h3 className="mb-3 text-lg font-medium text-gray-300">Expense Distribution</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                          nameKey="category"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                          contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Expense vs Income */}
                  <div className="p-4 bg-gray-800 rounded-lg h-72 md:h-80">
                    <h3 className="mb-3 text-lg font-medium text-gray-300">Expense vs Income</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={[
                        { name: 'Overall', income: stats.totalSales, expense: stats.totalExpenses + stats.totalSalaries }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#CCC" />
                        <YAxis stroke="#CCC" />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="income" name="Income (₹)" fill="#82ca9d" />
                        <Bar dataKey="expense" name="Expense (₹)" fill="#ff7675" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* Inventory Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-5 bg-gray-700 shadow-lg rounded-xl"
              >
                <h2 className="mb-4 text-xl font-semibold">Inventory Status</h2>
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-white border-collapse shadow-md">
                    <thead>
                      <tr className="text-gray-300 bg-gray-600">
                        <th className="p-3 text-left">Item</th>
                        <th className="p-3 text-left">Current Stock</th>
                        <th className="p-3 text-left">Reorder Level</th>
                        <th className="p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.map((item) => (
                        <tr key={item._id} className="transition-colors border-b border-gray-500 hover:bg-gray-900">
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.currentStock}</td>
                          <td className="p-3">{item.reorderLevel}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${item.currentStock <= item.reorderLevel
                                  ? 'bg-red-900 text-red-200'
                                  : 'bg-green-900 text-green-200'
                                }`}
                            >
                              {item.currentStock <= item.reorderLevel ? 'Low Stock' : 'Sufficient'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* React Toastify Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Reports;