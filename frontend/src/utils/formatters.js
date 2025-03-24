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

// Format number in Indian format with commas
export const formatIndianNumber = (value) => {
  if (!value && value !== 0) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  
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
