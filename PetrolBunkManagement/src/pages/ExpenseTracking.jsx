import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  Package,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import HeaderWithActions from "../components/HeaderWithActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpenseTracking = () => {
  // Define categories array that was missing in the original code
  const categories = [
    "Electricity",
    "Water",
    "Maintenance",
    "Vehicle Fuel",
    "Office Supplies",
    "Miscellaneous"
  ];

  // State management
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    category: "Electricity",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Filter state
  const [filters, setFilters] = useState({
    category: "All",
    amountMin: "",
    amountMax: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (err) {
      toast.error("Failed to fetch expenses. Please try again.");
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
  const applyFilters = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.category !== "All") params.append("category", filters.category);
      if (filters.amountMin) params.append("amountMin", filters.amountMin);
      if (filters.amountMax) params.append("amountMax", filters.amountMax);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await axios.get(
        `http://localhost:5000/api/expenses?${params}`
      );
      setFilteredExpenses(response.data);
    } catch (err) {
      toast.error("Failed to filter expenses. Please try again.");
      console.error("Error filtering expenses:", err);
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "All",
      amountMin: "",
      amountMax: "",
      dateFrom: "",
      dateTo: "",
    });
    setFilteredExpenses(expenses);
    setShowFilters(false);
    toast.info("Filters have been reset");
  };

  // Handle form input changes for new/edit expense
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal && currentExpense) {
      setCurrentExpense({ ...currentExpense, [name]: value });
    } else {
      setNewExpense({ ...newExpense, [name]: value });
    }
  };

  // Add new expense
  const addExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/expenses",
        newExpense
      );
      setExpenses([...expenses, response.data]);
      setFilteredExpenses([...filteredExpenses, response.data]);
      setNewExpense({
        category: "Electricity",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
      toast.success("Expense added successfully!");
    } catch (err) {
      toast.error("Failed to add expense. Please try again.");
      console.error("Error adding expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit expense
  const editExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/expenses/${currentExpense._id}`,
        currentExpense
      );
      const updatedExpenses = expenses.map((expense) =>
        expense._id === currentExpense._id ? response.data : expense
      );
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setShowEditModal(false);
      toast.success("Expense updated successfully!");
    } catch (err) {
      toast.error("Failed to update expense. Please try again.");
      console.error("Error updating expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const deleteExpense = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/expenses/${currentExpense._id}`
      );
      const updatedExpenses = expenses.filter(
        (expense) => expense._id !== currentExpense._id
      );
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setShowDeleteModal(false);
      toast.success("Expense deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete expense. Please try again.");
      console.error("Error deleting expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export expenses data to CSV
  const exportToCSV = () => {
    const headers = ["Category", "Amount", "Date"];
    const csvData = filteredExpenses.map((expense) => [
      expense.category,
      expense.amount,
      new Date(expense.date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "expenses.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Expenses data exported to CSV");
  };

  // Calculate expense metrics
  const totalExpenses = filteredExpenses.length;
  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const averageAmount = totalAmount / totalExpenses || 0;

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <HeaderWithActions
        title="Expense Tracking"
        onAdd={() => setShowAddModal(true)}
        onFilter={() => setShowFilters(!showFilters)}
        onExport={exportToCSV}
        addLabel="Add Expense"
      />

      {/* Toast Container */}
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 mb-6 text-white bg-gray-800 rounded shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Min Amount</label>
                <input
                  type="number"
                  name="amountMin"
                  value={filters.amountMin}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Max Amount</label>
                <input
                  type="number"
                  name="amountMax"
                  value={filters.amountMax}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Interactive Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        {/* Total Expenses Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-indigo-300 bg-indigo-900 rounded-full">
              <Package size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-white">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Average Expense Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-blue-300 bg-blue-900 rounded-full">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Average Expense
              </p>
              <p className="text-3xl font-bold text-white">
                ₹{averageAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Entries Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-green-300 bg-green-900 rounded-full">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Total Entries
              </p>
              <p className="text-3xl font-bold text-white">{totalExpenses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  <div className="flex items-center justify-center">
                    <RefreshCw
                      size={20}
                      className="mr-2 text-gray-300 animate-spin"
                    />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  No expenses found. Add a new expense to get started.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    ₹{Number(expense.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentExpense(expense);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-300 bg-blue-900 rounded-full hover:bg-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentExpense(expense);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-300 bg-red-900 rounded-full hover:bg-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

  {showAddModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-white">Add New Expense</h2>
      <form onSubmit={addExpense}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">Category</label>
          <select
            name="category"
            value={newExpense.category}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            step="0.01"
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Saving...
              </span>
            ) : (
              "Add Expense"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Edit Expense Modal */}
      {showEditModal && currentItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-white">Edit Expense</h2>
      <form onSubmit={editExpense}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">Expense Name</label>
          <input
            type="text"
            name="name"
            value={currentItem.name}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">Amount</label>
          <input
            type="number"
            name="amount"
            value={currentItem.amount}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">Category</label>
          <input
            type="text"
            name="category"
            value={currentItem.category}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={currentItem.date ? currentItem.date.split("T")[0] : ""}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Expense"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentExpense && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 text-white bg-gray-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Delete Expense</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this {currentExpense.category} expense of ₹{currentExpense.amount}? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteExpense}
                disabled={loading}
                className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                {loading && (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracking;