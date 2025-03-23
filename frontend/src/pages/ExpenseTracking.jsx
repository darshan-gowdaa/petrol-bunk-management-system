// PetrolBunkManagement/src/pages/ExpenseTracking.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle, Package, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageWrapper from "../components/layout/PageWrapper";
import {
  fetchData,
  createItem,
  updateItem,
  deleteItem,
  fetchFilteredData,
} from "../utils/apiUtils";

const ExpenseTracking = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from existing expenses
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const expenses = await fetchData("expenses");
        const uniqueCategories = [
          ...new Set(expenses.map((exp) => exp.category)),
        ].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const statsConfig = [
    {
      title: "Total Expenses",
      getValue: (stats) => `₹${stats.totalAmount?.toLocaleString() || "0"}`,
      icon: Package,
      color: "indigo",
      footer: "Total expenditure",
    },
    {
      title: "Total Entries",
      getValue: (stats) => stats.totalCount || 0,
      icon: CheckCircle,
      color: "green",
      footer: "Number of transactions",
    },
    {
      title: "Average Expense",
      getValue: (stats) => `₹${stats.averageAmount?.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
      color: "blue",
      footer: "Per transaction",
    },
  ];

  const handleCategoryUpdate = (newData) => {
    const uniqueCategories = [
      ...new Set(newData.map((exp) => exp.category)),
    ].filter(Boolean);
    setCategories(uniqueCategories);
  };

  return (
    <PageWrapper
      type="expense"
      title="Expense Tracking"
      statsConfig={statsConfig}
      additionalFields={{
        categories,
        nameField: "category",
        showNewCategoryInput: true,
      }}
      onDataUpdate={handleCategoryUpdate}
    />
  );
};

export default ExpenseTracking;
