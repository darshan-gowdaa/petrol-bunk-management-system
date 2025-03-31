// backend/controllers/employeeController.js - Employee management controller
import Employee from "../models/Employee.js";
import { format } from "date-fns";

const formatEmployee = (employee) => ({
  ...(employee._doc || employee),
  date: format(new Date(employee.date || employee.dateAdded || employee.createdAt), "yyyy-MM-dd"),
});

const buildFilter = (query) => {
  const filter = {};
  const { name, position, salaryMin, salaryMax, dateFrom, dateTo } = query;

  if (name) filter.name = { $regex: name, $options: "i" };
  if (position) filter.position = { $regex: position, $options: "i" };
  if (salaryMin || salaryMax) {
    filter.salary = {};
    if (salaryMin) filter.salary.$gte = parseFloat(salaryMin);
    if (salaryMax) filter.salary.$lte = parseFloat(salaryMax);
  }
  if (dateFrom || dateTo) {
    filter.dateAdded = {};
    if (dateFrom) filter.dateAdded.$gte = new Date(dateFrom);
    if (dateTo) filter.dateAdded.$lte = new Date(dateTo);
  }
  return filter;
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(buildFilter(req.query));
    res.status(200).json(employees.map(formatEmployee));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = await new Employee({
      ...req.body,
      dateAdded: req.body.date || new Date(),
    }).save();
    res.status(201).json(formatEmployee(employee));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body, dateAdded: req.body.date || req.body.dateAdded },
      { new: true }
    );
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(formatEmployee(employee));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
