// src/pages/InventoryManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  Plus,
  RefreshCw,
  AlertTriangle,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import HeaderWithActions from "../components/HeaderWithActions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddModalForm from "../PagesModals/AddModalForm";

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

  // New inventory item form state
  const [newItem, setNewItem] = useState({
    name: "",
    currentStock: "",
    reorderLevel: "",
    date: new Date().toISOString().split("T")[0],
  });

  const inventoryFields = [
    { name: "name", label: "Item Name", type: "text" },
    { name: "currentStock", label: "Current Stock", type: "number", min: "0" },
    { name: "reorderLevel", label: "Reorder Level", type: "number", min: "0" },
    { name: "date", label: "Date", type: "date" }
  ];
  
  // Filter state
  const [filters, setFilters] = useState({
    name: "",
    stockMin: "",
    stockMax: "",
    reorderMin: "",
    reorderMax: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch inventory from API
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/inventory");
      setInventory(response.data);
      setFilteredInventory(response.data);
    } catch (err) {
      toast.error("Failed to fetch inventory. Please try again.");
      console.error("Error fetching inventory:", err);
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
      if (filters.name) params.append("name", filters.name);
      if (filters.stockMin) params.append("stockMin", filters.stockMin);
      if (filters.stockMax) params.append("stockMax", filters.stockMax);
      if (filters.reorderMin) params.append("reorderMin", filters.reorderMin);
      if (filters.reorderMax) params.append("reorderMax", filters.reorderMax);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await axios.get(
        `http://localhost:5000/api/inventory?${params}`
      );
      setFilteredInventory(response.data);
    } catch (err) {
      toast.error("Failed to filter inventory. Please try again.");
      console.error("Error filtering inventory:", err);
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      name: "",
      stockMin: "",
      stockMax: "",
      reorderMin: "",
      reorderMax: "",
      dateFrom: "",
      dateTo: "",
    });
    setFilteredInventory(inventory);
    setShowFilters(false);
    toast.info("Filters have been reset");
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
      const response = await axios.post(
        "http://localhost:5000/api/inventory",
        newItem
      );
      setInventory([...inventory, response.data]);
      setFilteredInventory([...filteredInventory, response.data]);
      setNewItem({
        name: "",
        currentStock: "",
        reorderLevel: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
      toast.success("Inventory item added successfully!");
    } catch (err) {
      toast.error("Failed to add inventory item. Please try again.");
      console.error("Error adding inventory item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit inventory item
  const editInventoryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/inventory/${currentItem._id}`,
        currentItem
      );
      const updatedInventory = inventory.map((item) =>
        item._id === currentItem._id ? response.data : item
      );
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      setShowEditModal(false);
      toast.success("Inventory item updated successfully!");
    } catch (err) {
      toast.error("Failed to update inventory item. Please try again.");
      console.error("Error updating inventory item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory item
  const deleteInventoryItem = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/inventory/${currentItem._id}`
      );
      const updatedInventory = inventory.filter(
        (item) => item._id !== currentItem._id
      );
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      setShowDeleteModal(false);
      toast.success("Inventory item deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete inventory item. Please try again.");
      console.error("Error deleting inventory item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export inventory data to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Current Stock", "Reorder Level", "Date"];
    const csvData = filteredInventory.map((item) => [
      item.name,
      item.currentStock,
      item.reorderLevel,
      new Date(item.date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Inventory data exported to CSV");
  };

  // Calculate inventory metrics
  const totalItems = filteredInventory.length;
  const itemsToReorder = filteredInventory.filter(
    (item) => item.currentStock <= item.reorderLevel
  ).length;
  const inStockItems = totalItems - itemsToReorder;

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <HeaderWithActions
        title="Inventory Management"
        onAdd={() => setShowAddModal(true)}
        onFilter={() => setShowFilters(!showFilters)}
        onExport={exportToCSV}
        addLabel="Add Item"
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
              <label className="block text-sm font-medium">Item Name</label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Min Stock</label>
                <input
                  type="number"
                  name="stockMin"
                  value={filters.stockMin}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Max Stock</label>
                <input
                  type="number"
                  name="stockMax"
                  value={filters.stockMax}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">
                  Min Reorder Level
                </label>
                <input
                  type="number"
                  name="reorderMin"
                  value={filters.reorderMin}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Max Reorder Level
                </label>
                <input
                  type="number"
                  name="reorderMax"
                  value={filters.reorderMax}
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
        {/* Total Items Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-indigo-300 bg-indigo-900 rounded-full">
              <Package size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Total Items
              </p>
              <p className="text-3xl font-bold text-white">{totalItems}</p>
            </div>
          </div>
        </div>

        {/* Items to Reorder Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-red-300 bg-red-900 rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Need to Reorder
              </p>
              <p className="text-3xl font-bold text-white">{itemsToReorder}</p>
            </div>
          </div>
        </div>

        {/* In Stock Items Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-green-300 bg-green-900 rounded-full">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">In Stock</p>
              <p className="text-3xl font-bold text-white">{inStockItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Item Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Current Stock
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Reorder Level
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Status
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
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  <div className="flex items-center justify-center">
                    <RefreshCw
                      size={20}
                      className="mr-2 text-gray-300 animate-spin"
                    />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  No inventory items found. Add a new item to get started.
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {item.currentStock}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {item.reorderLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.currentStock <= item.reorderLevel ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                        <AlertTriangle size={12} className="mr-1" />
                        Reorder
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-300 bg-blue-900 rounded-full hover:bg-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentItem(item);
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

      <AddModalForm
        show={showAddModal}
        title="Add New Inventory Item"
        fields={inventoryFields}
        formData={newItem}
        onChange={handleInputChange}
        onSubmit={addInventoryItem}
        onCancel={() => setShowAddModal(false)}
        loading={loading}
      />

      {/* Edit Inventory Item Modal */}
      {showEditModal && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">
              Edit Inventory Item
            </h2>
            <form onSubmit={editInventoryItem}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Item Name
                </label>
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
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Current Stock
                </label>
                <input
                  type="number"
                  name="currentStock"
                  value={currentItem.currentStock}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Reorder Level
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={currentItem.reorderLevel}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Date
                </label>
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
                    "Update Item"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentItem && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 text-white bg-gray-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Delete Inventory Item</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete {currentItem.name}? This action
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
                onClick={deleteInventoryItem}
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

export default InventoryManagement;