// frontend/src/utils/formatters.js - Utilities for formatting numbers and currency

// Format numbers in Indian style with optional currency and units
export const formatIndianNumber = (value, { currency = false, decimals = 2, unit = "" } = {}) => {
  // Handle null/undefined/empty values
  if (value == null || value === "") return currency ? "₹0" : "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  // Format with specified decimals, remove trailing zeros
  const formatted = num.toFixed(decimals).replace(/\.?0+$/, "");
  const [whole, decimal] = formatted.split(".");
  // Indian grouping: last 3 digits, then pairs of 2
  const lastThree = whole.slice(-3);
  const otherNumbers = whole.slice(0, -3);
  const grouped = otherNumbers ? `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}` : lastThree;
  const result = decimal ? `${grouped}.${decimal}` : grouped;
  return currency ? `₹${result}` : `${result}${unit}`;
};

// Alias for backward compatibility
export const formatNumber = value => formatIndianNumber(value);
export const formatCurrency = value => formatIndianNumber(value, { currency: true });

// Format large numbers with K, L, Cr units
export const formatLargeNumber = (value, { currency = false } = {}) => {
  // Handle null/undefined/empty values
  if (value == null || value === "") return currency ? "₹0" : "0";
  const num = Math.abs(typeof value === "string" ? parseFloat(value) : value);
  // Define thresholds and labels
  const thresholds = [
    { value: 1e7, label: " Cr" },
    { value: 1e5, label: " L" },
    { value: 1e3, label: " K" }
  ];
  // Find appropriate unit
  for (const { value, label } of thresholds) {
    if (num >= value) {
      const result = (num / value).toFixed(2).replace(/\.?0+$/, "") + label;
      return currency ? `₹${result}` : result;
    }
  }
  return formatIndianNumber(num, { currency, decimals: 0 });
};

// Format currency in large number format
export const formatLargeCurrency = value => formatLargeNumber(value, { currency: true });

// Format quantity in K-L format
export const formatQuantityInKL = (value) => {
  // Handle null/undefined/empty values
  if (value == null || value === "") return "0 L";
  const num = Math.abs(typeof value === "string" ? parseFloat(value) : value);
  // Use K-L for >= 1000
  if (num >= 1e3) {
    return formatLargeNumber(num / 1e3, { decimals: num >= 1e5 ? 1 : 2 }).replace(/(\.\d)?0* (Cr|L|K)/, "$1 K-L");
  }
  return `${formatIndianNumber(num, { decimals: 0 })} L`;
};

// Convert numbers to Indian words representation
export const getIndianNumberInWords = (number, isRupees = false, isLiters = false) => {
  // Handle invalid inputs
  if (!number || isNaN(number)) return isRupees ? "Zero rupees" : isLiters ? "Zero liters" : "Zero";
  const [integerPart, decimalPart] = String(number).replace(/,/g, "").split(".");
  let value = parseInt(integerPart);

  // Word mappings
  const words = {
    ones: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
    tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    teens: ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
  };

  // Convert number < 1000 to words
  const toWords = (num) => {
    if (num === 0) return "";
    if (num < 10) return words.ones[num];
    if (num < 20) return words.teens[num - 10];
    if (num < 100) return `${words.tens[Math.floor(num / 10)]}${num % 10 ? " " + words.ones[num % 10] : ""}`;
    return `${words.ones[Math.floor(num / 100)]} hundred${num % 100 ? " and " + toWords(num % 100) : ""}`;
  };

  // Build words for large numbers
  let result = "";
  if (value >= 10000000) { // Crores
    const crores = Math.floor(value / 10000000);
    result += `${toWords(crores)} crore `;
    value %= 10000000;
  }
  if (value >= 100000) { // Lakhs
    const lakhs = Math.floor(value / 100000);
    result += `${toWords(lakhs)} lakh `;
    value %= 100000;
  }
  if (value >= 1000) { // Thousands
    const thousands = Math.floor(value / 1000);
    result += `${toWords(thousands)} thousand `;
    value %= 1000;
  }
  result += toWords(value);

  // Handle decimal part
  if (decimalPart) {
    result += ` point ${[...decimalPart].map(d => words.ones[+d]).join(" ")}`;
  }

  // Add unit and capitalize
  result = result.trim();
  if (!result) result = "zero";
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result + (isRupees ? " rupees" : isLiters ? " liters" : "");
};