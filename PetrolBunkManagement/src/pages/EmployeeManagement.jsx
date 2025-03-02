// src/pages/EmployeeManagement.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  Plus,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

const EmployeeManagement = () => {
  // State management
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    salary: "",
    dateAdded: new Date().toISOString().split("T")[0],
  });

  // Filter state
  const [filters, setFilters] = useState({
    name: "",
    position: "",
    salaryMin: "",
    salaryMax: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
  const applyFilters = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.position) params.append("position", filters.position);
      if (filters.salaryMin) params.append("salaryMin", filters.salaryMin);
      if (filters.salaryMax) params.append("salaryMax", filters.salaryMax);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await axios.get(
        `http://localhost:5000/api/employees?${params}`
      );
      setFilteredEmployees(response.data);
    } catch (err) {
      setError("Failed to filter employees. Please try again.");
      console.error("Error filtering employees:", err);
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      name: "",
      position: "",
      salaryMin: "",
      salaryMax: "",
      dateFrom: "",
      dateTo: "",
    });
    setFilteredEmployees(employees);
    setShowFilters(false);
  };

  // Handle form input changes for new/edit employee
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal && currentEmployee) {
      setCurrentEmployee({ ...currentEmployee, [name]: value });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  // Add new employee
  const addEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/employees",
        newEmployee
      );
      setEmployees([...employees, response.data]);
      setFilteredEmployees([...filteredEmployees, response.data]);
      setNewEmployee({
        name: "",
        position: "",
        salary: "",
        dateAdded: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
      setSuccessMessage("Employee added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to add employee. Please try again.");
      console.error("Error adding employee:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit employee
  const editEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${currentEmployee._id}`,
        currentEmployee
      );
      const updatedEmployees = employees.map((emp) =>
        emp._id === currentEmployee._id ? response.data : emp
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      setShowEditModal(false);
      setSuccessMessage("Employee updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update employee. Please try again.");
      console.error("Error updating employee:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${currentEmployee._id}`
      );
      const updatedEmployees = employees.filter(
        (emp) => emp._id !== currentEmployee._id
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      setShowDeleteModal(false);
      setSuccessMessage("Employee deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete employee. Please try again.");
      console.error("Error deleting employee:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export employee data to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Position", "Salary", "Date Added"];
    const csvData = filteredEmployees.map((emp) => [
      emp.name,
      emp.position,
      emp.salary,
      new Date(emp.dateAdded).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
{/* Header with Buttons in the Same Line */}
<div className="flex flex-wrap items-center justify-between mb-6">
  <h1 className="text-3xl font-bold text-white">Employee Management</h1>

  {/* Action Buttons */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-2 px-4 py-2 text-white bg-green-700 rounded-lg shadow-md hover:bg-green-800"
    >
      <Plus size={16} /> Add Employee
    </button>

    <button
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center gap-2 px-4 py-2 text-white bg-purple-700 rounded-lg shadow-md hover:bg-purple-800"
    >
      <Filter size={16} /> Filter
    </button>

    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 text-white bg-blue-700 rounded-lg shadow-md hover:bg-blue-800"
    >
      <Download size={16} /> Export
    </button>
  </div>
</div>


      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 mb-4 text-green-700 bg-green-100 rounded"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 mb-4 text-red-700 bg-red-100 rounded"
          >
            {error}
            <button onClick={() => setError(null)} className="float-right">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 mb-6 rounded shadow bg-gray-50"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={filters.position}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={filters.salaryMin}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={filters.salaryMax}
                    onChange={handleFilterChange}
                    className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employees Table */}
      <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                Position
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                Salary
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                Date Added
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center justify-center">
                    <RefreshCw
                      size={20}
                      className="mr-2 animate-spin dark:text-gray-300"
                    />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No employees found. Add a new employee to get started.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap dark:text-gray-300">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap dark:text-gray-300">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap dark:text-gray-300">
                    ₹{employee.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap dark:text-gray-300">
                    {new Date(employee.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentEmployee(employee);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-300 bg-blue-900 rounded-full hover:bg-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentEmployee(employee);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-300 bg-red-900 rounded-full hover:bg-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Employee
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={addEmployee}>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={newEmployee.salary}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Date Added
                  </label>
                  <input
                    type="date"
                    name="dateAdded"
                    value={newEmployee.dateAdded}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {loading && (
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                    )}
                    Add Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {showEditModal && currentEmployee && (
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Employee
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={editEmployee}>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentEmployee.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={currentEmployee.position}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={currentEmployee.salary}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Date Added
                  </label>
                  <input
                    type="date"
                    name="dateAdded"
                    value={
                      currentEmployee.dateAdded
                        ? currentEmployee.dateAdded.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {loading && (
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                    )}
                    Update Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && currentEmployee && (
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Delete Employee
                </h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="mb-6">
                Are you sure you want to delete {currentEmployee.name}? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteEmployee}
                  disabled={loading}
                  className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  {loading && (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeManagement;
