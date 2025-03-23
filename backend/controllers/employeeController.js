// backend/controllers/employeeController.js
import Employee from "../models/Employee.js";
import { format } from "date-fns";

// Format employee data consistently
const formatEmployee = (employee) => {
  const employeeData = employee._doc || employee;
  return {
    ...employeeData,
    date: format(
      new Date(
        employeeData.date || employeeData.dateAdded || employeeData.createdAt
      ),
      "yyyy-MM-dd"
    ),
  };
};

// Get all employees with filtering options
export const getEmployees = async (req, res) => {
  try {
    const { name, position, salaryMin, salaryMax, dateFrom, dateTo } =
      req.query;

    // Build filter object
    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (position) filter.position = { $regex: position, $options: "i" };

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
    res.status(200).json(employees.map((emp) => formatEmployee(emp)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      dateAdded: req.body.date || new Date(),
    };
    const employee = new Employee(employeeData);
    const savedEmployee = await employee.save();
    res.status(201).json(formatEmployee(savedEmployee));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      dateAdded: req.body.date || req.body.dateAdded,
    };
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      employeeData,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(formatEmployee(updatedEmployee));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
