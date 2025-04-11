import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ChartContainer from "../ChartContainer";
import CustomTooltip from "../CustomTooltip";
import { formatLargeCurrency } from "../../utils/formatters";

const SalesTrend = ({ data }) => {
    return (
        <ChartContainer title="Sales Trend">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#fff" />
                    <YAxis stroke="#fff" tickFormatter={formatLargeCurrency} />
                    <Tooltip
                        content={<CustomTooltip />}
                        contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.8)",
                            border: "1px solid #374151",
                            borderRadius: "0.5rem",
                            backdropFilter: "blur(4px)"
                        }}
                    />
                    <Legend wrapperStyle={{ color: "#fff" }} verticalAlign="top" height={36} />
                    <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#3b82f6" fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="quantity" name="Quantity (L)" stroke="#10b981" fill="url(#colorQuantity)" />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default SalesTrend; 