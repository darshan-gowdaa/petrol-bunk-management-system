import { DateTime } from "luxon";
import { toast } from "react-toastify";
import { Info, XCircle } from "lucide-react"; // Import Lucide icons

export const exportToCSV = (data, headers, filename, options = {}) => {
  const {
    showToast = true,
    toastMessage = `${filename} data exported to CSV`,
    dateFormat = "dd/MM/yyyy",
    includeTimestamp = true,
    timeZone = "Asia/Kolkata",
  } = options;

  if (!data || data.length === 0) {
    toast.error(
      <div className="flex items-center">
        <XCircle className="flex items-center w-5 h-5 gap-2 text-red-500 me-1" /> <span>Cannot download empty records.</span>
      </div>
    );
    return;
  }

  const formatValue = (value) => {
    if (value instanceof Date) {
      return DateTime.fromJSDate(value).setZone(timeZone).toFormat(dateFormat);
    }
    if (value == null) return "";
    if (typeof value === "string" && /[,"\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.map(({ label, key }) => label || key).join(","),
    ...data.map((item) => headers.map(({ key }) => formatValue(item[key])).join(",")),
  ].join("\n");

  let formattedFilename = filename.toLowerCase().replace(/\s+/g, "-");
  if (includeTimestamp) {
    formattedFilename += `_${DateTime.now().setZone(timeZone).toFormat("dd-MM-yyyy_HH-mm-ss")}`;
  }

  const fullFilename = `${formattedFilename}.csv`;

  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: fullFilename,
      style: "visibility:hidden",
    });

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToast) {
      toast.info(
        <div className="flex items-center gap-2 text-blue-500">
          <Info className="w-5 h-5" /> <span>{toastMessage}</span>
        </div>
      );
    }

    return fullFilename;
  } catch (error) {
    console.error("exportToCSV Error:", error);
    toast.error(
      <div className="flex items-center gap-2 text-red-500">
        <XCircle className="w-5 h-5" /> <span>Failed to export CSV. Please try again.</span>
      </div>
    );
  }
};
