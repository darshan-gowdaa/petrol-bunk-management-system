// frontend/src/pages/InventoryManagement.jsx - Inventory management page component for stock control
import React from "react";
import PageWrapper from "../components/layout/PageWrapper";

const InventoryManagement = () => {
  return (
    <PageWrapper
      type="inventory"
      title="Inventory Management"
      additionalFields={{ nameField: "name" }}
    />
  );
};

export default InventoryManagement;
