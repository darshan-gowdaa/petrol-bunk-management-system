// frontend/src/utils/stateUtils.js - State management utilities

import { format } from "date-fns";

export const getInitialFormState = (type) => ({
  date: format(new Date(), "yyyy-MM-dd"),
  ...(type === "sales" && { product: "Petrol", quantity: "", price: "" }),
  ...(type === "inventory" && { name: "", currentStock: "", reorderLevel: "" }),
  ...(type === "employee" && { name: "", position: "", salary: "" }),
  ...(type === "expense" && { category: "", amount: "" }),
});

export const getInitialFilterState = (type) => ({
  dateFrom: "",
  dateTo: "",
  ...(type === "sales" && { product: "", quantityMin: "", quantityMax: "", priceMin: "", priceMax: "" }),
  ...(type === "inventory" && { name: "", stockMin: "", stockMax: "", reorderMin: "", reorderMax: "" }),
  ...(type === "employee" && { name: "", position: "", salaryMin: "", salaryMax: "" }),
  ...(type === "expense" && { category: "All", amountMin: "", amountMax: "" }),
});

export const calculateStats = (data, type) => {
  if (!data?.length)
    return {
      totalCount: 0,
      ...(type === "sales" && { totalRevenue: 0, totalQuantity: 0 }),
      ...(type === "inventory" && { itemsToReorder: 0, inStockItems: 0 }),
      ...(type === "employee" && { totalSalary: 0, averageSalary: 0 }),
      ...(type === "expense" && { totalAmount: 0, averageAmount: 0 })
    };

  const totalCount = data.length;
  if (type === "sales") {
    return {
      totalCount,
      totalRevenue: data.reduce((sum, s) => sum + (+s.total || 0), 0),
      totalQuantity: data.reduce((sum, s) => sum + (+s.quantity || 0), 0),
    };
  }
  if (type === "inventory") {
    const itemsToReorder = data.filter((i) => +i.currentStock <= +i.reorderLevel).length;
    return { totalCount, itemsToReorder, inStockItems: totalCount - itemsToReorder };
  }
  if (type === "employee") {
    const totalSalary = data.reduce((sum, e) => sum + (+e.salary || 0), 0);
    return { totalCount, totalSalary, averageSalary: totalSalary / totalCount };
  }
  if (type === "expense") {
    const totalAmount = data.reduce((sum, e) => sum + (+e.amount || 0), 0);
    return { totalCount, totalAmount, averageAmount: totalAmount / totalCount };
  }
  return { totalCount };
};

export const handleFilterRemoval = (filters, key) => {
  const newFilters = { ...filters };
  key.endsWith("Min") || key.endsWith("Max") ?
    (delete newFilters[key.replace(/(Min|Max)$/, "Min")],
      delete newFilters[key.replace(/(Min|Max)$/, "Max")]) :
    delete newFilters[key];
  return newFilters;
};
