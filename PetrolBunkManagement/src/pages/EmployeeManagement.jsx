import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    salary: '',
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      const data = await response.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showAlert('Failed to fetch employees.');
    }
  };

  const addEmployee = async () => {
    if (newEmployee.name && newEmployee.position && newEmployee.salary > 0) {
      try {
        const response = await fetch('http://localhost:5000/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmployee),
        });
        const data = await response.json();
        setEmployees([...employees, data]);
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
        const response = await fetch(`http://localhost:5000/api/employees/${editingEmployeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmployee),
        });
        const data = await response.json();
        setEmployees(
          employees.map((employee) =>
            employee._id === editingEmployeeId ? data : employee
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
      setEmployees(employees.filter((employee) => employee._id !== id));
      showAlert('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      showAlert('Failed to delete employee.');
    }
  };

  const resetForm = () => {
    setNewEmployee({ name: '', position: '', salary: '' });
    setEditingEmployeeId(null);
  };

  const handleEditClick = (employee) => {
    setNewEmployee({ name: employee.name, position: employee.position, salary: employee.salary });
    setEditingEmployeeId(employee._id);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  return (
    <div className="p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-white">Employee Management</h1>

      {alertVisible && (
        <div className="fixed z-50 p-4 text-center text-white transition-opacity transform -translate-x-1/2 bg-yellow-500 rounded-lg shadow-lg bottom-4 left-1/2">
          {alertMessage}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="p-3 text-white bg-gray-700 rounded-lg" />
        <input type="text" placeholder="Position" value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} className="p-3 text-white bg-gray-700 rounded-lg" />
        <input type="number" placeholder="Salary" value={newEmployee.salary} onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })} className="p-3 text-white bg-gray-700 rounded-lg" />
        <button onClick={editingEmployeeId ? editEmployee : addEmployee} className="p-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {editingEmployeeId ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>

      <table className="w-full text-white border-collapse rounded-lg shadow-md">
        <thead>
          <tr className="text-gray-300 bg-gray-600">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Salary</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="border-b border-gray-500 hover:bg-gray-900">
              <td className="p-3">{employee.name}</td>
              <td className="p-3">{employee.position}</td>
              <td className="p-3">₹{employee.salary.toFixed(2)}</td>
              <td className="p-3 text-center">
                <button onClick={() => handleEditClick(employee)} className="px-3 py-2 mr-2 text-sm font-bold text-gray-800 bg-yellow-400 rounded-lg hover:bg-yellow-500">✏️ Edit</button>
                <button onClick={() => deleteEmployee(employee._id)} className="px-3 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
