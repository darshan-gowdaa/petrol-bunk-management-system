// frontend/src/components/layout/PageWrapper.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

import HeaderWithActions from "./HeaderWithActions";
import { Filters, Table, AddModalForm, EditModalForm, DeleteRow } from "../../modals";
import { StatsCard } from "../features";

import { fetchData, createItem, updateItem, deleteItem, fetchFilteredData } from "../../utils/apiUtils";
import { getInitialFormState, getInitialFilterState, calculateStats, handleFilterRemoval } from "../../utils/stateUtils";
import { getFormFields, getFilterFields, getTableColumns } from "../../utils/formFields";
import { exportToCSV } from "../../utils/ExportToCSV";
import { showToast, toastConfig } from "../../utils/toastConfig";

// Map singular types to plural endpoints
const endpointMap = {
  employee: "employees",
  expense: "expenses",
  inventory: "inventory",
  sales: "sales",
};

const PageWrapper = ({ type, title, statsConfig, additionalFields = {}, onDataUpdate = () => { } }) => {
  const endpoint = endpointMap[type] || type;

  // State management
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(getInitialFormState(type));
  const [filters, setFilters] = useState(getInitialFilterState(type));
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Reset category input when add modal closes
  useEffect(() => {
    if (!showAddModal) {
      setShowNewCategoryInput(false);
      setNewCategory("");
    }
  }, [showAddModal]);

  // Get configurations for forms and table
  const formFields = getFormFields(type);
  const filterFields = getFilterFields(type, additionalFields.categories);
  const tableColumns = getTableColumns(type);

  // Update form fields with dynamic categories for expense type
  const updatedFormFields = type === "expense" ? formFields.map(field => {
    if (field.name === "category") {
      const defaultOptions = field.options.filter(opt => opt !== "Add New Category");
      const dynamicOptions = additionalFields.categories || [];
      return { ...field, options: [...new Set([...defaultOptions, ...dynamicOptions]), "Add New Category"] };
    }
    return field;
  }) : formFields;

  // Category management handlers
  const handleCategorySelect = (e) => {
    const { value } = e.target;
    if (value === "Add New Category") {
      setShowNewCategoryInput(true);
      setNewCategory("");
    } else {
      const target = showEditModal ? currentItem : formData;
      const setTarget = showEditModal ? setCurrentItem : setFormData;
      setTarget({ ...target, category: value });
    }
  };

  const handleNewCategoryChange = (e) => setNewCategory(e.target.value);

  const addNewCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = [...(additionalFields.categories || []), newCategory.trim()];
      const target = showEditModal ? currentItem : formData;
      const setTarget = showEditModal ? setCurrentItem : setFormData;
      setTarget({ ...target, category: newCategory.trim() });
      onDataUpdate({ ...data, categories: updatedCategories });
      setNewCategory("");
      setShowNewCategoryInput(false);
      showToast.success("New category added successfully!");
    } else {
      showToast.error("Category name cannot be empty");
    }
  };

  // Fetch and refresh data
  const fetchPageData = async () => {
    setLoading(true);
    try {
      const result = await fetchData(endpoint);
      setData(result);
      setFilteredData(result);
      onDataUpdate(result);
    } catch (error) {
      showToast.error("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  // Form input handler with date formatting
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "date") {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          newValue = format(date, "yyyy-MM-dd");
        }
      } catch (e) {
        console.error("Date parsing error:", e);
      }
    }

    if (showEditModal && currentItem) {
      setCurrentItem({ ...currentItem, [name]: newValue });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  // CRUD operations with filter-aware updates
  const handleAdd = async (e) => {
    e.preventDefault();
    if (showNewCategoryInput) return;
    setLoading(true);
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.date) {
        const date = new Date(dataToSubmit.date);
        if (!isNaN(date.getTime())) dataToSubmit.date = format(date, "yyyy-MM-dd");
      }
      const newItem = await createItem(endpoint, dataToSubmit);
      const updatedData = [...data, newItem];
      setData(updatedData);

      // Refresh filtered data based on active filters
      const hasActiveFilters = Object.entries(filters).some(([_, value]) => value && value !== "" && value !== "All");
      if (hasActiveFilters) {
        const filtered = await fetchFilteredData(endpoint, filters);
        setFilteredData(filtered);
      } else {
        setFilteredData(updatedData);
      }

      setShowAddModal(false);
      setFormData(getInitialFormState(type));
      onDataUpdate(updatedData);
      showToast.success(`${title.split(" ")[0]} added successfully!`);
    } catch (error) {
      showToast.error(`Failed to add ${title.split(" ")[0].toLowerCase()}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (showNewCategoryInput) return;
    setLoading(true);
    try {
      const dataToSubmit = { ...currentItem };
      if (dataToSubmit.date) {
        const date = new Date(dataToSubmit.date);
        if (!isNaN(date.getTime())) dataToSubmit.date = format(date, "yyyy-MM-dd");
      }
      const updated = await updateItem(endpoint, dataToSubmit._id, dataToSubmit);
      const updatedData = data.map(item => item._id === currentItem._id ? updated : item);
      setData(updatedData);

      // Refresh filtered data based on active filters
      const hasActiveFilters = Object.entries(filters).some(([_, value]) => value && value !== "" && value !== "All");
      if (hasActiveFilters) {
        const filtered = await fetchFilteredData(endpoint, filters);
        setFilteredData(filtered);
      } else {
        setFilteredData(updatedData);
      }

      setShowEditModal(false);
      onDataUpdate(updatedData);
      showToast.success(`${title.split(" ")[0]} updated successfully!`);
    } catch (error) {
      showToast.error(`Failed to update ${title.split(" ")[0].toLowerCase()}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItem(endpoint, currentItem._id);
      const updatedData = data.filter(item => item._id !== currentItem._id);
      setData(updatedData);
      setFilteredData(updatedData);
      setShowDeleteModal(false);
      onDataUpdate(updatedData);
      showToast.success(`${title.split(" ")[0]} deleted successfully!`);
    } catch (error) {
      showToast.error(`Failed to delete ${title.split(" ")[0].toLowerCase()}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter management
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const filtered = await fetchFilteredData(endpoint, filters);
      setFilteredData(filtered);
      setShowFilters(false);
      showToast.success("Filters applied successfully!");
    } catch (error) {
      showToast.error("Failed to apply filters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(getInitialFilterState(type));
    setFilteredData(data);
    setShowFilters(false);
    showToast.info("Filters have been reset");
  };

  // Export functionality
  const handleExport = () => {
    exportToCSV(filteredData, tableColumns, type);
  };

  // Calculate statistics
  const stats = calculateStats(filteredData, type);

  return (
    <div className="flex flex-col min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="container flex flex-col w-full p-6 mx-auto max-w-7xl">
        <HeaderWithActions
          title={title}
          onAdd={() => setShowAddModal(true)}
          onFilter={() => setShowFilters(!showFilters)}
          onExport={handleExport}
          addLabel={`Add ${title.split(" ")[0]}`}
        />

        <ToastContainer {...toastConfig} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          {statsConfig.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.getValue(stats)}
              icon={stat.icon}
              color={stat.color}
              footer={stat.footer}
            />
          ))}
        </div>

        {/* Filters */}
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          handleFilterChange={handleFilterChange}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
          fields={filterFields}
          title={`Filter ${title}`}
        />

        {/* Table */}
        <Table
          columns={tableColumns}
          data={filteredData}
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
          onRemoveFilter={(key) => {
            const newFilters = handleFilterRemoval(filters, key);
            setFilters(newFilters);
            const hasActiveFilters = Object.entries(newFilters).some(
              ([_, value]) => value && value !== "" && value !== "All"
            );
            if (!hasActiveFilters) {
              setFilteredData(data);
            } else {
              fetchFilteredData(endpoint, newFilters).then(setFilteredData);
            }
          }}
        />

        {/* Modals */}
        <AddModalForm
          show={showAddModal}
          title={`Add New ${title.split(" ")[0]}`}
          fields={updatedFormFields}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleAdd}
          onCancel={() => {
            setShowAddModal(false);
            setShowNewCategoryInput(false);
            setNewCategory("");
          }}
          loading={loading}
          handleCategorySelect={handleCategorySelect}
          handleNewCategoryChange={handleNewCategoryChange}
          addNewCategory={addNewCategory}
          newCategory={newCategory}
          showNewCategoryInput={showNewCategoryInput}
          setShowNewCategoryInput={setShowNewCategoryInput}
          {...additionalFields}
        />

        <EditModalForm
          showEditModal={showEditModal}
          currentData={currentItem}
          setShowEditModal={setShowEditModal}
          handleInputChange={handleInputChange}
          loading={loading}
          editFunction={handleEdit}
          entityType={title.split(" ")[0]}
          handleCategorySelect={handleCategorySelect}
          handleNewCategoryChange={handleNewCategoryChange}
          addNewCategory={addNewCategory}
          newCategory={newCategory}
          showNewCategoryInput={showNewCategoryInput}
          setShowNewCategoryInput={setShowNewCategoryInput}
          fields={updatedFormFields}
          {...additionalFields}
        />

        <DeleteRow
          show={showDeleteModal}
          item={currentItem}
          itemType={title.split(" ")[0]}
          itemName={currentItem?.[additionalFields.nameField || "name"]}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default PageWrapper;
