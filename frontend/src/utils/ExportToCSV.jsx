// frontend/src/utils/ExportToCSV.jsx - CSV export utility
import { format } from "date-fns";
import { showToast } from "./toastConfig";

export const exportToCSV = (data, headers, filename) => {
  if (!data?.length) {
    showToast.error("Cannot export empty table");
    return;
  }

  const csvContent = [
    headers.map(h => h.label).join(","),
    ...data.map(item => headers.map(header => {
      const value = item[header.key];
      if (value instanceof Date) return format(value, "dd/MM/yyyy");
      if (typeof value === "number") return value.toString();
      if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`;
      return value || "";
    }).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${format(new Date(), "dd-MM-yyyy")}.csv`;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast.success("Data exported successfully!");
};

