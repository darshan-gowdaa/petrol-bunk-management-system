// src/pages/InventoryManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Package, AlertCircle, CheckCircle, Filter } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HeaderWithActions from "../components/HeaderWithActions";
import Filters from "../PagesModals/Filters";
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
    <div className="container px-4 py-8 mx-auto transition-all duration-300 animate-fadeIn">
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
      <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        fields={inventoryFields}
        title="Filter Inventory"
      />

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
