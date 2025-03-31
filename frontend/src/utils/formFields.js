// frontend/src/utils/formFields.js - Form field configuration

import { format } from "date-fns";

const formatDate = (value) => (value ? format(new Date(value), "dd/MM/yyyy") : "");

export const getFormFields = (type) => {
  const dateField = { name: "date", label: "Date", type: "date", formatValue: formatDate };

  return {
    sales: [
      { name: "product", label: "Product", type: "select", options: ["Petrol", "Diesel"] },
      { name: "quantity", label: "Quantity (L)", type: "number", step: "0.01", min: "0" },
      { name: "price", label: "Price per Liter (₹)", type: "number", step: "0.01", min: "0" },
      dateField,
    ],
    inventory: [
      { name: "name", label: "Item Name", type: "text" },
      { name: "currentStock", label: "Current Stock", type: "number", min: "0" },
      { name: "reorderLevel", label: "Reorder Level", type: "number", min: "0" },
      dateField,
    ],
    employee: [
      { name: "name", label: "Name", type: "text" },
      { name: "position", label: "Position", type: "text" },
      { name: "salary", label: "Salary (₹)", type: "number", step: "0.01", min: "0" },
      { ...dateField, label: "Date Added" },
    ],
    expense: [
      { name: "category", label: "Category", type: "select", options: ["Utilities", "Rent", "Salaries", "Maintenance", "Supplies", "Other", "Add New Category"] },
      { name: "amount", label: "Amount (₹)", type: "number", min: "0", step: "0.01" },
      dateField,
    ],
  }[type] || [];
};

export const getFilterFields = (type, categories = []) => {
  const dateFields = [
    { name: "dateFrom", label: "From Date", type: "date", formatValue: formatDate },
    { name: "dateTo", label: "To Date", type: "date", formatValue: formatDate },
  ];

  return {
    sales: [
      { name: "product", label: "Product", type: "select", options: ["All", "Petrol", "Diesel"] },
      { name: "quantity", label: "Quantity Range", type: "range" },
      { name: "price", label: "Price Range", type: "range" },
      ...dateFields,
    ],
    inventory: [
      { name: "name", label: "Item Name", type: "text" },
      { name: "stock", label: "Stock Range", type: "range" },
      { name: "reorder", label: "Reorder Level Range", type: "range" },
      ...dateFields,
    ],
    employee: [
      { name: "name", label: "Name", type: "text" },
      { name: "position", label: "Position", type: "text" },
      { name: "salary", label: "Salary Range", type: "range" },
      ...dateFields,
    ],
    expense: [
      { name: "category", label: "Category", type: "select", options: ["All", ...categories] },
      { name: "amount", label: "Amount Range", type: "range" },
      ...dateFields,
    ],
  }[type] || [];
};

export const getTableColumns = (type) => {
  const dateColumn = {
    key: "date",
    label: "Date",
    render: (value) => {
      try {
        const date = new Date(value);
        return value && !isNaN(date) ? format(date, "dd/MM/yyyy") : "";
      } catch (e) {
        console.error("Date parsing error:", e);
        return "";
      }
    },
  };

  return {
    sales: [
      { key: "product", label: "Product" },
      { key: "quantity", label: "Quantity (L)", isNumber: true },
      { key: "price", label: "Price per Liter (₹)", isCurrency: true },
      { key: "total", label: "Total (₹)", isCurrency: true },
      dateColumn,
    ],
    inventory: [
      { key: "name", label: "Name" },
      { key: "currentStock", label: "Current Stock", isNumber: true },
      { key: "reorderLevel", label: "Reorder Level", isNumber: true },
      dateColumn,
    ],
    employee: [
      { key: "name", label: "Name" },
      { key: "position", label: "Position" },
      { key: "salary", label: "Salary", isCurrency: true },
      { ...dateColumn, label: "Date Added" },
    ],
    expense: [
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount", isCurrency: true },
      dateColumn,
    ],
  }[type] || [];
};
