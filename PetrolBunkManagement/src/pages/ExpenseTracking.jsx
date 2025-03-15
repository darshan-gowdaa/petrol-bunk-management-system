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
import Table from "../PagesModals/Tables";
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
    "Miscellaneous"
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
                  <option key={category} value={category}>
                    {category}
                  </option>
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
                ₹
                {new Intl.NumberFormat("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(averageAmount)}
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
              <p className="text-3xl font-bold text-white">
                {new Intl.NumberFormat("en-IN").format(totalExpenses)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <Table
      columns={[
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", render: (value) => `₹${Number(value).toLocaleString()}` },
        { key: "date", label: "Date", render: (value) => new Date(value).toLocaleDateString() },
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
        <AddModalForm
          show={showAddModal}
          title="Add New Expense"
          fields={[
            { name: "category", label: "Category", type: "select" },
            {
              name: "amount",
              label: "Amount (₹)",
              type: "number",
              step: "0.01",
              min: "0",
            },
            { name: "date", label: "Date", type: "date" },
          ]}
          formData={newExpense}
          onChange={handleInputChange}
          onSubmit={addExpense}
          onCancel={() => setShowAddModal(false)}
          loading={loading}
          categories={categories}
          addNewCategory={addNewCategory}
          newCategory={newCategory}
          handleNewCategoryChange={handleNewCategoryChange}
          showNewCategoryInput={showNewCategoryInput}
          setShowNewCategoryInput={setShowNewCategoryInput}
        />
      )}

      {/* Edit Expense Modal */}
      <EditModalForm
        showEditModal={showEditModal}
        currentData={currentExpense}
        setShowEditModal={setShowEditModal}
        handleInputChange={handleInputChange}
        handleCategorySelect={handleCategorySelect}
        addNewCategory={addNewCategory}
        handleNewCategoryChange={handleNewCategoryChange}
        showNewCategoryInput={showNewCategoryInput}
        setShowNewCategoryInput={setShowNewCategoryInput}
        newCategory={newCategory}
        categories={categories}
        loading={loading}
        editFunction={editExpense}
        entityType="Expenses"
      />

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