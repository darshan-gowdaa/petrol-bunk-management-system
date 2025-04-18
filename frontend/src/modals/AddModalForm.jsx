import React from "react";
import { Plus, X, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const AddModalForm = ({
  show, title, fields, formData, onChange, onSubmit, onCancel,
  loading, categories, addNewCategory, newCategory,
  handleNewCategoryChange, showNewCategoryInput,
  setShowNewCategoryInput, handleCategorySelect,
}) => {
  if (!show) return null;
  const formatDateForInput = (v) => (!v ? "" : format(new Date(v), "yyyy-MM-dd"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalFadeIn">
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm animate-modalFadeIn" />
      <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3),0_0_10px_rgba(255,255,255,0.1)] border border-gray-700/50 animate-modalSlideIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 transition-transform duration-200 hover:text-white focus:outline-none hover:rotate-90" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map(({ name, label, type, options, step, min }) => (
            <div key={name} className="transition-all duration-200 hover:scale-[1.02] group">
              <label className="block mb-1 text-sm font-medium text-gray-300 transition-colors duration-200 group-hover:text-blue-400">{label}</label>

              {type === "select" && name === "category" ? !showNewCategoryInput ? (
                <select name={name} value={formData[name] || ""} onChange={handleCategorySelect}
                  className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-blue-500/50 backdrop-blur-sm [&>option]:bg-gray-800 [&>option]:text-white" required>
                  <option value="">Select a Category</option>
                  {options.filter(opt => opt !== "Add New Category").map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                  <option value="Add New Category">+ Add New Category</option>
                </select>
              ) : (
                <div>
                  <input type="text" value={newCategory} onChange={handleNewCategoryChange}
                    placeholder="Enter new category name"
                    className="w-full p-2 mb-2 text-white transition-all duration-200 border border-gray-600 rounded-md bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50 backdrop-blur-sm" autoFocus />
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={addNewCategory}
                      className="flex items-center justify-center px-4 py-2 text-sm text-white transition-all duration-200 bg-green-500 rounded hover:bg-green-600"
                      disabled={!newCategory.trim()}>
                      <Plus size={16} className="mr-1" /> Add Category
                    </button>
                    <button type="button" onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory("");
                      onChange({ target: { name: "category", value: "" } });
                    }} className="flex items-center justify-center px-4 py-2 text-sm text-white transition-all duration-200 bg-gray-600 rounded hover:bg-gray-700">
                      <X size={16} className="mr-1" /> Cancel
                    </button>
                  </div>
                </div>
              ) : type === "select" ? (
                <select name={name} value={formData[name] || ""} onChange={onChange}
                  className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-blue-500/50 backdrop-blur-sm [&>option]:bg-gray-800 [&>option]:text-white" required>
                  <option value="">Select {label}</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input type={type} name={name}
                  value={type === "date" ? formatDateForInput(formData[name]) : formData[name]}
                  onChange={onChange} className="w-full p-2 text-white transition-all duration-200 border border-gray-600 rounded-md bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50 backdrop-blur-sm" required step={step} min={min} />
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-white transition-all duration-200 rounded shadow-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 hover:scale-105 active:scale-95 shadow-gray-500/20">
              Cancel
            </button>
            <button type="submit" disabled={loading || showNewCategoryInput}
              className="px-4 py-2 text-white transition-all duration-200 rounded shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 shadow-blue-500/20">
              {loading ? <span className="flex items-center"><RefreshCw size={16} className="mr-2 animate-spin" />Saving...</span> : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModalForm;
