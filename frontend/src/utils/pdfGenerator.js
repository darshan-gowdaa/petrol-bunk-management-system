import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";

export const generatePDF = async (elementRef, fileName = "report", options = {}) => {
  if (!elementRef.current) return null;
  const defaultOptions = { scale: 2, useCORS: true, logging: false, backgroundColor: "#19212c", ...options };
  try {
    const canvas = await html2canvas(elementRef.current, defaultOptions);
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}-${format(new Date(), "dd-MM-yy")}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};