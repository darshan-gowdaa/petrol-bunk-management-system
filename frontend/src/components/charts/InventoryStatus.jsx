import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ChartContainer from "../ChartContainer";
import CustomTooltip from "../CustomTooltip";
import { formatNumber, formatLargeNumber } from "../../utils/formatters";

const InventoryTable = ({ data }) => (
    <div className="w-full p-4 overflow-auto border rounded-lg bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/30 max-h-72 backdrop-blur-sm">
        <h3 className="mb-3 text-lg font-medium text-gray-300">Current Stock</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse shadow-md min-w-[600px]">
                <thead>
                    <tr className="text-gray-300 bg-gray-800/50">
                        <th className="p-3 text-left">Item</th>
                        <th className="p-3 text-left">Current Stock</th>
                        <th className="p-3 text-left">Reorder Level</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        const stockStatus = item.currentStock <= item.reorderLevel
                            ? { class: "bg-red-900 text-red-200", text: "Low Stock" }
                            : item.currentStock <= item.reorderLevel * 1.5
                                ? { class: "bg-yellow-900 text-yellow-200", text: "Medium Stock" }
                                : { class: "bg-green-900 text-green-200", text: "Sufficient" };
                        return (
                            <tr key={item._id} className="transition-colors border-b border-gray-700/50 hover:bg-gray-800/50">
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">{formatNumber(item.currentStock)}</td>
                                <td className="p-3">{formatNumber(item.reorderLevel)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-sm ${stockStatus.class}`}>{stockStatus.text}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

const StockLevelsChart = ({ data }) => (
    <ChartContainer title="Stock Levels">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart
                data={data.map(item => ({
                    name: item.name,
                    currentStock: item.currentStock,
                    reorderLevel: item.reorderLevel
                }))}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                barGap={0}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#fff" tick={false} height={20} />
                <YAxis stroke="#fff" tickFormatter={formatLargeNumber} />
                <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value) => [formatNumber(value), "Quantity"]}
                    contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.8)",
                        border: "1px solid #374151",
                        borderRadius: "0.5rem",
                        backdropFilter: "blur(4px)"
                    }}
                    labelFormatter={(label) => `Item: ${label}`}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Bar dataKey="reorderLevel" name="Reorder Level" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="currentStock" name="Current Stock" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const InventoryStatus = ({ inventory }) => {
    return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <InventoryTable data={inventory} />
            <StockLevelsChart data={inventory} />
        </div>
    );
};

export default InventoryStatus; 