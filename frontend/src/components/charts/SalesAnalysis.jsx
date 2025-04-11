import React from "react";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";
import ChartContainer from "../ChartContainer";
import CustomTooltip from "../CustomTooltip";
import { formatCurrency, formatLargeCurrency, formatQuantityInKL } from "../../utils/formatters";

const SalesAnalysis = ({ data }) => {
    return (
        <ChartContainer title="Sales by Product">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="product" stroke="#fff" dy={5} />
                    <YAxis yAxisId="left" stroke="#3b82f6" tickFormatter={formatLargeCurrency} />
                    <YAxis yAxisId="quantity" orientation="right" stroke="#10b981" tickFormatter={formatQuantityInKL} />
                    <YAxis yAxisId="price" orientation="right" stroke="#f59e0b" tickFormatter={formatCurrency} axisLine={false} tickLine={false} />
                    <Tooltip
                        content={<CustomTooltip />}
                        formatter={(value, name) => {
                            if (name === "Revenue (₹)") return [formatCurrency(value), name];
                            if (name === "Quantity (L)") return [formatQuantityInKL(value), name];
                            if (name === "Avg Price (₹/L)") return [formatCurrency(value), name];
                            return [value, name];
                        }}
                        contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.8)",
                            border: "1px solid #374151",
                            borderRadius: "0.5rem",
                            backdropFilter: "blur(4px)"
                        }}
                    />
                    <Legend wrapperStyle={{ color: "#fff" }} verticalAlign="top" height={36} />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="quantity" dataKey="quantity" name="Quantity (L)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="price" type="monotone" dataKey="avgPrice" name="Avg Price (₹/L)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} />
                </ComposedChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default SalesAnalysis; 