// frontend/src/constants/constants.js - Application-wide constants and configurations

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  INVENTORY: {
    BASE: "/inventory",
  },
  SALES: {
    BASE: "/sales",
  },
  EMPLOYEES: {
    BASE: "/employees",
  },
  EXPENSES: {
    BASE: "/expenses",
  },
  REPORTS: {
    BASE: "/reports",
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
  USER: "user"
};

// Table pagination options
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50]
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  API: "YYYY-MM-DD",
  DATETIME: "DD/MM/YYYY HH:mm:ss",
};
