import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Plus, X, Edit, Trash2 } from 'lucide-react';

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: 'Electricity',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [categories, setCategories] = useState(['Electricity', 'Water', 'Maintenance', 'Vehicle Fuel', 'Office Supplies', 'Miscellaneous']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  });
  
  const newCategoryInputRef = useRef(null);

  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  // Get all expenses
  const getExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      showAlert('Failed to fetch expenses.', 'error');
    }
  };

  // Add new expense
  const addExpense = async () => {
    if (!newExpense.amount || newExpense.amount <= 0) {
      showAlert('Please enter a valid amount!', 'error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/expenses', {
        ...newExpense,
        date: new Date(newExpense.date).toISOString(),
      });

      setExpenses((prev) => [...prev, response.data]);
      resetForm();
      showAlert('Expense added successfully!', 'added');
    } catch (error) {
      console.error('Error adding expense:', error);
      showAlert('Error adding expense. Please try again.', 'error');
    }
  };

  // Edit an existing expense
  const editExpense = async () => {
    if (!newExpense.amount || newExpense.amount <= 0) {
      showAlert('Please enter a valid amount!', 'error');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/expenses/${editingExpenseId}`, {
        ...newExpense,
        date: new Date(newExpense.date).toISOString(),
      });

      setExpenses((prev) =>
        prev.map((expense) => (expense._id === editingExpenseId ? response.data : expense))
      );
      
      resetForm();
      showAlert('Expense updated successfully!', 'edited');
    } catch (error) {
      console.error('Error updating expense:', error);
      showAlert('Error updating expense. Please try again.', 'error');
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    console.log(`Attempting to delete expense with ID: ${id}`);

    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      showAlert('Expense deleted successfully!', 'deleted');
    } catch (error) {
      console.error('Error deleting expense:', error);
      showAlert('Error deleting expense. Please try again.', 'error');
    }
  };

  // Reset form
  const resetForm = () => {
    setNewExpense({
      category: 'Electricity',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingExpenseId(null);
  };

  // Show alert with fade effect
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000); // Hide alert after 3 seconds
  };

  // Handle edit button click
  const handleEditClick = (expense) => {
    setEditingExpenseId(expense._id);
    setNewExpense({
      category: expense.category,
      amount: expense.amount,
      date: expense.date.split('T')[0],
    });
  };

  // Format date for display (YYYY-MM-DD)
  const formatDateForDisplay = (dateString) => {
    return dateString.split('T')[0];
  };

  // Add new category
  const addNewCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewExpense({ ...newExpense, category: newCategory.trim() });
      setNewCategory('');
      setIsAddingCategory(false);
      showAlert('New category added!', 'added');
    } else if (categories.includes(newCategory.trim())) {
      showAlert('Category already exists!', 'error');
    }
  };

  // Handle category input key press
  const handleCategoryKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNewCategory();
    }
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...expenses];

    // Filter by category
    if (filters.category !== 'All') {
      result = result.filter(expense => expense.category === filters.category);
    }

    // Filter by date range
    if (filters.dateFrom) {
      result = result.filter(expense => new Date(expense.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter(expense => new Date(expense.date) <= new Date(`${filters.dateTo}T23:59:59`));
    }

    // Filter by amount range
    if (filters.amountMin) {
      result = result.filter(expense => expense.amount >= parseFloat(filters.amountMin));
    }
    if (filters.amountMax) {
      result = result.filter(expense => expense.amount <= parseFloat(filters.amountMax));
    }

    setFilteredExpenses(result);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: 'All',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
    });
    setFilteredExpenses(expenses);
    setIsFilterModalOpen(false);
  };

  // Export expenses to CSV
  const exportToCSV = () => {
    // Prepare data
    const headers = ['Category', 'Amount', 'Date'];
    const dataRows = filteredExpenses.map(expense => [
      expense.category,
      expense.amount,
      formatDateForDisplay(expense.date)
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...dataRows.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Expense_Report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Expenses downloaded successfully!', 'added');
  };

  // Toggle category input
  const toggleCategoryInput = () => {
    setIsAddingCategory(!isAddingCategory);
    if (!isAddingCategory) {
      setTimeout(() => {
        newCategoryInputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl p-6 mx-auto rounded-lg shadow-xl bg-gradient-to-br from-gray-900 to-gray-800"
    >
      {/* Alert message */}
      {alertVisible && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed z-50 p-4 text-center text-white transition-opacity transform -translate-x-1/2 bg-yellow-500 rounded-lg shadow-lg bottom-4 left-1/2"
        >
          {alertMessage}
        </motion.div>
      )}
      
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center mb-6 text-3xl font-bold text-white"
      >
        <span className="mr-2">💰</span> Expense Tracking
      </motion.h1>

      {/* Expense Summary */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 mb-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">Expense Summary</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="p-4 border border-gray-600 rounded-lg shadow-md bg-gradient-to-r from-gray-800 to-gray-700"
          >
            <h3 className="text-gray-400">Total Expenses</h3>
            <p className="text-2xl font-bold text-green-400">
              ₹{filteredExpenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString()}
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="p-4 border border-gray-600 rounded-lg shadow-md bg-gradient-to-r from-gray-800 to-gray-700"
          >
            <h3 className="text-gray-400">Average Expense</h3>
            <p className="text-2xl font-bold text-blue-400">
              ₹{(filteredExpenses.reduce((total, expense) => total + expense.amount, 0) / filteredExpenses.length || 0).toFixed(2)}
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="p-4 border border-gray-600 rounded-lg shadow-md bg-gradient-to-r from-gray-800 to-gray-700"
          >
            <h3 className="text-gray-400">Total Entries</h3>
            <p className="text-2xl font-bold text-purple-400">
              {filteredExpenses.length}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
        >
          <Filter size={16} /> Filter Expenses
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
        >
          <Download size={16} /> Download CSV
        </motion.button>
      </motion.div>

      {/* Form for adding or editing expense */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-5 mb-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          {editingExpenseId ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            {isAddingCategory ? (
              <div className="flex">
                <input
                  ref={newCategoryInputRef}
                  type="text"
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleCategoryKeyPress}
                  className="w-full p-3 text-white bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addNewCategory}
                  className="px-3 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <div className="flex">
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full p-3 text-white bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleCategoryInput}
                  className="px-3 text-white bg-gray-600 rounded-r-lg hover:bg-gray-500"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
          
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
            className="p-3 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="p-3 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={editingExpenseId ? editExpense : addExpense}
            className={`p-3 font-bold text-white rounded-lg shadow-md ${
              editingExpenseId 
                ? 'bg-yellow-600 hover:bg-yellow-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {editingExpenseId ? 'Save Changes' : 'Add Expense'}
          </motion.button>
          
          {editingExpenseId && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={resetForm}
              className="p-3 font-bold text-white bg-gray-600 rounded-lg hover:bg-gray-700 md:col-start-4"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Expense Table */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="overflow-x-auto border border-gray-700 rounded-lg shadow-lg"
      >
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-700 to-gray-600">
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <motion.tr 
                    key={expense._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="p-3">{expense.category}</td>
                    <td className="p-3">₹{expense.amount.toLocaleString()}</td>
                    <td className="p-3">{formatDateForDisplay(expense.date)}</td>
                    <td className="p-3 text-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClick(expense)}
                        className="px-3 py-2 mr-2 text-sm font-bold text-gray-800 bg-yellow-400 rounded-lg shadow hover:bg-yellow-500"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteExpense(expense._id)}
                        className="px-3 py-2 text-sm font-bold text-white bg-red-600 rounded-lg shadow hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    No expenses found matching your filters
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
            onClick={() => setIsFilterModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-md p-6 bg-gray-800 border border-gray-700 shadow-2xl rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Filter Expenses</h2>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-400">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full p-2 text-white bg-gray-700 rounded-lg"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-gray-400">Date From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="w-full p-2 text-white bg-gray-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-400">Date To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="w-full p-2 text-white bg-gray-700 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-gray-400">Min Amount</label>
                    <input
                      type="number"
                      placeholder="₹0"
                      value={filters.amountMin}
                      onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                      className="w-full p-2 text-white bg-gray-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-400">Max Amount</label>
                    <input
                      type="number"
                      placeholder="₹9999999"
                      value={filters.amountMax}
                      onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                      className="w-full p-2 text-white bg-gray-700 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-500"
                  >
                    Reset Filters
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFilterModalOpen(false)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpenseTracking;
