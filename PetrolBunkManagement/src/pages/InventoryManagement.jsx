// src/pages/InventoryManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Package, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HeaderWithActions from "../components/HeaderWithActions";
import { exportToCSV } from "../utils/ExportToCSV";
import StatsCard from "../PagesModals/StatsCard";
import Table from "../PagesModals/Tables";
import AddModalForm from "../PagesModals/AddModalForm";
import EditModalForm from "../PagesModals/EditModalForm";
import DeleteRow from "../PagesModals/DeleteRow";

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
    { name: "date", label: "Date", type: "date" },
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
  const handleExportInventory = () => {
    const headers = [
      { key: "name", label: "Name" },
      { key: "currentStock", label: "Current Stock" },
      { key: "reorderLevel", label: "Reorder Level" },
      { key: "date", label: "Date" },
    ];
    exportToCSV(filteredInventory, headers, "inventory");
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
        onExport={handleExportInventory}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-full max-w-3xl overflow-hidden bg-gray-900 rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-medium text-white">
                Filter Inventory
              </h3>
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
                  <label className="block mb-1 text-sm font-medium text-gray-300">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Filter by name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                      Min Stock
                    </label>
                    <input
                      type="number"
                      name="stockMin"
                      value={filters.stockMin}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                      Max Stock
                    </label>
                    <input
                      type="number"
                      name="stockMax"
                      value={filters.stockMax}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                      Min Reorder Level
                    </label>
                    <input
                      type="number"
                      name="reorderMin"
                      value={filters.reorderMin}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                      Max Reorder Level
                    </label>
                    <input
                      type="number"
                      name="reorderMax"
                      value={filters.reorderMax}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 bg-gray-800 border-t border-gray-700">
              <button
                onClick={() => {
                  resetFilters();
                  setShowFilters(false);
                }}
                className="px-4 py-2 mr-2 text-gray-300 transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
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

      {/* Interactive Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <StatsCard
          icon={<Package size={24} />}
          iconBgColor="bg-indigo-900"
          iconColor="text-indigo-300"
          title="Total Items"
          value={totalItems}
        />

        <StatsCard
          icon={<AlertCircle size={24} />}
          iconBgColor="bg-red-900"
          iconColor="text-red-300"
          title="Need to Reorder"
          value={itemsToReorder}
        />

        <StatsCard
          icon={<CheckCircle size={24} />}
          iconBgColor="bg-green-900"
          iconColor="text-green-300"
          title="In Stock"
          value={inStockItems}
        />
      </div>

      {/* Inventory Table */}
      <Table
        columns={[
          { key: "name", label: "Item Name" },
          { key: "currentStock", label: "Current Stock" },
          { key: "reorderLevel", label: "Reorder Level" },
          {
            key: "status",
            label: "Status",
            render: (_, item) =>
              item.currentStock <= item.reorderLevel ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                  <AlertTriangle size={12} className="mr-1" />
                  Reorder
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                  In Stock
                </span>
              ),
          },
          {
            key: "date",
            label: "Date",
            render: (value) => new Date(value).toLocaleDateString(),
          },
        ]}
        data={filteredInventory}
        loading={loading}
        onEdit={(item) => {
          setCurrentItem(item);
          setShowEditModal(true);
        }}
        onDelete={(item) => {
          setCurrentItem(item);
          setShowDeleteModal(true);
        }}
      />

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
      <EditModalForm
        showEditModal={showEditModal}
        currentData={currentItem}
        setShowEditModal={setShowEditModal}
        handleInputChange={handleInputChange}
        loading={loading}
        editFunction={editInventoryItem}
        entityType="Inventory"
      />

      {/* Delete Confirmation Modal */}
      <DeleteRow
        show={showDeleteModal}
        item={currentItem}
        itemType="Inventory Item"
        itemName={currentItem?.name}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={deleteInventoryItem}
        loading={loading}
      />
    </div>
  );
};

export default InventoryManagement;
