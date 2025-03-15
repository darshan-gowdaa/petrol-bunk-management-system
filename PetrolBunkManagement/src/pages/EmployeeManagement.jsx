// src/pages/EmployeeManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  Plus,
  RefreshCw,
  Users,
  DollarSign,
  Award,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderWithActions from "../components/HeaderWithActions";
import Table from "../PagesModals/Tables";
import AddModalForm from "../PagesModals/AddModalForm";
import EditModalForm from "../PagesModals/EditModalForm";
import DeleteRow from "../PagesModals/DeleteRow";


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

  const employeeFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "position", label: "Position", type: "text" },
    {
      name: "salary",
      label: "Salary (₹)",
      type: "number",
      step: "0.01",
      min: "0",
    },
    { name: "dateAdded", label: "Date Added", type: "date" },
  ];

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

  // Stats
  const [stats, setStats] = useState({
    totalEmployees: 0,
    averageSalary: 0,
    topPosition: "",
    newestEmployee: "",
  });

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
      setFilteredEmployees(response.data);
      calculateStats(response.data);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
      toast.error("Failed to fetch employees. Please try again.");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = (employeeData) => {
    if (!employeeData.length) return;

    // Total employees
    const total = employeeData.length;

    // Average salary
    const totalSalary = employeeData.reduce(
      (sum, emp) => sum + Number(emp.salary),
      0
    );
    const average = totalSalary / total;

    // Most common position
    const positions = {};
    employeeData.forEach((emp) => {
      positions[emp.position] = (positions[emp.position] || 0) + 1;
    });
    let topPosition = "";
    let maxCount = 0;
    Object.entries(positions).forEach(([position, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPosition = position;
      }
    });

    // Newest employee
    const sortedByDate = [...employeeData].sort(
      (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
    );
    const newest = sortedByDate.length ? sortedByDate[0].name : "";

    setStats({
      totalEmployees: total,
      averageSalary: average.toFixed(0),
      topPosition,
      newestEmployee: newest,
    });
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
      toast.error("Failed to filter employees. Please try again.");
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
      toast.success("Employee added successfully!");
      calculateStats([...employees, response.data]);
    } catch (err) {
      setError("Failed to add employee. Please try again.");
      toast.error("Failed to add employee. Please try again.");
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
      toast.success("Employee updated successfully!");
      calculateStats(updatedEmployees);
    } catch (err) {
      setError("Failed to update employee. Please try again.");
      toast.error("Failed to update employee. Please try again.");
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
      toast.success("Employee deleted successfully!");
      calculateStats(updatedEmployees);
    } catch (err) {
      setError("Failed to delete employee. Please try again.");
      toast.error("Failed to delete employee. Please try again.");
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
      {/* Toast Container */}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <HeaderWithActions
        title="Employee Management"
        onAdd={() => setShowAddModal(true)}
        onFilter={() => setShowFilters(!showFilters)}
        onExport={exportToCSV}
        addLabel="Add Employee"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Employees Card */}
        <div className="p-4 transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-blue-300 bg-blue-900 rounded-full">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Total Employees
              </p>
              <p className="text-2xl font-semibold text-white">
                {stats.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        {/* Average Salary Card */}
        <div className="p-4 transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-green-300 bg-green-900 rounded-full">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Average Salary
              </p>
              <p className="text-2xl font-semibold text-white">
                ₹{parseInt(stats.averageSalary).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Top Position Card */}
        <div className="p-4 transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-purple-300 bg-purple-900 rounded-full">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Top Position</p>
              <p className="text-2xl font-semibold text-white">
                {stats.topPosition || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Newest Employee Card */}
        <div className="p-4 transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-red-300 bg-red-900 rounded-full">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Newest Employee
              </p>
              <p className="text-2xl font-semibold text-white">
                {stats.newestEmployee || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 mb-6 text-white bg-gray-800 rounded shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-gray-900 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Position</label>
              <input
                type="text"
                name="position"
                value={filters.position}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-gray-900 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Min Salary</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={filters.salaryMin}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-gray-900 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Max Salary</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={filters.salaryMax}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-gray-900 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-gray-900 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-gray-900 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-200 bg-gray-700 rounded hover:bg-gray-600"
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
        </div>
      )}

      {/* Employees Table */}
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "position", label: "Position" },
          { key: "salary", label: "Salary", render: (value) => `₹${parseInt(value).toLocaleString()}` },
          { key: "dateAdded", label: "Date Added", render: (value) => new Date(value).toLocaleDateString() },
        ]}
        data={filteredEmployees}
        loading={loading}
        onEdit={(employee) => {
          setCurrentEmployee(employee);
          setShowEditModal(true);
        }}
        onDelete={(employee) => {
          setCurrentEmployee(employee);
          setShowDeleteModal(true);
        }}
      />


      <AddModalForm
        show={showAddModal}
        title="Add New Employee"
        fields={employeeFields}
        formData={newEmployee}
        onChange={handleInputChange}
        onSubmit={addEmployee}
        onCancel={() => setShowAddModal(false)}
        loading={loading}
      />

      {/* Edit Employee Modal */}
      <EditModalForm
        showEditModal={showEditModal}
        currentData={currentEmployee}
        setShowEditModal={setShowEditModal}
        handleInputChange={handleInputChange}
        loading={loading}
        editFunction={editEmployee}
        entityType="Employees"
      />

      {/* Delete Confirmation Modal */}
      <DeleteRow
        show={showDeleteModal}
        item={currentEmployee}
        itemType="Employee"
        itemName={currentEmployee?.name}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={deleteEmployee}
        loading={loading}
      />
    </div>
  );
};

export default EmployeeManagement;
