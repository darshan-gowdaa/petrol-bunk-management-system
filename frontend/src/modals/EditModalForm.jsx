// frontend/src/modals/EditModalForm.jsx - Edit modal form component
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
  loading,
  editFunction,
  entityType,
  fields,
}) => {
  if (!showEditModal || !currentData) return null;

  const formatDate = (value, inputFormat = false) => {
    if (!value) return "";
    const date = new Date(value);
    return !isNaN(date.getTime()) ? format(date, inputFormat ? "yyyy-MM-dd" : "dd/MM/yyyy") : "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalFadeIn">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-modalFadeIn" />
      <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3),0_0_10px_rgba(255,255,255,0.1)] border border-gray-700/50 animate-modalSlideIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit {entityType}</h2>
          <button onClick={() => setShowEditModal(false)} className="text-gray-400 transition-transform duration-200 hover:text-white hover:rotate-90" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={editFunction} className="space-y-4">
          {fields?.map((field) => (
            <div key={field.name} className="transition-all duration-200 hover:scale-[1.02] group">
              <label className="block mb-1 text-sm font-medium text-gray-300 transition-colors group-hover:text-blue-400">{field.label}</label>
              {field.type === "select" && field.name === "category" ? (
                !showNewCategoryInput ? (
                  <select
                    name={field.name}
                    value={currentData[field.name] || ""}
                    onChange={handleCategorySelect}
                    className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:border-blue-500/50 backdrop-blur-sm [&>option]:bg-gray-800 [&>option]:text-white"
                    required
                  >
                    <option value="">Select a Category</option>
                    {field.options.filter(opt => opt !== "Add New Category").map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                    <option value="Add New Category">+ Add New Category</option>
                  </select>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={handleNewCategoryChange}
                      placeholder="Enter new category name"
                      className="w-full p-2 mb-2 text-white transition-all border border-gray-600 rounded-md bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50 backdrop-blur-sm"
                      autoFocus
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={addNewCategory} className="flex items-center justify-center px-4 py-2 text-sm text-white transition-all bg-green-500 rounded hover:bg-green-600" disabled={!newCategory.trim()}>
                        <Plus size={16} className="mr-1" /> Add Category
                      </button>
                      <button type="button" onClick={() => { setShowNewCategoryInput(false); setNewCategory(""); handleInputChange({ target: { name: "category", value: "" } }); }} className="flex items-center justify-center px-4 py-2 text-sm text-white transition-all bg-gray-600 rounded hover:bg-gray-700">
                        <X size={16} className="mr-1" /> Cancel
                      </button>
                    </div>
                  </>
                )
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={currentData[field.name] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:border-blue-500/50 backdrop-blur-sm [&>option]:bg-gray-800 [&>option]:text-white"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={field.type === "date" ? formatDate(currentData[field.name], true) : currentData[field.name] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white transition-all border border-gray-600 rounded-md bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50 backdrop-blur-sm"
                  required
                  {...(field.step && { step: field.step })}
                  {...(field.min && { min: field.min })}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-white transition-all rounded shadow-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 hover:scale-105 active:scale-95 shadow-gray-500/20">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-white transition-all rounded shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 shadow-green-500/20" disabled={loading || showNewCategoryInput}>
              {loading ? <span className="flex items-center"><RefreshCw size={16} className="mr-2 animate-spin" /> Updating...</span> : `Update ${entityType}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModalForm;