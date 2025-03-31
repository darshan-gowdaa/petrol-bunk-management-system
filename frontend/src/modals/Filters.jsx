// frontend/src/modals/Filters.jsx - Filter options modal component

import React from "react";
import { X } from "lucide-react";

const Filters = ({
  showFilters,
  setShowFilters,
  filters,
  handleFilterChange,
  resetFilters,
  applyFilters,
  fields,
  title = "Filter Options",
}) => {
  if (!showFilters) return null;

  // Helper function to render the appropriate input based on field type
  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={filters[field.name] || ""}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {field.options.map((option) => (
              <option
                key={option.value || option}
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        );
      case "range":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400">Minimum</label>
              <input
                type="number"
                name={`${field.name}Min`}
                value={filters[`${field.name}Min`] || ""}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400">Maximum</label>
              <input
                type="number"
                name={`${field.name}Max`}
                value={filters[`${field.name}Max`] || ""}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Max"
              />
            </div>
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={filters[field.name] || ""}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalFadeIn">
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm animate-modalFadeIn" />
      <div className="relative w-full max-w-3xl overflow-hidden bg-gray-900 rounded-lg shadow-xl animate-modalSlideIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-medium text-white">{title}</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-400 hover:text-white focus:outline-none transition-transform duration-200 hover:rotate-90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={`${
                  field.type === "range" ? "md:col-span-2" : ""
                } transition-all duration-200 hover:scale-[1.02]`}
              >
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 bg-gray-800 border-t border-gray-700">
          <button
            onClick={() => {
              resetFilters();
              setShowFilters(false);
            }}
            className="px-4 py-2 mr-2 text-gray-300 transition-all duration-200 bg-gray-700 rounded-md hover:bg-gray-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
          <button
            onClick={() => {
              applyFilters();
              setShowFilters(false);
            }}
            className="px-4 py-2 text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
