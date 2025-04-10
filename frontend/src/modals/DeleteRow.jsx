import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

const DeleteRow = ({ show, item, onCancel, onDelete, loading, itemName }) => {
  if (!show || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalFadeIn">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-modalFadeIn" />
      <div className="relative w-full max-w-md p-6 bg-gray-900 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3),0_0_10px_rgba(255,255,255,0.1)] border border-gray-800/50 animate-modalSlideIn">
        <div className="flex justify-center mb-4 text-red-500">
          <AlertTriangle size={48} />
        </div>
        <h3 className="mb-4 text-xl font-bold text-center text-white">Confirm Delete</h3>
        <p className="mb-6 text-center text-gray-300">
          Are you sure you want to delete
          {itemName && <strong> "{itemName}"</strong>}? <br />
          This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel}
            className="px-4 py-2 font-medium text-white transition duration-200 bg-gray-700 rounded-lg hover:bg-gray-600 hover:scale-105 active:scale-95">
            Cancel
          </button>
          <button onClick={onDelete} disabled={loading}
            className="px-4 py-2 font-medium text-white transition duration-200 bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 active:scale-95">
            {loading ? (
              <span className="flex items-center">
                <RefreshCw size={18} className="mr-2 animate-spin" />Deleting...
              </span>
            ) : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRow;
