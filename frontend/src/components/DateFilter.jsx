// frontend/src/components/DateFilter.jsx - Date filter component

import { Calendar } from "lucide-react";
import { useEffect, useRef } from "react";
import { DATE_RANGES, formatDateRange } from "../utils/dateUtils";

const DateFilter = ({ dateFilter, setDateFilter }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) =>
      popupRef.current && !popupRef.current.contains(e.target) &&
      setDateFilter(prev => ({ ...prev, pickerOpen: false }));

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setDateFilter]);

  const { startDate, endDate } = dateFilter.customRange;
  const today = new Date().toISOString().split('T')[0];

  const handleDateChange = (type, value) => {
    const newDate = new Date(value);
    if (isNaN(newDate.getTime())) return;

    setDateFilter(prev => ({
      ...prev,
      range: "custom",
      isCustom: true,
      isDirty: true,
      customRange: {
        ...prev.customRange,
        [`${type}Date`]: newDate
      }
    }));
  };

  const handleRangeChange = (e) => {
    const newRange = e.target.value;
    setDateFilter(prev => ({
      ...prev,
      range: newRange,
      isCustom: newRange === "custom",
      isDirty: true,
      customRange: newRange === "custom" ? prev.customRange : {
        startDate: new Date(),
        endDate: new Date()
      }
    }));
  };

  return (
    <div className="relative" ref={popupRef}>
      <div className="flex items-center gap-3">
        <select
          className="w-48 px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
          value={dateFilter.range}
          onChange={handleRangeChange}
        >
          {Object.entries(DATE_RANGES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
          <option value="custom">Custom Range</option>
        </select>

        <button
          className="flex items-center gap-2 px-4 py-2 text-white border border-gray-600 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600"
          onClick={() => setDateFilter(prev => ({ ...prev, pickerOpen: !prev.pickerOpen }))}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-sm">
            {dateFilter.isCustom
              ? formatDateRange(startDate, endDate)
              : "Select a date range"}
          </span>
        </button>
      </div>

      {dateFilter.pickerOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-[300px] flex flex-col gap-4 rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-xl">
          {["start", "end"].map((type) => (
            <div key={type} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                {type === "start" ? "Start Date" : "End Date"}
              </label>
              <input
                type="date"
                value={type === "start" ? startDate.toISOString().split('T')[0] : endDate.toISOString().split('T')[0]}
                onChange={e => handleDateChange(type, e.target.value)}
                min={type === "end" ? startDate.toISOString().split('T')[0] : undefined}
                max={type === "start" ? endDate.toISOString().split('T')[0] : today}
                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
          <button
            className="px-4 py-2 mt-2 text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            onClick={() => setDateFilter(prev => ({ ...prev, pickerOpen: false }))}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
