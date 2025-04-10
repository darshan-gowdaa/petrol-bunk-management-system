// frontend/src/components/layout/PageWrapper.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import HeaderWithActions from "./HeaderWithActions";
import { Filters, Table, AddModalForm, EditModalForm, DeleteRow } from "../../modals";
import { StatsCard } from "../features";
import { statsConfigs } from "../features/StatsCard";
import { fetchData, createItem, updateItem, deleteItem, fetchFilteredData } from "../../utils/apiUtils";
import { getInitialFormState, getInitialFilterState, calculateStats, handleFilterRemoval } from "../../utils/stateUtils";
import { getFormFields, getFilterFields, getTableColumns } from "../../utils/formFields";
import { exportToCSV } from "../../utils/ExportToCSV";
import { showToast, toastConfig } from "../../utils/toastConfig";

const endpointMap = {employee: "employees",expense: "expenses",inventory: "inventory",sales: "sales",};

const PageWrapper = ({ type, title, additionalFields = {}, onDataUpdate = () => {} }) => {
  const endpoint = endpointMap[type] || type;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modals, setModals] = useState({ add: false, edit: false, delete: false, filters: false });
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(getInitialFormState(type));
  const [filters, setFilters] = useState(getInitialFilterState(type));
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const formFields = getFormFields(type);
  const filterFields = getFilterFields(type, additionalFields.categories);
  const tableColumns = getTableColumns(type);
  const updatedFormFields = type === "expense" ? formFields.map(field => 
    field.name === "category" ? 
    {...field, 
      options: 
        [...new Set([...field.options.filter(opt => opt !== "Add New Category"),
         ...(additionalFields.categories || []), "Add New Category"])]
    } : field
  ) : formFields;

  useEffect(() => { if (!modals.add) setShowNewCategoryInput(false); setNewCategory(""); }, [modals.add]);
  useEffect(() => { fetchPageData(); }, []);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const result = await fetchData(endpoint);
      setData(result);
      setFilteredData(result);
      onDataUpdate(result);
    } catch (error) {
      showToast.error("Failed to refresh data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "date" && value ? format(new Date(value), "yyyy-MM-dd") : value;
    (modals.edit && currentItem ? setCurrentItem : setFormData)(prev => ({ ...prev, [name]: newValue }));
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === "Add New Category") setShowNewCategoryInput(true);
    else (modals.edit ? setCurrentItem : setFormData)(prev => ({ ...prev, category: value }));
  };

  const addNewCategory = () => {
    if (!newCategory.trim()) return showToast.error("Category name cannot be empty");
    const updatedCategories = [...(additionalFields.categories || []), newCategory.trim()];
    (modals.edit ? setCurrentItem : setFormData)(prev => ({ ...prev, category: newCategory.trim() }));
    onDataUpdate({ ...data, categories: updatedCategories });
    setNewCategory("");
    setShowNewCategoryInput(false);
    showToast.success("New category added!");
  };

  const updateFilteredData = async (updatedData) => {
    setData(updatedData);
    const hasActiveFilters = Object.values(filters).some(v => v && v !== "" && v !== "All");
    setFilteredData(hasActiveFilters ? await fetchFilteredData(endpoint, filters) : updatedData);
    onDataUpdate(updatedData);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (showNewCategoryInput) return;
    setLoading(true);
    try {
      const dataToSubmit = { ...formData, date: formData.date ? format(new Date(formData.date), "yyyy-MM-dd") : formData.date };
      const newItem = await createItem(endpoint, dataToSubmit);
      await updateFilteredData([...data, newItem]);
      setModals(prev => ({ ...prev, add: false }));
      setFormData(getInitialFormState(type));
      showToast.success(`${title.split(" ")[0]} added!`);
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
      const dataToSubmit = { ...currentItem, date: currentItem.date ? format(new Date(currentItem.date), "yyyy-MM-dd") : currentItem.date };
      const updated = await updateItem(endpoint, dataToSubmit._id, dataToSubmit);
      await updateFilteredData(data.map(item => item._id === currentItem._id ? updated : item));
      setModals(prev => ({ ...prev, edit: false }));
      showToast.success(`${title.split(" ")[0]} updated!`);
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
      await updateFilteredData(data.filter(item => item._id !== currentItem._id));
      setModals(prev => ({ ...prev, delete: false }));
      showToast.success(`${title.split(" ")[0]} deleted!`);
    } catch (error) {
      showToast.error(`Failed to delete ${title.split(" ")[0].toLowerCase()}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      setFilteredData(await fetchFilteredData(endpoint, filters));
      setModals(prev => ({ ...prev, filters: false }));
      showToast.success("Filters applied!");
    } catch (error) {
      showToast.error("Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-100 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="container flex flex-col w-full p-6 mx-auto max-w-7xl">
        
        <HeaderWithActions
          title={title}
          onAdd={() => setModals(prev => ({ ...prev, add: true }))}
          onFilter={() => setModals(prev => ({ ...prev, filters: !prev.filters }))}
          onExport={() => exportToCSV(filteredData, tableColumns, type)}
          addLabel={`Add ${title.split(" ")[0]}`}
        />
        
        <ToastContainer {...toastConfig} />
        
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          {statsConfigs[type]?.map((stat, i) => (
            <StatsCard key={i} {...stat} value={stat.getValue(calculateStats(filteredData, type))} />
          ))}
        </div>
        
        <Filters
          showFilters={modals.filters}
          setShowFilters={v => setModals(prev => ({ ...prev, filters: v }))}
          filters={filters}
          handleFilterChange={({ target: { name, value } }) => setFilters(prev => ({ ...prev, [name]: value }))}
          resetFilters={() => { setFilters(getInitialFilterState(type)); setFilteredData(data); setModals(prev => ({ ...prev, filters: false })); showToast.info("Filters reset"); }}
          applyFilters={applyFilters}
          fields={filterFields}
          title={`Filter ${title}`}
        />
        
        <Table
          columns={tableColumns}
          data={filteredData}
          loading={loading}
          onEdit={item => { setCurrentItem(item); setModals(prev => ({ ...prev, edit: true })); }}
          onDelete={item => { setCurrentItem(item); setModals(prev => ({ ...prev, delete: true })); }}
          activeFilters={filters}
          onRemoveFilter={key => {
            const newFilters = handleFilterRemoval(filters, key);
            setFilters(newFilters);
            Object.values(newFilters).some(v => v && v !== "" && v !== "All") 
              ? fetchFilteredData(endpoint, newFilters).then(setFilteredData) 
              : setFilteredData(data);
          }}
        />
        
        <AddModalForm
          show={modals.add}
          title={`Add New ${title.split(" ")[0]}`}
          fields={updatedFormFields}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleAdd}
          onCancel={() => setModals(prev => ({ ...prev, add: false }))}
          loading={loading}
          handleCategorySelect={handleCategorySelect}
          handleNewCategoryChange={({ target: { value } }) => setNewCategory(value)}
          addNewCategory={addNewCategory}
          newCategory={newCategory}
          showNewCategoryInput={showNewCategoryInput}
          setShowNewCategoryInput={setShowNewCategoryInput}
          {...additionalFields}
        />
        
        <EditModalForm
          showEditModal={modals.edit}
          currentData={currentItem}
          setShowEditModal={v => setModals(prev => ({ ...prev, edit: v }))}
          handleInputChange={handleInputChange}
          loading={loading}
          editFunction={handleEdit}
          entityType={title.split(" ")[0]}
          handleCategorySelect={handleCategorySelect}
          handleNewCategoryChange={({ target: { value } }) => setNewCategory(value)}
          addNewCategory={addNewCategory}
          newCategory={newCategory}
          showNewCategoryInput={showNewCategoryInput}
          setShowNewCategoryInput={setShowNewCategoryInput}
          fields={updatedFormFields}
          {...additionalFields}
        />
        
        <DeleteRow
          show={modals.delete}
          item={currentItem}
          itemType={title.split(" ")[0]}
          itemName={currentItem?.[additionalFields.nameField || "name"]}
          onCancel={() => setModals(prev => ({ ...prev, delete: false }))}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default PageWrapper;