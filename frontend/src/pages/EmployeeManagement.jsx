import React from "react";
import { Users, DollarSign, Calculator } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";

const EmployeeManagement = () => {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹0";
    return `₹${parseInt(value).toLocaleString()}`;
  };

  const statsConfig = [
    {
      title: "Total Employees",
      getValue: (stats) => stats.totalCount || 0,
      icon: Users,
      color: "blue",
      footer: "Active workforce",
    },
    {
      title: "Total Salary",
      getValue: (stats) => formatCurrency(stats.totalSalary),
      icon: DollarSign,
      color: "green",
      footer: "Monthly payout",
    },
    {
      title: "Average Salary",
      getValue: (stats) => formatCurrency(stats.averageSalary),
      icon: Calculator,
      color: "purple",
      footer: "Per employee",
    },
  ];

  return (
    <PageWrapper
      type="employee"
      title="Employee Management"
      statsConfig={statsConfig}
      additionalFields={{
        nameField: "name",
        formatters: {
          salary: (value) => formatCurrency(value),
        },
      }}
    />
  );
};

export default EmployeeManagement;
