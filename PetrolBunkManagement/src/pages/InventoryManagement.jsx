// src/pages/InventoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Download, Filter, X, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const InventoryManagement = () => {
  // State management
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // New inventory item form state
  const [newItem, setNewItem] = useState({
    name: '',
    currentStock: '',
    reorderLevel: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Filter state
  const [filters, setFilters] = useState({
    name: '',
    stockMin: '',
    stockMax: '',
    reorderMin: '',
    reorderMax: '',
    dateFrom: '',
    dateTo: '',
  });

  // Fetch inventory from API
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      setInventory(response.data);
      setFilteredInventory(response.data);
    } catch (err) {
      setError('Failed to fetch inventory. Please try again.');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInventory();
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
      if (filters.name) params.append('name', filters.name);
      if (filters.stockMin) params.append('stockMin', filters.stockMin);
      if (filters.stockMax) params.append('stockMax', filters.stockMax);
      if (filters.reorderMin) params.append('reorderMin', filters.reorderMin);
      if (filters.reorderMax) params.append('reorderMax', filters.reorderMax);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await axios.get(`http://localhost:5000/api/inventory?${params}`);
      setFilteredInventory(response.data);
    } catch (err) {
      setError('Failed to filter inventory. Please try again.');
      console.error('Error filtering inventory:', err);
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      name: '',
      stockMin: '',
      stockMax: '',
      reorderMin: '',
      reorderMax: '',
      dateFrom: '',
      dateTo: '',
    });
    setFilteredInventory(inventory);
    setShowFilters(false);
  };

  // Handle form input changes for new/edit item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal && currentItem) {
      setCurrentItem({ ...currentItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  // Add new inventory item
  const addInventoryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/inventory', newItem);
      setInventory([...inventory, response.data]);
      setFilteredInventory([...filteredInventory, response.data]);
      setNewItem({
        name: '',
        currentStock: '',
        reorderLevel: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddModal(false);
      setSuccessMessage('Inventory item added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to add inventory item. Please try again.');
      console.error('Error adding inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit inventory item
  const editInventoryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/inventory/${currentItem._id}`, currentItem);
      const updatedInventory = inventory.map(item => 
        item._id === currentItem._id ? response.data : item
      );
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      setShowEditModal(false);
      setSuccessMessage('Inventory item updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update inventory item. Please try again.');
      console.error('Error updating inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory item
  const deleteInventoryItem = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${currentItem._id}`);
      const updatedInventory = inventory.filter(item => item._id !== currentItem._id);
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      setShowDeleteModal(false);
      setSuccessMessage('Inventory item deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete inventory item. Please try again.');
      console.error('Error deleting inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Export inventory data to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Current Stock', 'Reorder Level', 'Date'];
    const csvData = filteredInventory.map(item => [
      item.name,
      item.currentStock,
      item.reorderLevel,
      new Date(item.date).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventory.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            <Filter size={16} className="mr-1" />
            Filter
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center px-3 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            <Download size={16} className="mr-1" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <Plus size={16} className="mr-1" />
            Add Item
          </button>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 mb-4 text-green-700 bg-green-100 rounded"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 mb-4 text-red-700 bg-red-100 rounded"
          >
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 mb-6 rounded shadow bg-gray-50"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Stock</label>
                  <input
                    type="number"
                    name="stockMin"
                    value={filters.stockMin}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Stock</label>
                  <input
                    type="number"
                    name="stockMax"
                    value={filters.stockMax}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Reorder Level</label>
                  <input
                    type="number"
                    name="reorderMin"
                    value={filters.reorderMin}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Reorder Level</label>
                  <input
                    type="number"
                    name="reorderMax"
                    value={filters.reorderMax}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">From Date</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">To Date</label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Item Name</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Current Stock</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Reorder Level</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw size={20} className="mr-2 animate-spin" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No inventory items found. Add a new item to get started.
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.currentStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.reorderLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.currentStock <= item.reorderLevel ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle size={12} className="mr-1" />
                        Reorder
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
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

      {/* Add Inventory Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Add New Inventory Item</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={addInventoryItem}>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Current Stock</label>
                  <input
                    type="number"
                    name="currentStock"
                    value={newItem.currentStock}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Reorder Level</label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={newItem.reorderLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newItem.date}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {loading && <RefreshCw size={16} className="mr-2 animate-spin" />}
                    Add Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Inventory Item Modal */}
      <AnimatePresence>
        {showEditModal && currentItem && (
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Edit Inventory Item</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={editInventoryItem}>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentItem.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Current Stock</label>
                  <input
                    type="number"
                    name="currentStock"
                    value={currentItem.currentStock}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Reorder Level</label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={currentItem.reorderLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={currentItem.date ? currentItem.date.split('T')[0] : ''}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {loading && <RefreshCw size={16} className="mr-2 animate-spin" />}
                    Update Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && currentItem && (
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Delete Inventory Item</h2>
                <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <p className="mb-6">
                Are you sure you want to delete {currentItem.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteInventoryItem}
                  disabled={loading}
                  className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  {loading && <RefreshCw size={16} className="mr-2 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryManagement;