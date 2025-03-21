import React from "react";
import { Plus, X, RefreshCw } from "lucide-react";

const AddModalForm = ({
  show,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading,
  categories,
  addNewCategory,
  newCategory,
  handleNewCategoryChange,
  showNewCategoryInput,
  setShowNewCategoryInput,
  handleCategorySelect,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
        <form onSubmit={onSubmit}>
          {fields.map(({ name, label, type, options, step, min }) => (
            <div key={name} className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-300">{label}</label>

              {/* Category Handling with improved UI */}
              {name === "category" ? (
                !showNewCategoryInput ? (
                  <select
                    name="category"
                    value={formData.category}
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
              ) : type === "select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={onChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select {label}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={onChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  step={step}
                  min={min}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              disabled={loading || showNewCategoryInput}
            >
              {loading ? (
                <span className="flex items-center">
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModalForm;