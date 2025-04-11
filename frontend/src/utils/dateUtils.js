// frontend/src/utils/dateUtils.js - Date utility functions

export const DATE_RANGES = {
    today: "Today",
    week: "Last 7 days",
    month: "Last 30 days",
    quarter: "Last 90 days",
    year: "Last 365 days",
    all: "All time"
};

export const getDateRange = (range, customRange = null) => {
    if (range === "custom" && customRange) {
        const startDate = new Date(customRange.startDate);
        const endDate = new Date(customRange.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
    }

    const now = new Date();
    now.setHours(23, 59, 59, 999);
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    switch (range) {
        case "today": break;
        case "week": startDate.setDate(now.getDate() - 7); break;
        case "month": startDate.setMonth(now.getMonth() - 1); break;
        case "quarter": startDate.setMonth(now.getMonth() - 3); break;
        case "year": startDate.setFullYear(now.getFullYear() - 1); break;
        case "all": return { startDate: null, endDate: null };
        default: return { startDate: null, endDate: null };
    }

    return { startDate, endDate: now };
};

export const filterDataByDate = (data, dateRange, dateField = "date") => {
    if (!Array.isArray(data)) return [];
    if (!dateRange.startDate || !dateRange.endDate) return data;

    return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        if (isNaN(itemDate.getTime())) return false;
        return itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
    });
};

export const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "Select a date range";
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}; 