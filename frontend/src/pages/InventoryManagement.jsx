// src/pages/InventoryManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Package,
  AlertCircle,
  CheckCircle,
  Filter,
} from "lucide-react";
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
    date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
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
        date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
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
    if (newFilters.name) params.append("name", newFilters.name);
    if (newFilters.stockMin) params.append("stockMin", newFilters.stockMin);
    if (newFilters.stockMax) params.append("stockMax", newFilters.stockMax);
    if (newFilters.reorderMin) params.append("reorderMin", newFilters.reorderMin);
    if (newFilters.reorderMax) params.append("reorderMax", newFilters.reorderMax);
    if (newFilters.dateFrom) params.append("dateFrom", newFilters.dateFrom);
    if (newFilters.dateTo) params.append("dateTo", newFilters.dateTo);

    // If no filters are active, show all inventory
    if (params.toString() === '') {
      setFilteredInventory(inventory);
    } else {
      // Apply the remaining filters
      axios.get(`http://localhost:5000/api/inventory?${params}`)
        .then(response => {
          setFilteredInventory(response.data);
        })
        .catch(err => {
          toast.error("Failed to update filters. Please try again.");
          console.error("Error updating filters:", err);
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="container flex flex-col w-full max-w-7xl p-6 mx-auto">
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
          fields={[
            { name: "name", label: "Item Name", type: "text" },
            { name: "stock", label: "Stock Range", type: "range" },
            { name: "reorder", label: "Reorder Level Range", type: "range" },
            { name: "dateFrom", label: "Date From", type: "date" },
            { name: "dateTo", label: "Date To", type: "date" },
          ]}
          title="Filter Inventory"
        />

        {/* Interactive Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <StatsCard
            title="Total Items"
            value={totalItems}
            icon={Package}
            color="blue"
            footer={`Total inventory items`}
          />

          <StatsCard
            title="Items to Reorder"
            value={itemsToReorder}
            icon={AlertTriangle}
            color="red"
            footer={`Items below reorder level`}
          />

          <StatsCard
            title="In Stock Items"
            value={inStockItems}
            icon={CheckCircle}
            color="green"
            footer={`Items above reorder level`}
          />
        </div>

        {/* Inventory Table */}
        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "currentStock", label: "Current Stock" },
            { key: "reorderLevel", label: "Reorder Level" },
            { 
              key: "date", 
              label: "Date",
              render: (value) => new Date(value).toLocaleDateString('en-GB')
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
          activeFilters={filters}
          onRemoveFilter={handleRemoveFilter}
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
      </main>
    </div>
  );
};

export default InventoryManagement;
