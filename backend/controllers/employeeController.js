// backend/controllers/employeeController.js
import Employee from '../models/Employee.js';

// Format employee data consistently
const formatEmployee = (employee) => {
  return {
    ...employee._doc,
    dateAdded: employee.dateAdded || employee.createdAt,
  };
};

// Get all employees with filtering options
export const getEmployees = async (req, res) => {
  try {
    const { name, position, salaryMin, salaryMax, dateFrom, dateTo } = req.query;
    
    // Build filter object
    let filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (position) filter.position = { $regex: position, $options: 'i' };
    
    // Add salary range filter if provided
    if (salaryMin || salaryMax) {
      filter.salary = {};
      if (salaryMin) filter.salary.$gte = parseFloat(salaryMin);
      if (salaryMax) filter.salary.$lte = parseFloat(salaryMax);
    }
    
    // Add date range filter if provided
    if (dateFrom || dateTo) {
      filter.dateAdded = {};
      if (dateFrom) filter.dateAdded.$gte = new Date(dateFrom);
      if (dateTo) filter.dateAdded.$lte = new Date(dateTo);
    }
    
    const employees = await Employee.find(filter);
    res.status(200).json(employees.map(emp => formatEmployee(emp)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json(formatEmployee(savedEmployee));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(formatEmployee(updatedEmployee));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};