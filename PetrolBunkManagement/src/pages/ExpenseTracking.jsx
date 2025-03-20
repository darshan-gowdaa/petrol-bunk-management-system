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
import Filters from "../PagesModals/Filters";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../PagesModals/Tables";
import StatsCard from "../PagesModals/StatsCard";
import { exportToCSV } from "../utils/ExportToCSV";
import AddModalForm from "../PagesModals/AddModalForm";
import EditModalForm from "../PagesModals/EditModalForm";
import DeleteRow from "../PagesModals/DeleteRow";

const ExpenseTracking = () => {
  // Initial categories list
  const [categories, setCategories] = useState([
    "Electricity",
    "Water",
    "Maintenance",
    "Vehicle Fuel",
    "Office Supplies",
    "Miscellaneous",
  ]);

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
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

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
      if (filters.category !== "All")
        params.append("category", filters.category);
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

  // Handle new category input change
  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Add a new category
  const addNewCategory = () => {
    if (newCategory.trim() === "") {
      toast.error("Category name cannot be empty");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast.error("This category already exists");
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);

    // Set the newly added category as the selected one
    if (showEditModal && currentExpense) {
      setCurrentExpense({ ...currentExpense, category: newCategory.trim() });
    } else {
      setNewExpense({ ...newExpense, category: newCategory.trim() });
    }

    setNewCategory("");
    setShowNewCategoryInput(false);
    toast.success("New category added!");
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    const value = e.target.value;

    if (value === "add_new") {
      setShowNewCategoryInput(true);
    } else {
      if (showEditModal && currentExpense) {
        setCurrentExpense({ ...currentExpense, category: value });
      } else {
        setNewExpense({ ...newExpense, category: value });
      }
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
  const handleExportExpenses = () => {
    const headers = [
      { key: 'category', label: 'Category' },
      { key: 'amount', label: 'Amount' },
      { key: 'date', label: 'Date' }
    ]; 
    exportToCSV(filteredExpenses, headers, 'expenses');
  };

  // Calculate expense metrics
  const totalExpenses = filteredExpenses.length;
  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const averageAmount = totalAmount / totalExpenses || 0;

  return (
    <div className="container px-4 py-8 mx-auto transition-all duration-300 animate-fadeIn">
      {/* Header */}
      <HeaderWithActions
        title="Expense Tracking"
        onAdd={() => setShowAddModal(true)}
        onFilter={() => setShowFilters(!showFilters)}
        onExport={handleExportExpenses}
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
      <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        fields={categories}
        title="Filter Finances"
      />

      {/* Interactive Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
      <StatsCard
          icon={<CheckCircle size={24} />}
          iconBgColor="bg-green-900"
          iconColor="text-green-300"
          title="Total Entries"
          value={new Intl.NumberFormat("en-IN").format(totalExpenses)}
        />
        
        <StatsCard
          icon={<Package size={24} />}
          iconBgColor="bg-indigo-900"
          iconColor="text-indigo-300"
          title="Total Expenses"
          value={totalAmount.toLocaleString()}
          prefix="₹"
        />

        <StatsCard
          icon={<CheckCircle size={24} />}
          iconBgColor="bg-blue-900"
          iconColor="text-blue-300"
          title="Average Expense"
          value={new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(averageAmount)}
          prefix="₹"
        />
      </div>

      {/* Expenses Table */}
      <Table
        columns={[
          { key: "category", label: "Category" },
          {
            key: "amount",
            label: "Amount",
            render: (value) => `₹${Number(value).toLocaleString()}`,
          },
          {
            key: "date",
            label: "Date",
            render: (value) => new Date(value).toLocaleDateString(),
          },
        ]}
        data={filteredExpenses}
        loading={loading}
        onEdit={(expense) => {
          setCurrentExpense(expense);
          setShowEditModal(true);
          setShowNewCategoryInput(false);
        }}
        onDelete={(expense) => {
          setCurrentExpense(expense);
          setShowDeleteModal(true);
        }}
      />

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">
              Add New Expense
            </h2>
            <form onSubmit={addExpense}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Category
                </label>
                {!showNewCategoryInput ? (
                  <select
                    name="category"
                    value={newExpense.category}
                    onChange={handleCategorySelect}
                    className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="add_new">+ Add New Category</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={handleNewCategoryChange}
                      placeholder="Enter new category name"
                      className="flex-1 p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addNewCategory}
                      className="p-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(false)}
                      className="p-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Amount (₹)
                </label>
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
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Date
                </label>
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
                  disabled={loading || showNewCategoryInput}
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
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-full max-w-3xl overflow-hidden bg-gray-900 rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-medium text-white">Filter Options</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-300">
                    Amount Range
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400">
                        Minimum
                      </label>
                      <input
                        type="number"
                        name="amountMin"
                        value={filters.amountMin}
                        onChange={handleFilterChange}
                        className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Maximum
                      </label>
                      <input
                        type="number"
                        name="amountMax"
                        value={filters.amountMax}
                        onChange={handleFilterChange}
                        className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 bg-gray-800 border-t border-gray-700">
              <button
                onClick={resetFilters}
                className="px-4 py-2 mr-2 text-white transition-colors bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  setShowFilters(false);
                }}
                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteRow
        show={showDeleteModal}
        item={currentExpense}
        itemType="Expense"
        itemName={`${currentExpense?.category} expense of ₹${currentExpense?.amount}`}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={deleteExpense}
        loading={loading}
      />
    </div>
  );
};

export default ExpenseTracking;
