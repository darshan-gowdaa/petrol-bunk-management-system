import { DateTime } from "luxon";
import { toast } from "react-toastify";
import { Info, XCircle } from "lucide-react"; // Import Lucide icons
import { format } from "date-fns";

export const exportToCSV = (data, headers, filename) => {
  if (!data || !data.length) return;

  // Convert data to CSV format
  const csvContent = [
    // Header row
    headers.map((h) => h.label).join(","),
    // Data rows
    ...data.map((item) =>
      headers
        .map((header) => {
          const value = item[header.key];
          // Handle special cases like dates and numbers
          if (value instanceof Date) {
            return format(value, "dd/MM/yyyy");
          }
          if (typeof value === "number") {
            return value.toString();
          }
          // Escape commas and quotes in string values
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || "";
        })
        .join(",")
    ),
  ].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${format(new Date(), "dd-MM-yyyy")}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
