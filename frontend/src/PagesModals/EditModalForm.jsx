import React from "react";
import { RefreshCw, Plus, X } from "lucide-react";

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

  const entityFields = {
    Sales: [
      { label: "Product", type: "select", name: "product", options: ["Petrol", "Diesel"] },
      { label: "Quantity (L)", type: "number", name: "quantity", step: "0.01", min: "0" },
      { label: "Price per Liter (₹)", type: "number", name: "price", step: "0.01", min: "0" },
      { label: "Date", type: "date", name: "date" },
    ],
    Inventory: [
      { label: "Item Name", type: "text", name: "name" },
      { label: "Current Stock", type: "number", name: "currentStock" },
      { label: "Reorder Level", type: "number", name: "reorderLevel" },
      { label: "Date", type: "date", name: "date" },
    ],
    Employees: [
      { label: "Employee Name", type: "text", name: "name" },
      { label: "Position", type: "text", name: "position" },
      { label: "Salary", type: "number", name: "salary" },
      { label: "Date Added", type: "date", name: "dateAdded" },
    ],
    Expense: [
      { label: "Category", type: "category", name: "category" },
      { label: "Amount (₹)", type: "number", name: "amount", step: "0.01", min: "0" },
      { label: "Date", type: "date", name: "date" },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-white">Edit {entityType}</h2>
        <form onSubmit={editFunction}>
          {entityFields[entityType]?.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-300">{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={currentData[field.name] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "category" ? (
                !showNewCategoryInput ? (
                  <select
                    name={field.name}
                    value={currentData[field.name] || ""}
                    onChange={handleCategorySelect}
                    className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
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
                        className="flex-1 p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={addNewCategory}
                        className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                        disabled={!newCategory.trim()}
                      >
                        <Plus size={16} className="mr-1" />
                        Add Category
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryInput(false)}
                        className="flex items-center px-3 py-1 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
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
                      ? currentData[field.name]
                        ? new Date(currentData[field.name]).toISOString().split("T")[0]
                        : ""
                      : currentData[field.name] || ""
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  {...(field.step && { step: field.step })}
                  {...(field.min && { min: field.min })}
                />
              )}
            </div>
          ))}
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