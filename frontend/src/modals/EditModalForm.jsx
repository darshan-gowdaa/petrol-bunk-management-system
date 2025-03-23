import React from "react";
import { RefreshCw, Plus, X } from "lucide-react";
import { format } from "date-fns";

const EditModalForm = ({
  showEditModal,
  currentData,
  setShowEditModal,
  handleInputChange,
  handleCategorySelect,
  addNewCategory,
  handleNewCategoryChange,
  showNewCategoryInput,
  setShowNewCategoryInput,
  newCategory,
  categories,
  loading,
  editFunction,
  entityType,
}) => {
  if (!showEditModal || !currentData) return null;

  const formatDateForInput = (value) => {
    if (!value) return "";
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "";
      return format(date, "yyyy-MM-dd");
    } catch (e) {
      console.error("Date formatting error:", e);
      return "";
    }
  };

  const formatDateForDisplay = (value) => {
    if (!value) return "";
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "";
      return format(date, "dd/MM/yyyy");
    } catch (e) {
      console.error("Date formatting error:", e);
      return "";
    }
  };

  const entityFields = {
    Sales: [
      {
        label: "Product",
        type: "select",
        name: "product",
        options: ["Petrol", "Diesel"],
      },
      {
        label: "Quantity (L)",
        type: "number",
        name: "quantity",
        step: "0.01",
        min: "0",
      },
      {
        label: "Price per Liter (₹)",
        type: "number",
        name: "price",
        step: "0.01",
        min: "0",
      },
      { label: "Date", type: "date", name: "date" },
    ],
    Inventory: [
      { label: "Item Name", type: "text", name: "name" },
      { label: "Current Stock", type: "number", name: "currentStock" },
      { label: "Reorder Level", type: "number", name: "reorderLevel" },
      { label: "Date", type: "date", name: "date" },
    ],
    Employee: [
      { label: "Employee Name", type: "text", name: "name" },
      { label: "Position", type: "text", name: "position" },
      { label: "Salary", type: "number", name: "salary" },
      { label: "Date Added", type: "date", name: "date" },
    ],
    Expense: [
      { label: "Category", type: "category", name: "category" },
      {
        label: "Amount (₹)",
        type: "number",
        name: "amount",
        step: "0.01",
        min: "0",
      },
      { label: "Date", type: "date", name: "date" },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalFadeIn">
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm animate-modalFadeIn" />
      <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3),0_0_10px_rgba(255,255,255,0.1)] border border-gray-700/50 animate-modalSlideIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit {entityType}</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-400 hover:text-white focus:outline-none transition-transform duration-200 hover:rotate-90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={editFunction} className="space-y-4">
          {entityFields[entityType]?.map((field) => (
            <div
              key={field.name}
              className="transition-all duration-200 hover:scale-[1.02] group"
            >
              <label className="block mb-1 text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors duration-200">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={currentData[field.name] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-blue-500/50 backdrop-blur-sm [&>option]:bg-gray-800 [&>option]:text-white"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "category" ? (
                !showNewCategoryInput ? (
                  <select
                    name={field.name}
                    value={currentData[field.name] || ""}
                    onChange={handleCategorySelect}
                    className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-blue-500/50 backdrop-blur-sm [&>option]:bg-gray-800 [&>option]:text-white"
                    required
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="add_new">+ Add New Category</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={handleNewCategoryChange}
                        placeholder="Enter new category name"
                        className="flex-1 p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-blue-500/50 backdrop-blur-sm"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={addNewCategory}
                        className="flex items-center px-3 py-1 text-sm text-white bg-gradient-to-r from-green-500 to-green-600 rounded hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
                        disabled={!newCategory.trim()}
                      >
                        <Plus size={16} className="mr-1" />
                        Add Category
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryInput(false)}
                        className="flex items-center px-3 py-1 text-sm text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded hover:from-gray-700 hover:to-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-gray-500/20"
                      >
                        <X size={16} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={
                    field.type === "date"
                      ? formatDateForInput(currentData[field.name])
                      : currentData[field.name] || ""
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-blue-500/50 backdrop-blur-sm"
                  required
                  {...(field.step && { step: field.step })}
                  {...(field.min && { min: field.min })}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded hover:from-gray-700 hover:to-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-gray-500/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-gradient-to-r from-green-500 to-green-600 rounded hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
              disabled={loading || showNewCategoryInput}
            >
              {loading ? (
                <span className="flex items-center">
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Updating...
                </span>
              ) : (
                `Update ${entityType}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModalForm;
