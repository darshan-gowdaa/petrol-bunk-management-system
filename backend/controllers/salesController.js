import Sale from "../models/Sale.js";
import { format } from "date-fns";

const formatSale = (sale) => ({
  ...(sale._doc || sale),
  date: format(new Date(sale.date || sale.createdAt), "yyyy-MM-dd"),
});

const buildFilter = (query) => {
  const filter = {};
  const { product, quantityMin, quantityMax, priceMin, priceMax, totalMin, totalMax, dateFrom, dateTo } = query;

  if (product) filter.product = { $regex: product, $options: "i" };
  if (quantityMin || quantityMax) {
    filter.quantity = {};
    if (quantityMin) filter.quantity.$gte = parseFloat(quantityMin);
    if (quantityMax) filter.quantity.$lte = parseFloat(quantityMax);
  }
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = parseFloat(priceMin);
    if (priceMax) filter.price.$lte = parseFloat(priceMax);
  }
  if (totalMin || totalMax) {
    filter.total = {};
    if (totalMin) filter.total.$gte = parseFloat(totalMin);
    if (totalMax) filter.total.$lte = parseFloat(totalMax);
  }
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }
  return filter;
};

export const getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find(buildFilter(req.query));
    res.status(200).json(sales.map(formatSale));
  } catch (err) {
    next(err);
  }
};

export const createSale = async (req, res, next) => {
  try {
    if (!req.body.total && req.body.quantity && req.body.price) {
      req.body.total = req.body.quantity * req.body.price;
    }
    const sale = await new Sale(req.body).save();
    res.status(201).json(formatSale(sale));
  } catch (err) {
    next(err);
  }
};

export const updateSale = async (req, res, next) => {
  try {
    if (!req.body.total && req.body.quantity && req.body.price) {
      req.body.total = req.body.quantity * req.body.price;
    }
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(formatSale(sale));
  } catch (err) {
    next(err);
  }
};

export const deleteSale = async (req, res, next) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
