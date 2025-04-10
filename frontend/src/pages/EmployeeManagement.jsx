// frontend/src/pages/EmployeeManagement.jsx - Employee management page component for handling staff records
import React from "react";
import PageWrapper from "../components/layout/PageWrapper";

const EmployeeManagement = () => {
  return (
    <PageWrapper
      type="employee"
      title="Employee Management"
      additionalFields={{
        nameField: "name",
        formatters: {
          salary: (value) => `₹${value.toLocaleString()}`,
        },
      }}
    />
  );
};

export default EmployeeManagement;

