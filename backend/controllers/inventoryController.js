// backend/controllers/inventoryController.js
import Inventory from "../models/Inventory.js";
import { format } from "date-fns";

// Format inventory data consistently
const formatInventory = (item) => {
  const itemData = item._doc || item;
  return {
    ...itemData,
    date: format(new Date(itemData.date || itemData.createdAt), "yyyy-MM-dd"),
  };
};

export const getInventory = async (req, res) => {
  try {
    const {
      name,
      stockMin,
      stockMax,
      reorderMin,
      reorderMax,
      dateFrom,
      dateTo,
    } = req.query;

    // Build filter object
    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };

    // Add stock range filter if provided
    if (stockMin || stockMax) {
      filter.currentStock = {};
      if (stockMin) filter.currentStock.$gte = parseFloat(stockMin);
      if (stockMax) filter.currentStock.$lte = parseFloat(stockMax);
    }

    // Add reorder level range filter if provided
    if (reorderMin || reorderMax) {
      filter.reorderLevel = {};
      if (reorderMin) filter.reorderLevel.$gte = parseFloat(reorderMin);
      if (reorderMax) filter.reorderLevel.$lte = parseFloat(reorderMax);
    }

    // Add date range filter if provided
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const inventory = await Inventory.find(filter);
    res.status(200).json(inventory.map((item) => formatInventory(item)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const item = new Inventory(req.body);
    const savedItem = await item.save();
    res.status(201).json(formatInventory(savedItem));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(formatInventory(updatedItem));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
