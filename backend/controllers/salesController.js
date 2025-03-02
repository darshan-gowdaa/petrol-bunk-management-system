// backend/controllers/salesController.js
import Sale from '../models/Sale.js';

// Format sales data consistently
const formatSale = (sale) => {
  return {
    ...sale._doc,
    date: sale.date || sale.createdAt,
  };
};

export const getSales = async (req, res) => {
  try {
    const { 
      product, 
      quantityMin, 
      quantityMax, 
      priceMin, 
      priceMax,
      totalMin, 
      totalMax,
      dateFrom, 
      dateTo 
    } = req.query;
    
    // Build filter object
    let filter = {};
    if (product) filter.product = { $regex: product, $options: 'i' };
    
    // Add quantity range filter if provided
    if (quantityMin || quantityMax) {
      filter.quantity = {};
      if (quantityMin) filter.quantity.$gte = parseFloat(quantityMin);
      if (quantityMax) filter.quantity.$lte = parseFloat(quantityMax);
    }
    
    // Add price range filter if provided
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }
    
    // Add total range filter if provided
    if (totalMin || totalMax) {
      filter.total = {};
      if (totalMin) filter.total.$gte = parseFloat(totalMin);
      if (totalMax) filter.total.$lte = parseFloat(totalMax);
    }
    
    // Add date range filter if provided
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    
    const sales = await Sale.find(filter);
    res.status(200).json(sales.map(sale => formatSale(sale)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSale = async (req, res) => {
  try {
    // Calculate total if not provided
    if (!req.body.total && req.body.quantity && req.body.price) {
      req.body.total = req.body.quantity * req.body.price;
    }
    
    const sale = new Sale(req.body);
    const savedSale = await sale.save();
    res.status(201).json(formatSale(savedSale));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    // Calculate total if not provided but quantity and price are
    if (!req.body.total && req.body.quantity && req.body.price) {
      req.body.total = req.body.quantity * req.body.price;
    }
    
    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(formatSale(updatedSale));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};