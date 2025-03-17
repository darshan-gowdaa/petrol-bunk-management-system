// src/components/BaseManagement.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HeaderWithActions from "./HeaderWithActions";
import Table from "../PagesModals/Tables";
import AddModalForm from "../PagesModals/AddModalForm";
import EditModalForm from "../PagesModals/EditModalForm";
import DeleteRow from "../PagesModals/DeleteRow";
import Filters from "../PagesModals/Filters";

const BaseManagement = ({
  title,
  apiEndpoint,
  columns,
  fields,
  initialItemState,
  renderStats,
  filterFields,
  processNewItem,
  calculateStats,
  uniqueIdentifier = "_id"
}) => {
  // State management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [stats, setStats] = useState({});

  // New item form state
  const [newItem, setNewItem] = useState(initialItemState);

  // Filter state - initialize with keys from filterFields
  const [filters, setFilters] = useState(
    filterFields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/${apiEndpoint}`);
      const data = await response.json();
      setItems(data);
      setFilteredItems(data);
      if (calculateStats) {
        const newStats = calculateStats(data);
        setStats(newStats);
      }
    } catch (err) {
      toast.error(`Failed to fetch ${title.toLowerCase()}. Please try again.`);
      console.error(`Error fetching ${title.toLowerCase()}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchItems();
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
      for (const [key, value] of Object.entries(filters)) {
        if (value) params.append(key, value);
      }

      const response = await fetch(
        `http://localhost:5000/api/${apiEndpoint}?${params}`
      );
      const data = await response.json();
      setFilteredItems(data);
    } catch (err) {
      toast.error(`Failed to filter ${title.toLowerCase()}. Please try again.`);
      console.error(`Error filtering ${title.toLowerCase()}:`, err);
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    const resetFilterState = filterFields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
    
    setFilters(resetFilterState);
    setFilteredItems(items);
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

  // Add new item
  const addItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const itemToAdd = processNewItem ? processNewItem(newItem) : newItem;
      
      const response = await fetch(`http://localhost:5000/api/${apiEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToAdd),
      });
      
      const data = await response.json();
      
      setItems([...items, data]);
      setFilteredItems([...filteredItems, data]);
      setNewItem(initialItemState);
      setShowAddModal(false);
      toast.success(`${title.slice(0, -1)} added successfully!`);
      
      if (calculateStats) {
        const newStats = calculateStats([...items, data]);
        setStats(newStats);
      }
    } catch (err) {
      toast.error(`Failed to add ${title.toLowerCase()}. Please try again.`);
      console.error(`Error adding ${title.toLowerCase()}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Edit item
  const editItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const itemToUpdate = processNewItem ? processNewItem(currentItem) : currentItem;
      
      const response = await fetch(
        `http://localhost:5000/api/${apiEndpoint}/${currentItem[uniqueIdentifier]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemToUpdate),
        }
      );
      
      const data = await response.json();
      
      const updatedItems = items.map((item) =>
        item[uniqueIdentifier] === currentItem[uniqueIdentifier] ? data : item
      );
      
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      setShowEditModal(false);
      toast.success(`${title.slice(0, -1)} updated successfully!`);
      
      if (calculateStats) {
        const newStats = calculateStats(updatedItems);
        setStats(newStats);
      }
    } catch (err) {
      toast.error(`Failed to update ${title.toLowerCase()}. Please try again.`);
      console.error(`Error updating ${title.toLowerCase()}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async () => {
    setLoading(true);
    try {
      await fetch(
        `http://localhost:5000/api/${apiEndpoint}/${currentItem[uniqueIdentifier]}`,
        {
          method: "DELETE",
        }
      );
      
      const updatedItems = items.filter(
        (item) => item[uniqueIdentifier] !== currentItem[uniqueIdentifier]
      );
      
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      setShowDeleteModal(false);
      toast.success(`${title.slice(0, -1)} deleted successfully!`);
      
      if (calculateStats) {
        const newStats = calculateStats(updatedItems);
        setStats(newStats);
      }
    } catch (err) {
      toast.error(`Failed to delete ${title.toLowerCase()}. Please try again.`);
      console.error(`Error deleting ${title.toLowerCase()}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Export data to CSV
  const exportToCSV = () => {
    const headers = columns.map((col) => col.label);
    const csvData = filteredItems.map((item) =>
      columns.map((col) => {
        // If the column has a render function, it's likely meant for display only
        // So we'll use the raw value for export
        return item[col.key];
      })
    );

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.toLowerCase()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info(`${title} data exported to CSV`);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <HeaderWithActions
        title={title}
        onAdd={() => setShowAddModal(true)}
        onFilter={() => setShowFilters(!showFilters)}
        onExport={exportToCSV}
        addLabel={`Add ${title.slice(0, -1)}`}
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

      {/* Stats Section */}
      {renderStats && renderStats(filteredItems, stats)}

      {/* Filter Panel */}
      <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        fields={filterFields}
      />

      {/* Items Table */}
      <Table
        columns={columns}
        data={filteredItems}
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

      {/* Add Item Modal */}
      <AddModalForm
        show={showAddModal}
        title={`Add New ${title.slice(0, -1)}`}
        fields={fields}
        formData={newItem}
        onChange={handleInputChange}
        onSubmit={addItem}
        onCancel={() => setShowAddModal(false)}
        loading={loading}
      />

      {/* Edit Item Modal */}
      <EditModalForm
        showEditModal={showEditModal}
        currentData={currentItem}
        setShowEditModal={setShowEditModal}
        handleInputChange={handleInputChange}
        loading={loading}
        editFunction={editItem}
        entityType={title}
      />

      {/* Delete Confirmation Modal */}
      <DeleteRow
        show={showDeleteModal}
        item={currentItem}
        itemType={title.slice(0, -1)}
        itemName={currentItem && currentItem[fields[0].name]}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={deleteItem}
        loading={loading}
      />
    </div>
  );
};

export default BaseManagement;