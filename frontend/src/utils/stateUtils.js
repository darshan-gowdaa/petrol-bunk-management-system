import { format } from "date-fns";

export const getInitialFormState = (type) => {
  const baseState = {
    date: format(new Date(), "yyyy-MM-dd"),
  };

  switch (type) {
    case "sales":
      return {
        ...baseState,
        product: "Petrol",
        quantity: "",
        price: "",
      };
    case "inventory":
      return {
        ...baseState,
        name: "",
        currentStock: "",
        reorderLevel: "",
      };
    case "employee":
      return {
        ...baseState,
        name: "",
        position: "",
        salary: "",
      };
    case "expense":
      return {
        ...baseState,
        category: "",
        amount: "",
      };
    default:
      return baseState;
  }
};

export const getInitialFilterState = (type) => {
  const baseState = {
    dateFrom: "",
    dateTo: "",
  };

  switch (type) {
    case "sales":
      return {
        ...baseState,
        product: "",
        quantityMin: "",
        quantityMax: "",
        priceMin: "",
        priceMax: "",
      };
    case "inventory":
      return {
        ...baseState,
        name: "",
        stockMin: "",
        stockMax: "",
        reorderMin: "",
        reorderMax: "",
      };
    case "employee":
      return {
        ...baseState,
        name: "",
        position: "",
        salaryMin: "",
        salaryMax: "",
      };
    case "expense":
      return {
        ...baseState,
        category: "All",
        amountMin: "",
        amountMax: "",
      };
    default:
      return baseState;
  }
};

export const calculateStats = (data, type) => {
  if (!data || !data.length) {
    // Return default values based on type
    switch (type) {
      case "sales":
        return {
          totalCount: 0,
          totalRevenue: 0,
          totalQuantity: 0,
        };
      case "inventory":
        return {
          totalCount: 0,
          itemsToReorder: 0,
          inStockItems: 0,
        };
      case "employee":
        return {
          totalCount: 0,
          totalSalary: 0,
          averageSalary: 0,
        };
      case "expense":
        return {
          totalCount: 0,
          totalAmount: 0,
          averageAmount: 0,
        };
      default:
        return { totalCount: 0 };
    }
  }

  const baseStats = {
    totalCount: data.length,
  };

  switch (type) {
    case "sales":
      const totalRevenue = data.reduce(
        (sum, sale) => sum + (Number(sale.total) || 0),
        0
      );
      const totalQuantity = data.reduce(
        (sum, sale) => sum + (Number(sale.quantity) || 0),
        0
      );
      return {
        ...baseStats,
        totalRevenue,
        totalQuantity,
      };

    case "inventory":
      const itemsToReorder = data.filter(
        (item) => Number(item.currentStock) <= Number(item.reorderLevel)
      ).length;
      return {
        ...baseStats,
        itemsToReorder,
        inStockItems: baseStats.totalCount - itemsToReorder,
      };

    case "employee":
      const totalSalary = data.reduce(
        (sum, emp) => sum + (Number(emp.salary) || 0),
        0
      );
      const averageSalary = data.length ? totalSalary / data.length : 0;

      // Ensure each employee has a valid date
      data.forEach((emp) => {
        if (!emp.date) {
          console.warn("Employee missing date:", emp);
        }
      });

      return {
        ...baseStats,
        totalSalary,
        averageSalary,
      };

    case "expense":
      const totalAmount = data.reduce(
        (sum, exp) => sum + (Number(exp.amount) || 0),
        0
      );
      return {
        ...baseStats,
        totalAmount,
        averageAmount: totalAmount / baseStats.totalCount,
      };

    default:
      return baseStats;
  }
};

export const handleFilterRemoval = (filters, key) => {
  const newFilters = { ...filters };

  if (key.endsWith("Min") || key.endsWith("Max")) {
    const baseKey = key.slice(0, -3);
    delete newFilters[`${baseKey}Min`];
    delete newFilters[`${baseKey}Max`];
  } else {
    delete newFilters[key];
  }

  return newFilters;
};
