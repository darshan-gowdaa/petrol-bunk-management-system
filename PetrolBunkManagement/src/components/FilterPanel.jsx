import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const FilterPanel = ({ 
  showFilters, 
  setShowFilters, 
  filters, 
  setFilters, 
  filterFields,
  groupByOptions = null,
  groupBy = null,
  setGroupBy = null,
  buttonVariants
}) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFilters(emptyFilters);
    if (setGroupBy) setGroupBy('none');
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4 overflow-hidden bg-white rounded-lg shadow"
    >
      {showFilters && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filter Options</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterFields.map((field) => (
              <div key={field.name} className="mb-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All</option>
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleFilterChange}
                    placeholder={field.placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                )}
              </div>
            ))}
            
            {groupByOptions && setGroupBy && (
              <div className="mb-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Group By
                </label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="none">No Grouping</option>
                  {groupByOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={clearFilters}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FilterPanel;