import { format } from "date-fns";
import { DATE_FORMATS } from "../constants/constants.js";

// Format currency
export const formatCurrency = (amount, currency = "INR") => {
  if (!amount && amount !== 0) return "₹0";
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  // Convert to string with 2 decimal places
  const withDecimals = numAmount.toFixed(2);
  // Remove trailing zeros after decimal point
  const cleanedAmount = withDecimals.replace(/\.?0+$/, "");
  // Split into whole and decimal parts
  const [whole, decimal] = cleanedAmount.split(".");
  // Format whole number part with Indian grouping
  const lastThree = whole.substring(whole.length - 3);
  const otherNumbers = whole.substring(0, whole.length - 3);
  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;
  return `₹${formatted}${decimal ? "." + decimal : ""}`;
};

// Format date
export const formatDate = (date, formatString = DATE_FORMATS.DISPLAY) => {
  if (!date) return "";
  return format(new Date(date), "dd/MM/yyyy");
};

// Format number with commas (Indian format)
export const formatNumber = (number) => {
  if (!number && number !== 0) return "0";
  const num = typeof number === "string" ? parseFloat(number) : number;
  // Convert to string with up to 2 decimal places if needed
  const withDecimals = num.toFixed(2).replace(/\.?0+$/, "");
  // Split into whole and decimal parts
  const [whole, decimal] = withDecimals.split(".");
  // Format whole number part with Indian grouping
  const lastThree = whole.substring(whole.length - 3);
  const otherNumbers = whole.substring(0, whole.length - 3);
  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;
  return decimal ? `${formatted}.${decimal}` : formatted;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return phoneNumber;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
