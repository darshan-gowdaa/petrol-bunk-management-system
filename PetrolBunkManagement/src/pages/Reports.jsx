import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart,
  ComposedChart 
} from 'recharts';
import {
  Download, RefreshCw, DollarSign, Zap, TrendingUp,
  Package, Users, BarChart2, Calendar, ArrowUp, ArrowDown
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

const Reports = () => {
  // States consolidated
  const [data, setData] = useState({ sales: [], inventory: [], employees: [], expenses: [], salesTrend: [] });
  const [dateFilter, setDateFilter] = useState({
    range: 'all',
    isCustom: false,
    customRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date()
    },
    pickerOpen: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef(null);

  // Color palette
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchAllData();
  }, [dateFilter]);

  // Filter data helper
  const filterDataByDate = (data, dateField = 'date') => {
    if (dateFilter.isCustom) {
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= dateFilter.customRange.startDate && itemDate <= dateFilter.customRange.endDate;
      });
    }

    if (dateFilter.range === 'all') return data;

    const now = new Date();
    let startDate;

    const ranges = {
      today: () => { const d = new Date(now); d.setHours(0,0,0,0); return d; },
      week: () => { const d = new Date(now); d.setDate(now.getDate() - 7); return d; },
      month: () => { const d = new Date(now); d.setMonth(now.getMonth() - 1); return d; },
      quarter: () => { const d = new Date(now); d.setMonth(now.getMonth() - 3); return d; },
      year: () => { const d = new Date(now); d.setFullYear(now.getFullYear() - 1); return d; }
    };

    startDate = ranges[dateFilter.range] ? ranges[dateFilter.range]() : now;
    return data.filter(item => new Date(item[dateField]) >= startDate);
  };

  // Process data - reduced and streamlined
  const processData = (rawData) => {
    const filteredSales = filterDataByDate(rawData.sales);
    
    // Process sales by product
    const salesByProduct = Object.values(filteredSales.reduce((acc, sale) => {
      if (!acc[sale.product]) {
        acc[sale.product] = { product: sale.product, quantity: 0, revenue: 0, count: 0, avgPrice: 0 };
      }
      acc[sale.product].quantity += sale.quantity;
      acc[sale.product].revenue += sale.total;
      acc[sale.product].count += 1;
      acc[sale.product].avgPrice = acc[sale.product].revenue / acc[sale.product].quantity;
      return acc;
    }, {}));

    // Generate sales trend
    const salesTrend = Object.values(filteredSales.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, quantity: 0, transactions: 0 };
      }
      acc[date].revenue += sale.total;
      acc[date].quantity += sale.quantity;
      acc[date].transactions += 1;
      return acc;
    }, {}))
    .map(item => ({...item, avgTransactionValue: item.revenue / item.transactions}))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Process expenses
    const filteredExpenses = filterDataByDate(rawData.expenses);
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const expensesByCategory = Object.values(filteredExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { category: expense.category, amount: 0, count: 0 };
      }
      acc[expense.category].amount += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    }, {})).map(item => ({
      ...item,
      percentage: (item.amount / totalExpenses * 100).toFixed(1)
    }));

    return {
      sales: salesByProduct,
      inventory: rawData.inventory,
      employees: rawData.employees,
      expenses: expensesByCategory,
      salesTrend: salesTrend
    };
  };

  // Fetch data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const endpoints = ['sales', 'inventory', 'employees', 'expenses'];
      const responses = await Promise.all(
        endpoints.map(endpoint => axios.get(`http://localhost:5000/api/${endpoint}`))
      );
      
      const rawData = endpoints.reduce((acc, endpoint, i) => {
        acc[endpoint] = responses[i].data;
        return acc;
      }, {});

      setData(processData(rawData));
      setIsLoading(false);
      toast.success('Data refreshed successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again.');
      setIsLoading(false);
    }
  };

  // Calculate summary statistics - simplified
  const getSummaryStats = () => {
    const totals = {
      sales: data.sales.reduce((sum, item) => sum + item.revenue, 0),
      quantity: data.sales.reduce((sum, item) => sum + item.quantity, 0),
      inventory: data.inventory.reduce((sum, item) => sum + item.currentStock, 0),
      expenses: data.expenses.reduce((sum, item) => sum + item.amount, 0),
      salaries: data.employees.reduce((sum, emp) => sum + emp.salary, 0),
      transactions: data.sales.reduce((sum, item) => sum + item.count, 0)
    };
    
    return {
      ...totals,
      lowStockItems: data.inventory.filter(item => item.currentStock <= item.reorderLevel).length,
      totalEmployees: data.employees.length,
      profitLoss: totals.sales - totals.expenses - totals.salaries,
      profitMargin: totals.sales > 0 ? ((totals.sales - totals.expenses - totals.salaries) / totals.sales * 100).toFixed(1) : 0,
      avgSaleValue: totals.transactions > 0 ? (totals.sales / totals.transactions).toFixed(2) : 0,
      inventoryTurnover: totals.inventory > 0 ? (totals.quantity / totals.inventory).toFixed(2) : 0
    };
  };

  // Generate PDF report - simplified
  const generatePDFReport = async () => {
    if (!reportRef.current) return;
    
    const toastId = toast.info('Generating PDF report...', { autoClose: false });
    
    try {
      setTimeout(async () => {
        const canvas = await html2canvas(reportRef.current, {
          scale: 1, useCORS: true, logging: false, backgroundColor: '#1f2937'
        });
        
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`business-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        
        toast.dismiss(toastId);
        toast.success('Report downloaded successfully!');
      }, 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Date filters
  const handleDateRangeChange = (range) => {
    setDateFilter(prev => ({...prev, range, isCustom: false}));
  };

  const applyCustomDateRange = () => {
    setDateFilter(prev => ({...prev, isCustom: true, range: 'custom', pickerOpen: false}));
    toast.info(`Showing data from ${dateFilter.customRange.startDate.toLocaleDateString()} to ${dateFilter.customRange.endDate.toLocaleDateString()}`);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="p-3 text-white bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
          <p className="mb-2 text-gray-300">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Reusable components
  const ChartContainer = ({ title, children, height = 80 }) => (
    <div className={`p-4 bg-gray-800 rounded-lg h-72 md:h-${height}`}>
      <h3 className="mb-3 text-lg font-medium text-gray-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">{children}</ResponsiveContainer>
    </div>
  );

  const SummaryCard = ({ title, value, icon: Icon, color, subValue1, subValue2 }) => (
    <div className={`p-5 transition-shadow shadow-lg bg-gradient-to-r from-${color}-900 to-${color}-700 rounded-xl hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-200`}>{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 bg-${color}-800 rounded-lg`}>
          <Icon size={24} className={`text-${color}-200`} />
        </div>
      </div>
      <div className={`mt-3 text-${color}-200`}>
        <div className="flex items-center justify-between">
          {subValue1}
          {subValue2}
        </div>
      </div>
    </div>
  );

  const stats = getSummaryStats();

  return (
    <div className="max-w-full p-4 text-white transition-all duration-300 bg-gray-800 shadow-xl md:p-6 rounded-xl animate-fadeIn">
      <div ref={reportRef}>
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold md:text-3xl">Business Analytics & Reports</h1>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={dateFilter.range}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="p-2 text-white bg-gray-700 border border-gray-600 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              {dateFilter.isCustom && <option value="custom">Custom Range</option>}
            </select>
            <button
              onClick={() => setDateFilter(prev => ({...prev, pickerOpen: !prev.pickerOpen}))}
              className="flex items-center gap-2 p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Calendar size={16} /> <span>Custom Date</span>
            </button>
            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <RefreshCw size={16} /> <span>Refresh</span>
            </button>
            <button
              onClick={generatePDFReport}
              className="flex items-center gap-2 p-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Download size={16} /> <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Custom Date Picker */}
        {dateFilter.pickerOpen && (
          <div className="absolute z-20 p-4 bg-gray-700 rounded-lg shadow-xl">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Start Date</label>
                  <DatePicker
                    selected={dateFilter.customRange.startDate}
                    onChange={(date) => setDateFilter(prev => ({
                      ...prev, 
                      customRange: {...prev.customRange, startDate: date}
                    }))}
                    className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-lg"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">End Date</label>
                  <DatePicker
                    selected={dateFilter.customRange.endDate}
                    onChange={(date) => setDateFilter(prev => ({
                      ...prev, 
                      customRange: {...prev.customRange, endDate: date}
                    }))}
                    className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-lg"
                    dateFormat="dd/MM/yyyy"
                    minDate={dateFilter.customRange.startDate}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDateFilter(prev => ({...prev, pickerOpen: false}))}
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
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-blue-400">Loading data...</div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard 
                title="Total Sales" 
                value={`₹${stats.sales.toLocaleString()}`}
                icon={DollarSign}
                color="blue"
                subValue1={<span className="flex items-center"><TrendingUp size={16} className="mr-1" />{stats.quantity.toFixed(2)} Liters</span>}
                subValue2={<span className="flex items-center text-sm"><ArrowUp size={14} className="mr-1" />Avg ₹{stats.avgSaleValue}/sale</span>}
              />
              <SummaryCard 
                title="Inventory Status" 
                value={`${stats.inventory.toLocaleString()} Units`}
                icon={Package}
                color="green"
                subValue1={<span className="flex items-center"><Zap size={16} className="mr-1" />{stats.lowStockItems} needs reorder</span>}
                subValue2={<span className="flex items-center text-sm">Turnover: {stats.inventoryTurnover}x</span>}
              />
              <SummaryCard 
                title="Total Expenses" 
                value={`₹${stats.expenses.toLocaleString()}`}
                icon={DollarSign}
                color="red"
                subValue1={<span className="flex items-center"><RefreshCw size={16} className="mr-1" />{data.expenses.length} records</span>}
                subValue2={<span className="flex items-center text-sm"><ArrowDown size={14} className="mr-1" />Salaries: ₹{stats.salaries.toLocaleString()}</span>}
              />
              <SummaryCard 
                title="Net Profit/Loss" 
                value={`₹${stats.profitLoss.toLocaleString()}`}
                icon={BarChart2}
                color="purple"
                subValue1={<span className="flex items-center"><Users size={16} className="mr-1" />{stats.totalEmployees} employees</span>}
                subValue2={<span className="flex items-center text-sm">Margin: {stats.profitMargin}%</span>}
              />
            </div>

            {/* Charts Section - Condensed */}
            <div className="space-y-6">
              {/* Sales Analysis */}
              <div className="p-5 bg-gray-700 shadow-lg rounded-xl">
                <h2 className="mb-4 text-xl font-semibold">Sales Analysis</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <ChartContainer title="Sales by Product">
                    <ComposedChart data={data.sales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="product" stroke="#CCC" />
                      <YAxis yAxisId="left" stroke="#CCC" />
                      <YAxis yAxisId="right" orientation="right" stroke="#CCC" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="#3b82f6" />
                      <Bar yAxisId="left" dataKey="quantity" name="Quantity (L)" fill="#10b981" />
                      <Line yAxisId="right" type="monotone" dataKey="avgPrice" name="Avg Price (₹/L)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ChartContainer>

                  <ChartContainer title="Sales Trend">
                    <AreaChart data={data.salesTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#CCC" />
                      <YAxis stroke="#CCC" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="quantity" name="Quantity (L)" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="p-5 bg-gray-700 shadow-lg rounded-xl">
                <h2 className="mb-4 text-xl font-semibold">Advanced Analytics</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <ChartContainer title="Transaction Analysis">
                    <ComposedChart data={data.salesTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#CCC" />
                      <YAxis yAxisId="left" stroke="#CCC" />
                      <YAxis yAxisId="right" orientation="right" stroke="#CCC" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="transactions" name="Transactions" fill="#8b5cf6" />
                      <Line yAxisId="right" type="monotone" dataKey="avgTransactionValue" name="Avg Transaction (₹)" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ChartContainer>

                  <ChartContainer title="Expense vs Income">
                    <BarChart data={[
                      { name: 'Revenue', value: stats.sales, type: 'Income' },
                      { name: 'Expenses', value: stats.expenses, type: 'Expense' },
                      { name: 'Salaries', value: stats.salaries, type: 'Expense' },
                      { name: 'Profit', value: stats.profitLoss > 0 ? stats.profitLoss : 0, type: 'Income' },
                      { name: 'Loss', value: stats.profitLoss < 0 ? Math.abs(stats.profitLoss) : 0, type: 'Expense' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#CCC" />
                      <YAxis stroke="#CCC" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Amount (₹)" fill={(entry) => entry.type === 'Income' ? '#10b981' : '#ef4444'} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Expense Analysis */}
              <div className="p-5 bg-gray-700 shadow-lg rounded-xl">
                <h2 className="mb-4 text-xl font-semibold">Expense Analysis</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <ChartContainer title="Expense Distribution">
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {data.expenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                        contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                      />
                      <Legend />
                    </PieChart>
                  </ChartContainer>

                  <ChartContainer title="Expense Categories">
                    <BarChart
                      data={data.expenses.sort((a, b) => b.amount - a.amount)}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis type="number" stroke="#CCC" />
                      <YAxis dataKey="category" type="category" stroke="#CCC" width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="amount" name="Amount (₹)" fill="#ef4444" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Inventory Status */}
              <div className="p-5 bg-gray-700 shadow-lg rounded-xl">
                <h2 className="mb-4 text-xl font-semibold">Inventory Status</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 overflow-auto bg-gray-800 rounded-lg max-h-72">
                    <h3 className="mb-3 text-lg font-medium text-gray-300">Current Stock</h3>
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
                        {data.inventory.map((item) => {
                          const stockStatus = item.currentStock <= item.reorderLevel ? 
                              { class: 'bg-red-900 text-red-200', text: 'Low Stock' } :
                            item.currentStock <= item.reorderLevel * 1.5 ?
                              { class: 'bg-yellow-900 text-yellow-200', text: 'Medium Stock' } :
                              { class: 'bg-green-900 text-green-200', text: 'Sufficient' };
                              
                          return (
                            <tr key={item._id} className="transition-colors border-b border-gray-500 hover:bg-gray-900">
                              <td className="p-3">{item.name}</td>
                              <td className="p-3">{item.currentStock}</td>
                              <td className="p-3">{item.reorderLevel}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-sm ${stockStatus.class}`}>
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
                    <BarChart
                      data={data.inventory.map(item => ({
                        name: item.name,
                        stock: item.currentStock,
                        reorderLevel: item.reorderLevel,
                        buffer: Math.max(0, item.currentStock - item.reorderLevel)
                      }))}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      barGap={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#CCC" />
                      <YAxis stroke="#CCC" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="reorderLevel" name="Reorder Level" fill="#ef4444" />
                      <Bar dataKey="buffer" name="Buffer Stock" fill="#10b981" stackId="a" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Reports;