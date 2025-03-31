// frontend/src/pages/EmployeeManagement.jsx - Employee management page component for handling staff records
import React from "react";
import { Users, DollarSign, Calculator } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import { formatIndianNumber } from "../utils/formatters";

const EmployeeManagement = () => {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹0";
    return `₹${formatIndianNumber(parseInt(value))}`;
  };

  const statsConfig = [
    {
      title: "Total Employees",
      getValue: (stats) => formatIndianNumber(stats.totalCount || 0),
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

