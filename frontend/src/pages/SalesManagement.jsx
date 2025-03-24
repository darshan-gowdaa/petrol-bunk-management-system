import React from "react";
import { DollarSign, BarChart2, Package } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import { formatIndianNumber } from "../utils/formatters";

const SalesManagement = () => {
  const statsConfig = [
    {
      title: "Total Sales",
      getValue: (stats) => formatIndianNumber(stats.totalCount),
      icon: BarChart2,
      color: "blue",
      footer: "Total number of sales",
    },
    {
      title: "Total Revenue",
      getValue: (stats) => `₹${formatIndianNumber(stats.totalRevenue)}`,
      icon: DollarSign,
      color: "green",
      footer: "Total revenue generated",
    },
    {
      title: "Total Quantity",
      getValue: (stats) => `${formatIndianNumber(stats.totalQuantity)}L`,
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
