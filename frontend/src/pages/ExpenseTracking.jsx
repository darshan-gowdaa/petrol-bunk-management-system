// frontend/src/pages/ExpenseTracking.jsx - Expense tracking page component for managing costs
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import PageWrapper from "../components/layout/PageWrapper";
import {fetchData,createItem,updateItem, deleteItem,fetchFilteredData,} from "../utils/apiUtils";

const ExpenseTracking = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData("expenses")
      .then(expenses => setCategories([...new Set(expenses.map(exp => exp.category))].filter(Boolean)))
      .catch(console.error);
  }, []);

  return (
    <PageWrapper
      type="expense"
      title="Expense Tracking"
      additionalFields={{ categories, nameField: "category" }}
      onDataUpdate={newData => setCategories(
        newData.categories || [...new Set(newData.map(exp => exp.category))].filter(Boolean)
      )}
    />
  );
};

export default ExpenseTracking;
