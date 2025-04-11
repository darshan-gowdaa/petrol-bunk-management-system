/*Utility functions for business analytics calculations*/
export const calculateSalesByProduct = (sales) => {
    return Object.values(sales.reduce((acc, sale) => {
        if (!acc[sale.product]) {
            acc[sale.product] = {
                product: sale.product,
                quantity: 0,
                revenue: 0,
                count: 0,
                avgPrice: 0
            };
        }
        acc[sale.product].quantity += Number(sale.quantity) || 0;
        acc[sale.product].revenue += Number(sale.total) || 0;
        acc[sale.product].count += 1;
        acc[sale.product].avgPrice = acc[sale.product].revenue / (acc[sale.product].quantity || 1);
        return acc;
    }, {}));
};

/*Calculates sales trend data*/
export const calculateSalesTrend = (sales) => {
    return Object.values(sales.reduce((acc, sale) => {
        const date = new Date(sale.date);
        if (isNaN(date)) return acc;
        const dateStr = date.toLocaleDateString();
        if (!acc[dateStr]) {
            acc[dateStr] = {
                date: dateStr,
                revenue: 0,
                quantity: 0,
                transactions: 0
            };
        }
        acc[dateStr].revenue += Number(sale.total) || 0;
        acc[dateStr].quantity += Number(sale.quantity) || 0;
        acc[dateStr].transactions += 1;
        return acc;
    }, {}))
        .map(item => ({
            ...item,
            avgTransactionValue: item.transactions > 0 ? item.revenue / item.transactions : 0
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/*Calculates expenses by category*/
export const calculateExpensesByCategory = (expenses) => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    return Object.values(expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = {
                category: expense.category,
                amount: 0,
                count: 0
            };
        }
        acc[expense.category].amount += Number(expense.amount) || 0;
        acc[expense.category].count += 1;
        return acc;
    }, {}))
        .map(item => ({
            ...item,
            percentage: totalExpenses > 0 ? ((item.amount / totalExpenses) * 100).toFixed(1) : "0.0"
        }))
        .filter(item => item.amount > 0);
};

/* Calculates business statistics*/
export const calculateBusinessStats = (data) => {
    const totalSales = data.sales.reduce((sum, item) => sum + item.revenue, 0);
    const totalQuantity = data.sales.reduce((sum, item) => sum + item.quantity, 0);
    const totalInventory = data.inventory.reduce((sum, item) => sum + item.currentStock, 0);
    const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalSalaries = data.employees.reduce((sum, emp) => sum + emp.salary, 0);
    const totalTransactions = data.sales.reduce((sum, item) => sum + item.count, 0);
    const totalProfitLoss = totalSales - totalExpenses - totalSalaries;

    return {
        sales: totalSales,
        quantity: totalQuantity,
        inventory: totalInventory,
        expenses: totalExpenses,
        salaries: totalSalaries,
        transactions: totalTransactions,
        lowStockItems: data.inventory.filter(item => item.currentStock <= item.reorderLevel).length,
        totalEmployees: data.employees.length,
        profitLoss: totalProfitLoss,
        profitMargin: ((totalProfitLoss / (totalSales || 1)) * 100).toFixed(1),
        avgSaleValue: totalSales / (totalTransactions || 1),
        inventoryTurnover: (totalQuantity / (totalInventory || 1)).toFixed(2)
    };
}; 