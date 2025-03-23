// constants.js - Application-wide constants

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  INVENTORY: {
    BASE: "/inventory",
    ITEMS: "/inventory/items",
    STOCK: "/inventory/stock",
  },
  SALES: {
    BASE: "/sales",
    TRANSACTIONS: "/sales/transactions",
    REPORTS: "/sales/reports",
  },
  EMPLOYEES: {
    BASE: "/employees",
    LIST: "/employees/list",
    ATTENDANCE: "/employees/attendance",
  },
  EXPENSES: {
    BASE: "/expenses",
    LIST: "/expenses/list",
    CATEGORIES: "/expenses/categories",
  },
};

// Route paths
export const ROUTES = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
  INVENTORY: "/inventory",
  SALES: "/sales",
  EMPLOYEES: "/employees",
  EXPENSES: "/expenses",
  REPORTS: "/reports",
};

// Toast message types
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};

// Table pagination options
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  API: "YYYY-MM-DD",
  DATETIME: "DD/MM/YYYY HH:mm:ss",
};
