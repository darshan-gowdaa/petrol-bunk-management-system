import React from "react";
import { DollarSign, BarChart2, Package } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";

const SalesManagement = () => {
  const statsConfig = [
    {
      title: "Total Sales",
      getValue: (stats) => stats.totalCount,
      icon: BarChart2,
      color: "blue",
      footer: "Total number of sales",
    },
    {
      title: "Total Revenue",
      getValue: (stats) => `₹${stats.totalRevenue?.toFixed(2)}`,
      icon: DollarSign,
      color: "green",
      footer: "Total revenue generated",
    },
    {
      title: "Total Quantity",
      getValue: (stats) => `${stats.totalQuantity?.toFixed(2)}L`,
      icon: Package,
      color: "purple",
      footer: "Total quantity sold",
    },
  ];

  return (
    <PageWrapper
      type="sales"
      title="Sales Management"
      statsConfig={statsConfig}
    />
  );
};

export default SalesManagement;
