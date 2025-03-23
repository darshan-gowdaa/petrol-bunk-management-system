// backend/middleware/validation.js
export const validateEmployee = (req, res, next) => {
  const { name, position, salary, date } = req.body;

  if (!name || !position || !salary) {
    return res
      .status(400)
      .json({ message: "Name, position, and salary are required fields" });
  }

  if (isNaN(salary)) {
    return res.status(400).json({ message: "Salary must be a number" });
  }

  // Validate date if provided
  if (date) {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
  }

  next();
};

export const validateExpense = (req, res, next) => {
  const { category, amount, date } = req.body;

  if (!category || !amount || !date) {
    return res
      .status(400)
      .json({ message: "Category, amount, and date are required fields" });
  }

  if (isNaN(amount)) {
    return res.status(400).json({ message: "Amount must be a number" });
  }

  next();
};

export const validateInventory = (req, res, next) => {
  const { name, currentStock, reorderLevel } = req.body;

  if (!name || currentStock === undefined || reorderLevel === undefined) {
    return res
      .status(400)
      .json({
        message: "Name, current stock, and reorder level are required fields",
      });
  }

  if (isNaN(currentStock) || isNaN(reorderLevel)) {
    return res.status(400).json({ message: "Stock values must be numbers" });
  }

  next();
};

export const validateSale = (req, res, next) => {
  const { product, quantity, price } = req.body;

  if (!product || !quantity || !price) {
    return res
      .status(400)
      .json({ message: "Product, quantity, and price are required fields" });
  }

  if (isNaN(quantity) || isNaN(price)) {
    return res
      .status(400)
      .json({ message: "Quantity and price must be numbers" });
  }

  next();
};
