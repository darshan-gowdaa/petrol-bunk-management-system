// backend/controllers/inventoryController.js - Inventory management controller
import Inventory from "../models/Inventory.js";
import { format } from "date-fns";

// Format inventory data consistently
const formatInventory = (item) => ({
  ...(item._doc || item),
  date: format(new Date(item.date || item.createdAt), "yyyy-MM-dd"),
});

const buildFilter = (query) => {
  const filter = {};
  const { name, stockMin, stockMax, reorderMin, reorderMax, dateFrom, dateTo } = query;

  if (name) filter.name = { $regex: name, $options: "i" };
  if (stockMin || stockMax) {
    filter.currentStock = {};
    if (stockMin) filter.currentStock.$gte = parseFloat(stockMin);
    if (stockMax) filter.currentStock.$lte = parseFloat(stockMax);
  }
  if (reorderMin || reorderMax) {
    filter.reorderLevel = {};
    if (reorderMin) filter.reorderLevel.$gte = parseFloat(reorderMin);
    if (reorderMax) filter.reorderLevel.$lte = parseFloat(reorderMax);
  }
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }
  return filter;
};

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find(buildFilter(req.query));
    res.status(200).json(inventory.map(formatInventory));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const item = await new Inventory(req.body).save();
    res.status(201).json(formatInventory(item));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    res.status(200).json(formatInventory(item));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
