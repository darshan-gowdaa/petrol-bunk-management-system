import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import ChartContainer from "../ChartContainer";
import CustomTooltip from "../CustomTooltip";
import { formatCurrency, formatLargeCurrency } from "../../utils/formatters";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

const ExpenseDistribution = ({ data }) => (
    <ChartContainer title="Expense Distribution">
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} formatter={(value) => [formatCurrency(value), "Amount"]} />
                <Legend
                    wrapperStyle={{ color: "#fff" }}
                    formatter={(value, entry) => `${value} (${formatLargeCurrency(entry.payload.amount)})`}
                />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const ExpenseVsIncome = ({ stats }) => (
    <ChartContainer title="Expense vs Income">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={[
                    { name: "Income", income: stats.sales, expense: 0, net: 0 },
                    { name: "Expenses", income: 0, expense: stats.expenses + stats.salaries, net: 0 },
                    {
                        name: "Net",
                        income: stats.profitLoss > 0 ? stats.profitLoss : 0,
                        expense: stats.profitLoss < 0 ? Math.abs(stats.profitLoss) : 0,
                        net: stats.profitLoss
                    }
                ]}
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis
                    stroke="#fff"
                    tickFormatter={formatLargeCurrency}
                    label={{
                        value: 'Amount (₹)',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -45,
                        style: { fill: '#fff' }
                    }}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value, name) => {
                        if (value === 0) return ['-', name];
                        return [formatCurrency(value), name];
                    }}
                    contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.8)",
                        border: "1px solid #374151",
                        borderRadius: "0.5rem",
                        backdropFilter: "blur(4px)"
                    }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} verticalAlign="top" height={36} />
                <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} stackId="stack" />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="stack" />
                <Bar
                    dataKey="net"
                    name="Net"
                    fill={stats.profitLoss >= 0 ? "#4ade80" : "#ef4444"}
                    radius={[4, 4, 0, 0]}
                    stackId="stack"
                />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const ExpenseAnalysis = ({ expenses, stats }) => {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <ExpenseDistribution data={expenses} />
            <ExpenseVsIncome stats={stats} />
        </div>
    );
};

export default ExpenseAnalysis; 