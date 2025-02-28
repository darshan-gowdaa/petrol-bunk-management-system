// src/pages/EmployeeTimesheet.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar, Filter, Download } from 'lucide-react';
import { showToast } from '../components/ToastifyAlert';
import { motion } from 'framer-motion';

const EmployeeTimesheet = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newTimesheet, setNewTimesheet] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    checkOut: '17:00',
    status: 'Present'
  });
  const [editingTimesheetId, setEditingTimesheetId] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: 'all',
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0],
    status: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getEmployees();
    getTimesheets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      if (response.data.length > 0) {
        setNewTimesheet((prev) => ({
          ...prev,
          employeeId: response.data[0]._id
        }));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showToast('Failed to fetch employees', 'error');
    }
  };

  const getTimesheets = async () => {
    setIsLoading(true);
    try {
      let url = 'http://localhost:5000/api/timesheets';
      const params = new URLSearchParams();

      if (filters.employeeId !== 'all') params.append('employeeId', filters.employeeId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status !== 'all') params.append('status', filters.status);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await axios.get(url);
      setTimesheets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      showToast('Failed to fetch timesheet data', 'error');
      setIsLoading(false);
    }
  };

  const addTimesheet = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/timesheets', newTimesheet);
      setTimesheets([...timesheets, response.data]);
      resetForm();
      showToast('Timesheet entry added successfully', 'added');
    } catch (error) {
      console.error('Error adding timesheet:', error);
      showToast('Failed to add timesheet entry', 'error');
    }
  };

  const editTimesheet = async () => {
    if (!editingTimesheetId) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/timesheets/${editingTimesheetId}`,
        newTimesheet
      );
      setTimesheets(
        timesheets.map((timesheet) =>
          timesheet._id === editingTimesheetId ? response.data : timesheet
        )
      );
      resetForm();
      showToast('Timesheet entry updated successfully', 'edited');
    } catch (error) {
      console.error('Error updating timesheet:', error);
      showToast('Failed to update timesheet entry', 'error');
    }
  };

  const deleteTimesheet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/timesheets/${id}`);
      setTimesheets(timesheets.filter((timesheet) => timesheet._id !== id));
      showToast('Timesheet entry deleted successfully', 'deleted');
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      showToast('Failed to delete timesheet entry', 'error');
    }
  };

  const resetForm = () => {
    setNewTimesheet({
      employeeId: employees.length > 0 ? employees[0]._id : '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00',
      checkOut: '17:00',
      status: 'Present'
    });
    setEditingTimesheetId(null);
  };

  const handleEditClick = (timesheet) => {
    setNewTimesheet({
      employeeId: timesheet.employeeId,
      date: timesheet.date.split('T')[0],
      checkIn: timesheet.checkIn,
      checkOut: timesheet.checkOut,
      status: timesheet.status
    });
    setEditingTimesheetId(timesheet._id);
  };

  const applyFilters = () => {
    getTimesheets();
  };

  const downloadTimesheetReport = () => {
    if (timesheets.length === 0) {
      showToast('No data to download', 'error');
      return;
    }

    // Create CSV content
    const headers = ['Employee', 'Date', 'Check In', 'Check Out', 'Hours Worked', 'Status'];
    const csvRows = [headers.join(',')];

    timesheets.forEach((timesheet) => {
      const employee =
        employees.find((e) => e._id === timesheet.employeeId) || { name: 'Unknown' };
      const checkIn = timesheet.checkIn;
      const checkOut = timesheet.checkOut;
      const [checkInHour, checkInMin] = checkIn.split(':').map(Number);
      const [checkOutHour, checkOutMin] = checkOut.split(':').map(Number);
      const hoursWorked =
        ((checkOutHour * 60 + checkOutMin) - (checkInHour * 60 + checkInMin)) / 60;
      const row = [
        employee.name,
        timesheet.date.split('T')[0],
        checkIn,
        checkOut,
        hoursWorked.toFixed(2),
        timesheet.status
      ];
      csvRows.push(row.join(','));
    });

    // Create and trigger download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timesheet_report_${filters.startDate}_to_${filters.endDate}.csv`;
    link.click();

    showToast('Timesheet report downloaded successfully', 'success');
  };

  // Calculate employee statistics
  const calculateStatistics = () => {
    if (timesheets.length === 0)
      return { totalHours: 0, averageHours: 0, presentDays: 0, absentDays: 0 };

    let totalHours = 0;
    let presentDays = 0;
    let absentDays = 0;

    timesheets.forEach((timesheet) => {
      if (timesheet.status === 'Present') {
        presentDays++;
        const [checkInHour, checkInMin] = timesheet.checkIn.split(':').map(Number);
        const [checkOutHour, checkOutMin] = timesheet.checkOut.split(':').map(Number);
        const hoursWorked =
          ((checkOutHour * 60 + checkOutMin) - (checkInHour * 60 + checkInMin)) / 60;
        totalHours += hoursWorked;
      } else {
        absentDays++;
      }
    });

    return {
      totalHours: totalHours.toFixed(2),
      averageHours: (totalHours / (presentDays || 1)).toFixed(2),
      presentDays,
      absentDays
    };
  };

  const statistics = calculateStatistics();

  // Loading spinner component
  const Spinner = () => (
    <div className="flex items-center justify-center p-12">
      <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 mx-auto bg-gray-800 rounded-lg shadow-lg"
    >
      <h1 className="mb-6 text-3xl font-bold text-white">Employee Timesheet</h1>

      {/* Filter Section */}
      <div className="p-4 mb-6 bg-gray-700 rounded-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-white">Employee</label>
            <select
              className="p-2 rounded"
              value={filters.employeeId}
              onChange={(e) =>
                setFilters({ ...filters, employeeId: e.target.value })
              }
            >
              <option value="all">All</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white">Start Date</label>
            <input
              type="date"
              className="p-2 rounded"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white">End Date</label>
            <input
              type="date"
              className="p-2 rounded"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white">Status</label>
            <select
              className="p-2 rounded"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded"
            onClick={applyFilters}
          >
            <Filter size={16} /> Apply Filters
          </button>
        </div>
      </div>

      {/* Timesheet Form Section */}
      <div className="p-4 mb-6 bg-gray-700 rounded-lg">
        <h2 className="mb-4 text-xl text-white">
          {editingTimesheetId ? 'Edit Timesheet' : 'Add Timesheet'}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col">
            <label className="text-sm text-white">Employee</label>
            <select
              className="p-2 rounded"
              value={newTimesheet.employeeId}
              onChange={(e) =>
                setNewTimesheet({ ...newTimesheet, employeeId: e.target.value })
              }
            >
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white">Date</label>
            <input
              type="date"
              className="p-2 rounded"
              value={newTimesheet.date}
              onChange={(e) =>
                setNewTimesheet({ ...newTimesheet, date: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white">Status</label>
            <select
              className="p-2 rounded"
              value={newTimesheet.status}
              onChange={(e) =>
                setNewTimesheet({ ...newTimesheet, status: e.target.value })
              }
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white">Check In</label>
            <input
              type="time"
              className="p-2 rounded"
              value={newTimesheet.checkIn}
              onChange={(e) =>
                setNewTimesheet({ ...newTimesheet, checkIn: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white">Check Out</label>
            <input
              type="time"
              className="p-2 rounded"
              value={newTimesheet.checkOut}
              onChange={(e) =>
                setNewTimesheet({ ...newTimesheet, checkOut: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 text-white bg-green-500 rounded"
            onClick={editingTimesheetId ? editTimesheet : addTimesheet}
          >
            {editingTimesheetId ? 'Update Timesheet' : 'Add Timesheet'}
          </button>
          <button
            className="px-4 py-2 text-white bg-gray-500 rounded"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="p-4 mb-6 bg-gray-700 rounded-lg">
        <h2 className="mb-4 text-xl text-white">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-4 text-center bg-gray-800 rounded">
            <p className="font-bold text-white">{statistics.totalHours}</p>
            <p className="text-sm text-gray-400">Total Hours</p>
          </div>
          <div className="p-4 text-center bg-gray-800 rounded">
            <p className="font-bold text-white">{statistics.averageHours}</p>
            <p className="text-sm text-gray-400">Average Hours</p>
          </div>
          <div className="p-4 text-center bg-gray-800 rounded">
            <p className="font-bold text-white">{statistics.presentDays}</p>
            <p className="text-sm text-gray-400">Present Days</p>
          </div>
          <div className="p-4 text-center bg-gray-800 rounded">
            <p className="font-bold text-white">{statistics.absentDays}</p>
            <p className="text-sm text-gray-400">Absent Days</p>
          </div>
        </div>
      </div>

      {/* Timesheet List Section */}
      <div className="p-4 mb-6 bg-gray-700 rounded-lg">
        <h2 className="mb-4 text-xl text-white">Timesheet Entries</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-white">Employee</th>
                  <th className="px-4 py-2 text-white">Date</th>
                  <th className="px-4 py-2 text-white">Check In</th>
                  <th className="px-4 py-2 text-white">Check Out</th>
                  <th className="px-4 py-2 text-white">Hours Worked</th>
                  <th className="px-4 py-2 text-white">Status</th>
                  <th className="px-4 py-2 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((timesheet) => {
                  const employee =
                    employees.find((e) => e._id === timesheet.employeeId) || { name: 'Unknown' };
                  const [checkInHour, checkInMin] = timesheet.checkIn.split(':').map(Number);
                  const [checkOutHour, checkOutMin] = timesheet.checkOut.split(':').map(Number);
                  const hoursWorked =
                    ((checkOutHour * 60 + checkOutMin) - (checkInHour * 60 + checkInMin)) / 60;
                  return (
                    <tr key={timesheet._id} className="border-t border-gray-600">
                      <td className="px-4 py-2 text-white">{employee.name}</td>
                      <td className="px-4 py-2 text-white">
                        {timesheet.date.split('T')[0]}
                      </td>
                      <td className="px-4 py-2 text-white">{timesheet.checkIn}</td>
                      <td className="px-4 py-2 text-white">{timesheet.checkOut}</td>
                      <td className="px-4 py-2 text-white">{hoursWorked.toFixed(2)}</td>
                      <td className="px-4 py-2 text-white">{timesheet.status}</td>
                      <td className="px-4 py-2 text-white">
                        <button
                          className="px-2 py-1 mr-2 bg-blue-500 rounded"
                          onClick={() => handleEditClick(timesheet)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 rounded"
                          onClick={() => deleteTimesheet(timesheet._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Download Report Button */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-500 rounded"
          onClick={downloadTimesheetReport}
        >
          <Download size={16} /> Download Report
        </button>
      </div>
    </motion.div>
  );
};

export default EmployeeTimesheet;
