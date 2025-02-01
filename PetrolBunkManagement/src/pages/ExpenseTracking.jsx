import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: 'Electricity',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date in YYYY-MM-DD format
  });
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    getExpenses();
  }, []);

  // Get all expenses
  const getExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data); // Keep the full date/time string from the backend
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
      // Send the full date/time string to the backend
      const response = await axios.post('http://localhost:5000/api/expenses', {
        ...newExpense,
        date: new Date(newExpense.date).toISOString(), // Convert to full date/time string
      });

      // Add the new expense to the state (keep the full date/time string)
      setExpenses([...expenses, response.data]);
      resetForm(); // Reset form after adding
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
      // Send the full date/time string to the backend
      const response = await axios.put(`http://localhost:5000/api/expenses/${editingExpenseId}`, {
        ...newExpense,
        date: new Date(newExpense.date).toISOString(), // Convert to full date/time string
      });

      // Update the expense in the state (keep the full date/time string)
      setExpenses(
        expenses.map((expense) =>
          expense._id === editingExpenseId ? response.data : expense
        )
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
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
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
      date: new Date().toISOString().split('T')[0], // Reset to today's date in YYYY-MM-DD format
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
      date: expense.date.split('T')[0], // Convert to YYYY-MM-DD for the form input
    });
  };

  // Format date for display (YYYY-MM-DD)
  const formatDateForDisplay = (dateString) => {
    return dateString.split('T')[0];
  };

  const categories = ['Electricity', 'Water', 'Maintenance', 'Vehicle Fuel', 'Office Supplies', 'Miscellaneous'];

  return (
    <div className="p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-white">Expense Tracking</h1>

      {/* Alert message */}
      {alertVisible && (
        <div className="fixed z-50 p-4 text-center text-white transition-opacity transform -translate-x-1/2 bg-yellow-500 rounded-lg shadow-lg bottom-4 left-1/2">
          {alertMessage}
        </div>
      )}

      {/* Expense Summary */}
      <div className="p-6 mb-6 bg-gray-900 rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-white">Expense Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-gray-400">Total Expenses</h3>
            <p className="text-2xl font-bold text-green-400">
              ₹{expenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-gray-400">Average Expense</h3>
            <p className="text-2xl font-bold text-blue-400">
              ₹{(expenses.reduce((total, expense) => total + expense.amount, 0) / expenses.length || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Form for adding or editing expense */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          className="p-3 text-white bg-gray-700 rounded-lg"
        >
          {categories.map((category) => (
            <option key={category} value={category} className="text-black">
              {category}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
          className="p-3 text-white bg-gray-700 rounded-lg"
        />
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          className="p-3 text-white bg-gray-700 rounded-lg"
        />
        <button
          onClick={editingExpenseId ? editExpense : addExpense}
          className="p-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {editingExpenseId ? 'Save Changes' : 'Add Expense'}
        </button>
      </div>

      {/* Expense Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="text-gray-300 bg-gray-700">
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-3">{expense.category}</td>
                <td className="p-3">₹{expense.amount.toLocaleString()}</td>
                <td className="p-3">{formatDateForDisplay(expense.date)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEditClick(expense)}
                    className="px-3 py-2 mr-2 text-sm font-bold text-gray-800 bg-yellow-400 rounded-lg hover:bg-yellow-500"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="px-3 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTracking;
