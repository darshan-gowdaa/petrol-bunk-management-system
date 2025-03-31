// frontend/src/components/DateFilter.jsx - Date filter component

import { Calendar } from "lucide-react";
import { useEffect, useRef } from "react";

const DATE_RANGES = {
  today: "Today",
  yesterday: "Yesterday",
  week: "Last 7 days",
  month: "Last 30 days",
  quarter: "Last 90 days",
  year: "Last 365 days",
  all: "All time"
};

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

  return (
    <div className="relative" ref={popupRef}>
      <div className="flex items-center gap-3">
        <select
          className="w-48 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          value={dateFilter.range}
          onChange={e => setDateFilter(prev => ({ ...prev, range: e.target.value, isCustom: false }))}
        >
          {Object.entries(DATE_RANGES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
          {dateFilter.isCustom && <option value="custom">Custom Range</option>}
        </select>

        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-white bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600"
          onClick={() => setDateFilter(prev => ({ ...prev, pickerOpen: !prev.pickerOpen }))}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-sm">
            {dateFilter.isCustom 
              ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
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
                onChange={e => setDateFilter(prev => ({
                  ...prev,
                  range: "custom",
                  isCustom: true,
                  customRange: { 
                    ...prev.customRange,
                    [`${type}Date`]: new Date(e.target.value)
                  }
                }))}
                min={type === "end" ? startDate.toISOString().split('T')[0] : undefined}
                max={today}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
          <button
            className="mt-2 rounded-lg px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
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
