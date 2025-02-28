import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Filter, Download, Edit, Trash2, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    currentStock: '', 
    reorderLevel: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    stockStatus: 'all',
    dateRange: { start: '', end: '' }
  });

  useEffect(() => {
    getInventoryItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [inventory, filters]);

  // Get all inventory items
  const getInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      setInventory(response.data);
      setFilteredInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      showNotification('Failed to fetch inventory items.', 'error');
    }
  };

  // Add new inventory item
  const addInventoryItem = async () => {
    if (newItem.name && newItem.currentStock > 0 && newItem.reorderLevel > 0 && newItem.date) {
      try {
        const response = await axios.post('http://localhost:5000/api/inventory', newItem);
        setInventory([...inventory, response.data]);
        resetForm();
        showNotification('Item added successfully!', 'success');
      } catch (error) {
        console.error('Error adding inventory item:', error);
        showNotification('Failed to add item.', 'error');
      }
    } else {
      showNotification('Please fill all fields with valid data!', 'error');
    }
  };

  // Edit an existing inventory item
  const editInventoryItem = async () => {
    if (editingItemId && newItem.name && newItem.currentStock > 0 && newItem.reorderLevel > 0 && newItem.date) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/inventory/${editingItemId}`,
          newItem
        );
        setInventory(
          inventory.map((item) =>
            item._id === editingItemId ? response.data : item
          )
        );
        resetForm();
        showNotification('Item updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating inventory item:', error);
        showNotification('Failed to update item.', 'error');
      }
    } else {
      showNotification('Please fill all fields with valid data!', 'error');
    }
  };

  // Delete an inventory item
  const deleteInventoryItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setInventory(inventory.filter((item) => item._id !== id));
      showNotification('Item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      showNotification('Failed to delete item.', 'error');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewItem({ 
      name: '', 
      currentStock: '', 
      reorderLevel: '', 
      date: new Date().toISOString().split('T')[0] 
    });
    setEditingItemId(null);
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setNewItem({
      name: item.name,
      currentStock: item.currentStock,
      reorderLevel: item.reorderLevel,
      date: new Date(item.date).toISOString().split('T')[0]
    });
    setEditingItemId(item._id);
  };

  // Show notification with fade effect
  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 3000);
  };

  // Apply filters to inventory
  const applyFilters = () => {
    let results = [...inventory];
    
    // Apply search term filter
    if (filters.searchTerm) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Apply stock status filter
    if (filters.stockStatus !== 'all') {
      if (filters.stockStatus === 'low') {
        results = results.filter(item => item.currentStock <= item.reorderLevel);
      } else if (filters.stockStatus === 'sufficient') {
        results = results.filter(item => item.currentStock > item.reorderLevel);
      }
    }
    
    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      results = results.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    setFilteredInventory(results);
  };

  // Export inventory to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Current Stock', 'Reorder Level', 'Date', 'Status'];
    
    const csvData = filteredInventory.map(item => {
      const status = item.currentStock <= item.reorderLevel ? 'Low Stock' : 'Sufficient';
      const date = new Date(item.date).toLocaleDateString();
      
      return [item.name, item.currentStock, item.reorderLevel, date, status];
    });
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get notification styles based on type
  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="p-8 mx-auto bg-gray-900 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterPopupOpen(true)}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed z-50 p-4 text-center text-white rounded-lg shadow-lg bottom-4 right-4 ${getNotificationStyles()}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Popup */}
      <AnimatePresence>
        {filterPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Filter Inventory</h2>
                <button
                  onClick={() => setFilterPopupOpen(false)}
                  className="p-1 text-gray-400 rounded-full hover:text-white hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="w-full p-3 text-white bg-gray-700 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Stock Status</label>
                  <select
                    value={filters.stockStatus}
                    onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                    className="w-full p-3 text-white bg-gray-700 rounded-lg"
                  >
                    <option value="all">All Items</option>
                    <option value="low">Low Stock</option>
                    <option value="sufficient">Sufficient Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 text-xs text-gray-400">Start Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateRange: { ...filters.dateRange, start: e.target.value }
                        })}
                        className="w-full p-3 text-white bg-gray-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-400">End Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateRange: { ...filters.dateRange, end: e.target.value }
                        })}
                        className="w-full p-3 text-white bg-gray-700 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFilters({
                        searchTerm: '',
                        stockStatus: 'all',
                        dateRange: { start: '', end: '' }
                      });
                    }}
                    className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    Reset
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      applyFilters();
                      setFilterPopupOpen(false);
                    }}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form for adding or editing inventory items */}
      <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="p-6 mb-8 bg-gray-800 rounded-lg shadow-lg"
>
  <h2 className="mb-4 text-xl font-bold text-white">{editingItemId ? 'Edit Item' : 'Add New Item'}</h2>
  <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-6"> {/* Adjusted to 6 columns */}
    {/* Item Name */}
    <div className="md:col-span-2">
      <input
        type="text"
        placeholder="Item Name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>

    {/* Current Stock */}
    <div>
      <input
        type="number"
        placeholder="Current Stock"
        value={newItem.currentStock}
        onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
        className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>

    {/* Reorder Level */}
    <div>
      <input
        type="number"
        placeholder="Reorder Level"
        value={newItem.reorderLevel}
        onChange={(e) => setNewItem({ ...newItem, reorderLevel: Number(e.target.value) })}
        className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>

    {/* Date */}
    <div>
      <div className="relative">
        <input
          type="date"
          value={newItem.date}
          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <Calendar size={18} className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
      </div>
    </div>

    {/* Add Item / Save Changes Button */}
    <div className="md:col-span-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={editingItemId ? editInventoryItem : addInventoryItem}
        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        {editingItemId ? 'Save Changes' : 'Add Item'}
      </motion.button>
    </div>

    {/* Cancel Button (only shown when editing) */}
    {editingItemId && (
      <div className="md:col-span-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetForm}
          className="w-full px-4 py-2 font-bold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          Cancel
        </motion.button>
      </div>
    )}
  </div>
</motion.div>

      {/* Inventory count summary */}
      <div className="mb-4 text-gray-300">
        Showing <span className="font-bold text-white">{filteredInventory.length}</span> of <span className="font-bold text-white">{inventory.length}</span> items
        {filters.searchTerm || filters.stockStatus !== 'all' || (filters.dateRange.start && filters.dateRange.end) ? ' (filtered)' : ''}
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Current Stock</th>
              <th className="p-3 text-left">Reorder Level</th>
              <th className="p-3 text-left">Date Added</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <motion.tr 
                  key={item._id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.currentStock}</td>
                  <td className="p-3">{item.reorderLevel}</td>
                  <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        item.currentStock <= item.reorderLevel
                          ? 'bg-red-900 text-red-300'
                          : 'bg-green-900 text-green-300'
                      }`}
                    >
                      {item.currentStock <= item.reorderLevel ? 'LOW STOCK' : 'SUFFICIENT'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-blue-300 bg-blue-900 rounded-full hover:bg-blue-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteInventoryItem(item._id)}
                        className="p-2 text-red-300 bg-red-900 rounded-full hover:bg-red-800"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;