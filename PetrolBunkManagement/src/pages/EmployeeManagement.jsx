import React, { useState, useEffect } from "react";
import { Users, DollarSign, Calculator } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderWithActions from "../components/HeaderWithActions";
import { exportToCSV } from "../utils/ExportToCSV";
import Filters from "../PagesModals/Filters";
import StatsCard from "../PagesModals/StatsCard";
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
    totalSalary: 0,
    averageSalary: 0,
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

    // Calculate total salary
    const totalSalary = employeeData.reduce(
      (sum, emp) => sum + Number(emp.salary),
      0
    );

    // Average salary
    const average = totalSalary / total;

    setStats({
      totalEmployees: total,
      totalSalary: totalSalary.toFixed(0),
      averageSalary: average.toFixed(0),
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
  const handleExportEmployees = () => {
    const headers = [
      { key: "name", label: "Name" },
      { key: "position", label: "Position" },
      { key: "salary", label: "Salary" },
      { key: "dateAdded", label: "Date Added" },
    ];
    exportToCSV(filteredEmployees, headers, "employees");
  };

  return (
    <div className="container px-4 py-8 mx-auto transition-all duration-300 animate-fadeIn">
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
        onExport={handleExportEmployees}
        addLabel="Add Employee"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          color="blue"
          footer={`Active workforce`}
        />

        <StatsCard
          title="Total Salary"
          value={`₹${parseInt(stats.totalSalary).toLocaleString()}`}
          icon={DollarSign}
          color="green"
          footer={`Monthly payout`}
        />

        <StatsCard
          title="Average Salary"
          value={`₹${parseInt(stats.averageSalary).toLocaleString()}`}
          icon={Calculator}
          color="purple"
          footer={`Per employee`}
        />
      </div>

      {/* Filter Panel */}
      <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        fields={employeeFields}
        title="Filter Employees"
      />

      {/* Employees Table */}
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "position", label: "Position" },
          {
            key: "salary",
            label: "Salary",
            render: (value) => `₹${parseInt(value).toLocaleString()}`,
          },
          {
            key: "dateAdded",
            label: "Date Added",
            render: (value) => new Date(value).toLocaleDateString(),
          },
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
