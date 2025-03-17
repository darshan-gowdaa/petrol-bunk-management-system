import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Edit, Trash2, Eye } from "lucide-react";

const Table = ({ 
  columns, 
  data,
  loadMore,
  loading, 
  hasMore = false,
  onEdit, 
  onDelete, 
  onView,
  emptyStateMessage = "No records found. Add a new entry to get started."
}) => {
  const observerRef = useRef(null);
  const loaderRef = useRef(null);
  
  useEffect(() => {
    // Setup IntersectionObserver for infinite scroll
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver(handleObserver, options);
    
    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, loading, hasMore]);
  
  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  };

  return (
    <div className="overflow-hidden bg-gray-900 rounded-lg shadow-lg">
      {/* Header with entry count */}
      <div className="flex items-center justify-between px-4 py-3 bg-transparent border-b border-gray-700 ">
        <h2 className="text-lg font-medium text-white">Records</h2>
        <div className="px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md">
          Showing {data.length} entries
        </div>
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:block overflow-auto max-h-[calc(100vh-12rem)]">
        <div className="min-w-full">
          {/* Table header */}
          <div className="sticky top-0 z-10 grid min-w-full bg-gray-800 border-b border-gray-700" 
               style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(100px, 1fr)) 100px` }}>
            {columns.map((col) => (
              <div
                key={col.key}
                className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase"
              >
                {col.label}
              </div>
            ))}
            <div className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-300 uppercase">
              Actions
            </div>
          </div>
          
          {/* Table body */}
          <div className="bg-gray-800 divide-y divide-gray-700">
            {data.length === 0 && !loading ? (
              <div className="px-4 py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <p className="text-lg text-gray-400">{emptyStateMessage}</p>
                </div>
              </div>
            ) : (
              data.map((item) => (
                <div key={item._id} className="grid min-w-full transition-colors hover:bg-gray-700 group" 
                     style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(100px, 1fr)) 100px` }}>
                  {columns.map((col) => (
                    <div key={col.key} className="px-4 py-3 overflow-hidden text-gray-300 text-ellipsis">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </div>
                  ))}
                  <div className="flex items-center justify-end px-4 py-3 space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="p-1.5 text-blue-300 bg-blue-900/30 rounded-full hover:bg-blue-800/50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-emerald-300 bg-emerald-900/30 rounded-full hover:bg-emerald-800/50 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-1.5 text-red-300 bg-red-900/30 rounded-full hover:bg-red-800/50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div ref={loaderRef} className="px-4 py-4 text-center text-gray-400 col-span-full">
                <div className="flex items-center justify-center">
                  <RefreshCw size={20} className="mr-2 text-gray-300 animate-spin" />
                  Loading more...
                </div>
              </div>
            )}
            
            {/* Initial loading state */}
            {loading && data.length === 0 && (
              <div className="px-4 py-4 text-center text-gray-400 col-span-full">
                <div className="flex items-center justify-center">
                  <RefreshCw size={20} className="mr-2 text-gray-300 animate-spin" />
                  Loading...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden overflow-auto max-h-[calc(100vh-12rem)]">
        {data.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-400">
            {emptyStateMessage}
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {data.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-200 truncate max-w-[70%]">
                    {item[columns[0]?.key]}
                  </div>
                  <div className="flex items-center space-x-1">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="p-1.5 text-blue-300 bg-blue-900/30 rounded-full hover:bg-blue-800/50"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-emerald-300 bg-emerald-900/30 rounded-full hover:bg-emerald-800/50"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-1.5 text-red-300 bg-red-900/30 rounded-full hover:bg-red-800/50"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {columns.slice(1).map((col) => (
                  <div key={col.key} className="grid grid-cols-2 gap-2 py-1 text-sm">
                    <div className="text-gray-400">{col.label}:</div>
                    <div className="overflow-hidden text-gray-300 text-ellipsis">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        
        {/* Mobile loading indicator */}
        {(loading || hasMore) && (
          <div ref={loaderRef} className="flex justify-center p-4">
            <div className="flex items-center">
              <RefreshCw size={16} className="mr-2 text-gray-300 animate-spin" />
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;