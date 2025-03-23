import React from "react";
import { ResponsiveContainer } from "recharts";

const ChartContainer = ({ title, children, height = 80 }) => (
  <div className={`p-4 bg-gray-800 rounded-lg h-72 md:h-${height}`}>
    <h3 className="mb-3 text-lg font-medium text-gray-300">{title}</h3>
    <ResponsiveContainer width="100%" height="90%">
      {children}
    </ResponsiveContainer>
  </div>
);

export default ChartContainer;
