import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Plus, RefreshCw, Download } from 'lucide-react';
import ActionButton from './ActionButton';

const PageHeader = ({ 
  title,
  onAddNew, 
  onRefresh, 
  onExport = null,
  onToggleFilters,
  showFilters,
  buttonVariants
}) => {
  return (
    <div className="flex flex-col mb-6 md:flex-row md:justify-between md:items-center">
      <h1 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">{title}</h1>
      
      <div className="flex flex-wrap gap-2">
        <ActionButton
          onClick={onToggleFilters}
          icon={<Filter size={16} />}
          text={showFilters ? "Hide Filters" : "Show Filters"}
          buttonVariants={buttonVariants}
          className={`${showFilters ? 'bg-gray-600' : 'bg-gray-500'} text-white hover:bg-gray-700`}
        />
        
        <ActionButton
          onClick={onRefresh}
          icon={<RefreshCw size={16} />}
          text="Refresh"
          buttonVariants={buttonVariants}
          className="text-white bg-green-600 hover:bg-green-700"
        />
        
        {onExport && (
          <ActionButton
            onClick={onExport}
            icon={<Download size={16} />}
            text="Export"
            buttonVariants={buttonVariants}
            className="text-white bg-purple-600 hover:bg-purple-700"
          />
        )}
        
        <ActionButton
          onClick={onAddNew}
          icon={<Plus size={16} />}
          text="Add New"
          buttonVariants={buttonVariants}
          className="text-white bg-blue-600 hover:bg-blue-700"
        />
      </div>
    </div>
  );
};

export default PageHeader;