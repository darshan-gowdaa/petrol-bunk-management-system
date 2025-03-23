import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { toast } from "react-toastify";

const DateFilter = ({ dateFilter, setDateFilter }) => {
  const handleDateRangeChange = (range) => {
    setDateFilter((prev) => ({ ...prev, range, isCustom: false }));
  };

  const applyCustomDateRange = () => {
    setDateFilter((prev) => ({
      ...prev,
      isCustom: true,
      range: "custom",
      pickerOpen: false,
    }));
    toast.info(
      `Showing data from ${dateFilter.customRange.startDate.toLocaleDateString()} to ${dateFilter.customRange.endDate.toLocaleDateString()}`
    );
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={dateFilter.range}
        onChange={(e) => handleDateRangeChange(e.target.value)}
        className="p-2 text-white bg-gray-700 border border-gray-600 rounded-lg"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">Last 7 Days</option>
        <option value="month">Last Month</option>
        <option value="quarter">Last Quarter</option>
        <option value="year">Last Year</option>
        {dateFilter.isCustom && <option value="custom">Custom Range</option>}
      </select>
      <button
        onClick={() =>
          setDateFilter((prev) => ({ ...prev, pickerOpen: !prev.pickerOpen }))
        }
        className="flex items-center gap-2 p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        <Calendar size={16} /> <span>Custom Date</span>
      </button>

      {dateFilter.pickerOpen && (
        <div className="absolute z-20 p-4 bg-gray-700 rounded-lg shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Start Date
                </label>
                <DatePicker
                  selected={dateFilter.customRange.startDate}
                  onChange={(date) =>
                    setDateFilter((prev) => ({
                      ...prev,
                      customRange: { ...prev.customRange, startDate: date },
                    }))
                  }
                  className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-lg"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  End Date
                </label>
                <DatePicker
                  selected={dateFilter.customRange.endDate}
                  onChange={(date) =>
                    setDateFilter((prev) => ({
                      ...prev,
                      customRange: { ...prev.customRange, endDate: date },
                    }))
                  }
                  className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-lg"
                  dateFormat="dd/MM/yyyy"
                  minDate={dateFilter.customRange.startDate}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setDateFilter((prev) => ({ ...prev, pickerOpen: false }))
                }
                className="px-3 py-1 text-gray-300 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={applyCustomDateRange}
                className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-500"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
