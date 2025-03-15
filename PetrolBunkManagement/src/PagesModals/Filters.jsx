import React from "react";

const Filters = ({ 
  showFilters, 
  setShowFilters, 
  filters, 
  handleFilterChange, 
  resetFilters, 
  applyFilters, 
  fields 
}) => {
  if (!showFilters) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-3xl overflow-hidden bg-gray-900 rounded-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-medium text-white">Filter Options</h3>
          <button 
            onClick={() => setShowFilters(false)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium text-gray-300">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={filters[field.name] || ""}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={filters[field.name] || ""}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 bg-gray-800 border-t border-gray-700">
          <button
            onClick={() => { resetFilters(); setShowFilters(false); }}
            className="px-4 py-2 mr-2 text-gray-300 transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
          <button
            onClick={() => { applyFilters(); setShowFilters(false); }}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
