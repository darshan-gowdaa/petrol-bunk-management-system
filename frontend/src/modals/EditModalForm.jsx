import React from "react";
import { RefreshCw, Plus, X } from "lucide-react";
import { format } from "date-fns";

const EditModalForm = ({
  showEditModal, currentData, setShowEditModal,
  handleInputChange, handleCategorySelect,
  addNewCategory, handleNewCategoryChange,
  showNewCategoryInput, setShowNewCategoryInput,
  newCategory, loading, editFunction,
  entityType, fields,
}) => {
  if (!showEditModal || !currentData) return null;

  const formatDate = (val, inputFmt = false) => {
    if (!val) return "";
    const d = new Date(val);
    return !isNaN(d) ? format(d, inputFmt ? "yyyy-MM-dd" : "dd/MM/yyyy") : "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalFadeIn">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md p-6 border rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 animate-modalSlideIn">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit {entityType}</h2>
          <button onClick={() => setShowEditModal(false)} className="text-gray-400 transition-transform hover:text-white hover:rotate-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={editFunction} className="space-y-4">
          {fields?.map(({ name, label, type, options, step, min }) => (
            <div key={name} className="group transition-all hover:scale-[1.02]">
              <label className="block mb-1 text-sm font-medium text-gray-300 group-hover:text-blue-400">{label}</label>

              {type === "select" && name === "category" ? (
                !showNewCategoryInput ? (
                  <select
                    name={name} value={currentData[name] || ""}
                    onChange={handleCategorySelect}
                    className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50 [&>option]:bg-gray-800 [&>option]:text-white"
                    required
                  >
                    <option value="">Select a Category</option>
                    {options.filter(opt => opt !== "Add New Category").map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="Add New Category">+ Add New Category</option>
                  </select>
                ) : (
                  <>
                    <input
                      type="text" value={newCategory} onChange={handleNewCategoryChange}
                      placeholder="Enter new category name" autoFocus
                      className="w-full p-2 mb-2 text-white border border-gray-600 rounded-md bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" disabled={!newCategory.trim()} onClick={addNewCategory}
                        className="flex items-center justify-center px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600">
                        <Plus size={16} className="mr-1" /> Add
                      </button>
                      <button type="button" onClick={() => {
                        setShowNewCategoryInput(false); setNewCategory("");
                        handleInputChange({ target: { name: "category", value: "" } });
                      }} className="flex items-center justify-center px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700">
                        <X size={16} className="mr-1" /> Cancel
                      </button>
                    </div>
                  </>
                )
              ) : type === "select" ? (
                <select
                  name={name} value={currentData[name] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50 [&>option]:bg-gray-800 [&>option]:text-white"
                  required
                >
                  <option value="">Select {label}</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={type} name={name}
                  value={type === "date" ? formatDate(currentData[name], true) : currentData[name] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white border border-gray-600 rounded-md bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 hover:border-blue-500/50"
                  required {...(step && { step })} {...(min && { min })}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-white rounded shadow-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 hover:scale-105 active:scale-95">
              Cancel
            </button>
            <button type="submit" disabled={loading || showNewCategoryInput}
              className="px-4 py-2 text-white rounded shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95">
              {loading ? (
                <span className="flex items-center">
                  <RefreshCw size={16} className="mr-2 animate-spin" /> Updating...
                </span>
              ) : `Update ${entityType}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModalForm;
