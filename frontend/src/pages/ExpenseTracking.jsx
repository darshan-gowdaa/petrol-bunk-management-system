// PetrolBunkManagement/src/pages/ExpenseTracking.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle, Package, TrendingUp } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderWithActions from "../components/HeaderWithActions";
import Table from "../PagesModals/Tables";
import StatsCard from "../PagesModals/StatsCard";
import AddModalForm from "../PagesModals/AddModalForm";
import EditModalForm from "../PagesModals/EditModalForm";
import DeleteRow from "../PagesModals/DeleteRow";
import Filters from "../PagesModals/Filters";
import { exportToCSV } from "../utils/ExportToCSV";

const ExpenseTracking = () => {
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
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Form states
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
  });

  const [filters, setFilters] = useState({
    category: "All",
    amountMin: "",
    amountMax: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch expenses and extract categories
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(response.data);
      setFilteredExpenses(response.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.data.map((exp) => exp.category)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      toast.error("Failed to fetch expenses");
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Category management
  const addNewCategory = () => {
    if (newCategory.trim() === "") {
      toast.error("Category name cannot be empty");
      return;
    }
    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }
    setCategories((prev) => [...prev, newCategory.trim()]);

    // If we're in edit mode, update the currentExpense with the new category
    if (showEditModal && currentExpense) {
      setCurrentExpense((prev) => ({ ...prev, category: newCategory.trim() }));
    } else {
      // If we're in add mode, update the newExpense with the new category
      setNewExpense((prev) => ({ ...prev, category: newCategory.trim() }));
    }

    setNewCategory("");
    setShowNewCategoryInput(false);
    toast.success("New category added successfully");
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal && currentExpense) {
      setCurrentExpense((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewExpense((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setShowNewCategoryInput(true);
    } else {
      if (showEditModal && currentExpense) {
        setCurrentExpense((prev) => ({ ...prev, category: value }));
      } else {
        setNewExpense((prev) => ({ ...prev, category: value }));
      }
    }
  };

  // Expense CRUD operations
  const addExpense = async (e) => {
    e.preventDefault();
    if (showNewCategoryInput) {
      toast.error("Please add the new category first");
      return;
    }

    setLoading(true);
    try {
      const expenseToAdd = {
        category: newExpense.category,
        amount: newExpense.amount,
        date: newExpense.date,
      };

      const response = await axios.post("/api/expenses", expenseToAdd);
      setExpenses((prev) => [...prev, response.data]);
      setFilteredExpenses((prev) => [...prev, response.data]);
      setNewExpense({
        category: "",
        amount: "",
        date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
      });
      setShowAddModal(false);
      toast.success("Expense added successfully");
    } catch (err) {
      toast.error("Failed to add expense");
      console.error("Error adding expense:", err);
    } finally {
      setLoading(false);
    }
  };

  const editExpense = async (e) => {
    e.preventDefault();
    if (showNewCategoryInput) {
      toast.error("Please add the new category first");
      return;
    }

    setLoading(true);
    try {
      const expenseToUpdate = {
        category: currentExpense.category,
        amount: currentExpense.amount,
        date: currentExpense.date,
      };

      const response = await axios.put(
        `/api/expenses/${currentExpense._id}`,
        expenseToUpdate
      );
      setExpenses((prev) =>
        prev.map((exp) =>
          exp._id === currentExpense._id ? response.data : exp
        )
      );
      setFilteredExpenses((prev) =>
        prev.map((exp) =>
          exp._id === currentExpense._id ? response.data : exp
        )
      );
      setShowEditModal(false);
      toast.success("Expense updated successfully");
    } catch (err) {
      toast.error("Failed to update expense");
      console.error("Error updating expense:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/expenses/${currentExpense._id}`);
      setExpenses((prev) =>
        prev.filter((exp) => exp._id !== currentExpense._id)
      );
      setFilteredExpenses((prev) =>
        prev.filter((exp) => exp._id !== currentExpense._id)
      );
      setShowDeleteModal(false);
      toast.success("Expense deleted successfully");
    } catch (err) {
      toast.error("Failed to delete expense");
      console.error("Error deleting expense:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const applyFilters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "All") params.append(key, value);
      });

      const response = await axios.get(`/api/expenses?${params}`);
      setFilteredExpenses(response.data);
      toast.success("Filters applied successfully");
    } catch (err) {
      toast.error("Failed to filter expenses");
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

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
    toast.info("Filters reset");
  };

  // Export functionality
  const handleExport = () => {
    const headers = [
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount" },
      { key: "date", label: "Date" },
    ];
    exportToCSV(filteredExpenses, headers, "expenses");
  };

  // Handle removing a filter
  const handleRemoveFilter = (key) => {
    const newFilters = { ...filters };
    
    // Handle range filters
    if (key.endsWith('Min') || key.endsWith('Max')) {
      const baseKey = key.slice(0, -3); // Remove 'Min' or 'Max'
      delete newFilters[`${baseKey}Min`];
      delete newFilters[`${baseKey}Max`];
    } else {
      // Handle regular filters
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    
    // Build query params with the new filters
    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== "All") params.append("category", newFilters.category);
    if (newFilters.amountMin) params.append("amountMin", newFilters.amountMin);
    if (newFilters.amountMax) params.append("amountMax", newFilters.amountMax);
    if (newFilters.dateFrom) params.append("dateFrom", newFilters.dateFrom);
    if (newFilters.dateTo) params.append("dateTo", newFilters.dateTo);

    // If no filters are active, show all expenses
    if (params.toString() === '') {
      setFilteredExpenses(expenses);
    } else {
      // Apply the remaining filters
      axios.get(`/api/expenses?${params}`)
        .then(response => {
          setFilteredExpenses(response.data);
        })
        .catch(err => {
          toast.error("Failed to update filters. Please try again.");
          console.error("Error updating filters:", err);
        });
    }
  };

  // Stats calculation
  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const averageAmount = totalAmount / filteredExpenses.length || 0;

  return (
    <div className="flex flex-col min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="container flex flex-col w-full max-w-7xl p-6 mx-auto">
        <HeaderWithActions
          title="Expense Tracking"
          onAdd={() => setShowAddModal(true)}
          onFilter={() => setShowFilters(!showFilters)}
          onExport={handleExport}
          addLabel="Add Expense"
        />

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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <StatsCard
            title="Total Expenses"
            value={`₹${totalAmount.toLocaleString()}`}
            icon={Package}
            color="indigo"
            footer={`Total expenditure`}
          />
          <StatsCard
            title="Total Entries"
            value={filteredExpenses.length}
            icon={CheckCircle}
            color="green"
            footer={`Number of transactions`}
          />
          <StatsCard
            title="Average Expense"
            value={`₹${averageAmount.toFixed(2)}`}
            icon={TrendingUp}
            color="blue"
            footer={`Per transaction`}
          />
        </div>

        {/* Table */}
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
              render: (value) => new Date(value).toLocaleDateString('en-GB'),
            },
          ]}
          data={filteredExpenses}
          loading={loading}
          onEdit={(exp) => {
            setCurrentExpense(exp);
            setShowEditModal(true);
          }}
          onDelete={(exp) => {
            setCurrentExpense(exp);
            setShowDeleteModal(true);
          }}
          activeFilters={filters}
          onRemoveFilter={handleRemoveFilter}
        />

        {/* Modals */}
        <AddModalForm
          show={showAddModal}
          title="Add New Expense"
          fields={[
            {
              name: "category",
              label: "Category",
              type: "select",
              options: [...categories, "add_new"],
            },
            {
              name: "amount",
              label: "Amount (₹)",
              type: "number",
              min: 0,
              step: 0.01,
            },
            { name: "date", label: "Date", type: "date" },
          ]}
          formData={newExpense}
          onChange={handleInputChange}
          onSubmit={addExpense}
          onCancel={() => {
            setShowAddModal(false);
            setShowNewCategoryInput(false);
            setNewCategory("");
          }}
          categories={categories}
          addNewCategory={addNewCategory}
          newCategory={newCategory}
          handleNewCategoryChange={(e) => setNewCategory(e.target.value)}
          showNewCategoryInput={showNewCategoryInput}
          setShowNewCategoryInput={setShowNewCategoryInput}
          handleCategorySelect={handleCategorySelect}
          loading={loading}
        />

        <EditModalForm
          showEditModal={showEditModal}
          currentData={currentExpense}
          setShowEditModal={(val) => {
            setShowEditModal(val);
            if (!val) {
              setShowNewCategoryInput(false);
              setNewCategory("");
            }
          }}
          handleInputChange={handleInputChange}
          loading={loading}
          editFunction={editExpense}
          entityType="Expense"
          categories={categories}
          addNewCategory={addNewCategory}
          newCategory={newCategory}
          handleNewCategoryChange={(e) => setNewCategory(e.target.value)}
          showNewCategoryInput={showNewCategoryInput}
          setShowNewCategoryInput={setShowNewCategoryInput}
          handleCategorySelect={handleCategorySelect}
        />

        <DeleteRow
          show={showDeleteModal}
          item={currentExpense}
          itemType="Expense"
          itemName={`${currentExpense?.category} expense (₹${currentExpense?.amount})`}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={deleteExpense}
          loading={loading}
        />

        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          handleFilterChange={(e) =>
            setFilters({ ...filters, [e.target.name]: e.target.value })
          }
          resetFilters={resetFilters}
          applyFilters={applyFilters}
          fields={[
            {
              name: "category",
              label: "Category",
              type: "select",
              options: ["All", ...categories],
            },
            { name: "amountMin", label: "Min Amount", type: "number" },
            { name: "amountMax", label: "Max Amount", type: "number" },
            { name: "dateFrom", label: "From Date", type: "date" },
            { name: "dateTo", label: "To Date", type: "date" },
          ]}
          title="Filter Expenses"
        />
      </main>
    </div>
  );
};

export default ExpenseTracking;
