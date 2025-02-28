import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Download, Filter, X, Plus, RefreshCw } from 'lucide-react';

const EmployeeManagement = () => {
  // State management
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    salary: '',
    dateAdded: new Date().toISOString().split('T')[0],
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [alert, setAlert] = useState({ message: '', visible: false });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    position: '',
    salaryMin: '',
    salaryMax: '',
    dateFrom: '',
    dateTo: '',
  });
  const [groupBy, setGroupBy] = useState('none');

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
    exit: { opacity: 0, height: 0 }
  };
  
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  // Fetch and filter data
  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, filters, groupBy]);

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    return new Date(dateString).toISOString().split('T')[0];
  };

  const getEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedEmployees = data.map(emp => ({
          ...emp,
          dateAdded: formatDate(emp.dateAdded || emp.createdAt)
        }));
        setEmployees(formattedEmployees);
        setFilteredEmployees(formattedEmployees);
      } else {
        setEmployees([]);
        setFilteredEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showAlert('Failed to fetch employees.');
    }
  };

  const applyFilters = () => {
    let results = [...employees];

    // Apply text and numeric filters
    if (filters.name) {
      results = results.filter(emp => emp.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.position) {
      results = results.filter(emp => emp.position.toLowerCase().includes(filters.position.toLowerCase()));
    }
    if (filters.salaryMin) {
      results = results.filter(emp => emp.salary >= Number(filters.salaryMin));
    }
    if (filters.salaryMax) {
      results = results.filter(emp => emp.salary <= Number(filters.salaryMax));
    }

    // Apply date filters
    if (filters.dateFrom) {
      results = results.filter(emp => new Date(emp.dateAdded) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      results = results.filter(emp => new Date(emp.dateAdded) <= new Date(filters.dateTo));
    }

    // Apply grouping
    if (groupBy !== 'none') {
      const grouped = {};
      results.forEach(emp => {
        let key = emp[groupBy];
        
        if (groupBy === 'dateAdded' && key) {
          key = new Date(key).toLocaleDateString();
        }
        
        const groupKey = key || 'Unspecified';
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(emp);
      });
      
      const groupedResults = [];
      Object.entries(grouped).forEach(([group, emps]) => {
        emps.forEach(emp => groupedResults.push({...emp, groupHeader: group}));
      });
      
      setFilteredEmployees(groupedResults);
    } else {
      setFilteredEmployees(results);
    }
  };

  // CRUD operations
  const addEmployee = async () => {
    if (newEmployee.name && newEmployee.position && newEmployee.salary > 0) {
      try {
        const employeeData = {
          ...newEmployee,
          dateAdded: newEmployee.dateAdded || formatDate(new Date())
        };
        
        const response = await fetch('http://localhost:5000/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData),
        });
        const data = await response.json();
        
        setEmployees([...employees, {...data, dateAdded: formatDate(data.dateAdded || data.createdAt)}]);
        resetForm();
        showAlert('Employee added successfully!');
      } catch (error) {
        console.error('Error adding employee:', error);
        showAlert('Failed to add employee.');
      }
    } else {
      showAlert('All fields are required and salary must be greater than 0!');
    }
  };

  const editEmployee = async () => {
    if (editingEmployeeId && newEmployee.name && newEmployee.position && newEmployee.salary > 0) {
      try {
        const updatedData = {
          ...newEmployee,
          dateAdded: newEmployee.dateAdded || formatDate(new Date())
        };
        
        const response = await fetch(`http://localhost:5000/api/employees/${editingEmployeeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        const data = await response.json();
        
        setEmployees(
          employees.map((emp) => emp._id === editingEmployeeId ? 
            {...data, dateAdded: formatDate(data.dateAdded || data.createdAt)} : emp
          )
        );
        resetForm();
        showAlert('Employee updated successfully!');
      } catch (error) {
        console.error('Error updating employee:', error);
        showAlert('Failed to update employee.');
      }
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' });
      setEmployees(employees.filter((emp) => emp._id !== id));
      showAlert('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      showAlert('Failed to delete employee.');
    }
  };

  // UI helper functions
  const resetForm = () => {
    setNewEmployee({ 
      name: '', 
      position: '', 
      salary: '', 
      dateAdded: formatDate(new Date())
    });
    setEditingEmployeeId(null);
  };

  const handleEditClick = (employee) => {
    setNewEmployee({ 
      name: employee.name, 
      position: employee.position, 
      salary: employee.salary,
      dateAdded: formatDate(employee.dateAdded || employee.createdAt)
    });
    setEditingEmployeeId(employee._id);
  };

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: '', visible: false }), 3000);
  };

  const generateCSV = () => {
    let csv = 'Name,Position,Salary,Date Added\n';
    filteredEmployees.forEach(emp => {
      if (!emp.groupHeader || emp.groupHeader === filteredEmployees[0]?.groupHeader) {
        csv += `"${emp.name}","${emp.position}",${emp.salary},"${emp.dateAdded}"\n`;
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'employees.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      position: '',
      salaryMin: '',
      salaryMax: '',
      dateFrom: '',
      dateTo: '',
    });
    setGroupBy('none');
  };

  // Render table rows with group headers
  const renderTableRows = () => {
    let currentGroup = null;
    return filteredEmployees.map((employee, index) => {
      const rows = [];
      
      if (groupBy !== 'none' && employee.groupHeader !== currentGroup) {
        currentGroup = employee.groupHeader;
        rows.push(
          <tr key={`group-${employee.groupHeader}`} className="bg-gradient-to-r from-indigo-800 to-purple-800">
            <td colSpan="5" className="p-2 font-bold text-center text-white">
              {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}: {employee.groupHeader}
            </td>
          </tr>
        );
      }
      
      rows.push(
        <motion.tr
          key={employee._id}
          custom={index}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tableRowVariants}
          className="transition-colors border-b border-gray-700 hover:bg-gray-900/50"
        >
          <td className="p-3">{employee.name}</td>
          <td className="p-3">{employee.position}</td>
          <td className="p-3">₹{employee.salary.toFixed(2)}</td>
          <td className="p-3">{new Date(employee.dateAdded).toLocaleDateString()}</td>
          <td className="p-3 text-center">
            <div className="flex justify-center space-x-2">
              <motion.button 
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleEditClick(employee)} 
                className="p-2 text-gray-800 transition-colors bg-yellow-400 rounded-full hover:bg-yellow-500"
                aria-label="Edit employee"
              >
                <Edit size={16} />
              </motion.button>
              <motion.button 
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => deleteEmployee(employee._id)} 
                className="p-2 text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
                aria-label="Delete employee"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </td>
        </motion.tr>
      );
      
      return rows;
    }).flat();
  };

  return (
    <div className="max-w-6xl p-6 mx-auto rounded-lg shadow-xl bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-bold text-center text-transparent text-white bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        Employee Management
      </motion.h1>

      <AnimatePresence>
        {alert.visible && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed z-50 p-4 text-center text-white transform -translate-x-1/2 rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 bottom-4 left-1/2"
          >
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-5"
      >
        <input 
          type="text" 
          placeholder="Name" 
          value={newEmployee.name} 
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} 
          className="p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        />
        <input 
          type="text" 
          placeholder="Position" 
          value={newEmployee.position} 
          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} 
          className="p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        />
        <input 
          type="number" 
          placeholder="Salary" 
          value={newEmployee.salary} 
          onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })} 
          className="p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        />
        <input 
          type="date" 
          value={newEmployee.dateAdded} 
          onChange={(e) => setNewEmployee({ ...newEmployee, dateAdded: e.target.value })} 
          className="p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        />
        <motion.button 
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={editingEmployeeId ? editEmployee : addEmployee} 
          className="flex items-center justify-center gap-2 p-3 font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {editingEmployeeId ? <><RefreshCw size={16} /> Update</> : <><Plus size={16} /> Add</>}
        </motion.button>
      </motion.div>

      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 font-bold text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {showFilters ? <><X size={16} /> Hide Filters</> : <><Filter size={16} /> Filters</>}
          </motion.button>
          
          {filteredEmployees.length > 0 && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={generateCSV}
              className="flex items-center gap-2 px-4 py-2 font-bold text-white rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Download size={16} /> Export
            </motion.button>
          )}
        </div>
        
        <div className="px-3 py-1 text-sm text-white bg-gray-700 rounded-full">
          {filteredEmployees.length} of {employees.length} employees
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 mb-6 rounded-lg shadow-lg bg-gray-700/70 backdrop-blur"
          >
            <h3 className="mb-3 text-xl font-bold text-white">Filter Employees</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm text-gray-300">Name</label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  className="w-full p-2 text-white bg-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Filter by name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Position</label>
                <input
                  type="text"
                  value={filters.position}
                  onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                  className="w-full p-2 text-white bg-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Filter by position"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Group By</label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="w-full p-2 text-white bg-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="none">No Grouping</option>
                  <option value="position">Position</option>
                  <option value="dateAdded">Date Added</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Min Salary</label>
                <input
                  type="number"
                  value={filters.salaryMin}
                  onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })}
                  className="w-full p-2 text-white bg-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Minimum salary"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Max Salary</label>
                <input
                  type="number"
                  value={filters.salaryMax}
                  onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })}
                  className="w-full p-2 text-white bg-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Maximum salary"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full p-2 text-white bg-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <span className="my-auto text-white">to</span>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full p-2 text-white bg-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-gray-500 rounded-lg hover:bg-gray-600"
              >
                <RefreshCw size={16} /> Reset
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto rounded-lg shadow-lg bg-gray-800/80 backdrop-blur"
      >
        <table className="w-full text-white border-collapse rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-gray-700 to-gray-600">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Date Added</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredEmployees.length > 0 ? (
                renderTableRows()
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center">
                    No employees found matching current filters.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default EmployeeManagement;