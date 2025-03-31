// frontend/src/pages/InventoryManagement.jsx - Inventory management page component for stock control
import React from "react";
import { AlertTriangle, Package, CheckCircle } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";

const InventoryManagement = () => {
  const statsConfig = [
    {
      title: "Total Items",
      getValue: (stats) => stats.totalCount,
      icon: Package,
      color: "blue",
      footer: "Total inventory items",
    },
    {
      title: "Items to Reorder",
      getValue: (stats) => stats.itemsToReorder,
      icon: AlertTriangle,
      color: "red",
      footer: "Items below reorder level",
    },
    {
      title: "In Stock Items",
      getValue: (stats) => stats.inStockItems,
      icon: CheckCircle,
      color: "green",
      footer: "Items above reorder level",
    },
  ];

  return (
    <PageWrapper
      type="inventory"
      title="Inventory Management"
      statsConfig={statsConfig}
      additionalFields={{ nameField: "name" }}
    />
  );
};

export default InventoryManagement;
