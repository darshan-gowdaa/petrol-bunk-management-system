import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="p-3 text-white bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <p className="mb-2 text-gray-300">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
