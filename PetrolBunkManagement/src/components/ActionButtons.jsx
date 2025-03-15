import { RefreshCw } from "lucide-react";

const ActionButtons = ({ onCancel, submitText, loading, showNewCategoryInput = false }) => {
  return (
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
            {submitText.includes("Update") ? "Updating..." : "Saving..."}
          </span>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
