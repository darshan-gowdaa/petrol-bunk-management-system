// src/pages/SalesManagement.jsx
import React, { useState, useEffect, useRef } from "react";
import { toWords } from "number-to-words";
import {
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  Plus,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  BarChart2,
  Package,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import HeaderWithActions from "../components/HeaderWithActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddModalForm from "../PagesModals/AddModalForm";

const SalesManagement = () => {
  // State management
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [showFilteredPopup, setShowFilteredPopup] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [groupedSales, setGroupedSales] = useState({});

  const popupRef = useRef(null);

  // New sale form state
  const [newSale, setNewSale] = useState({
    product: "Petrol",
    quantity: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });

  const salesFields = [
    {
      name: "product",
      label: "Product",
      type: "select",
      options: ["Petrol", "Diesel"],
    },
    {
      name: "quantity",
      label: "Quantity (L)",
      type: "number",
      step: "0.01",
      min: "0",
    },
    {
      name: "price",
      label: "Price per Liter (₹)",
      type: "number",
      step: "0.01",
      min: "0",
    },
    { name: "date", label: "Date", type: "date" },
  ];

  // Filter state
  const [filters, setFilters] = useState({
    product: "",
    quantityMin: "",
    quantityMax: "",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
  });

  const getTotalSalesInWords = (totalSales) => {
    return toWords(totalSales);
  };

  // Fetch sales from API
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/sales");
      setSales(response.data);
      setFilteredSales(response.data);
    } catch (err) {
      toast.error("Failed to fetch sales. Please try again.");
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSales();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
  const applyFilters = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.product) params.append("product", filters.product);
      if (filters.quantityMin)
        params.append("quantityMin", filters.quantityMin);
      if (filters.quantityMax)
        params.append("quantityMax", filters.quantityMax);
      if (filters.priceMin) params.append("priceMin", filters.priceMin);
      if (filters.priceMax) params.append("priceMax", filters.priceMax);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await axios.get(
        `http://localhost:5000/api/sales?${params}`
      );
      setFilteredSales(response.data);

      // Group sales by product for detailed view
      const grouped = response.data.reduce((acc, sale) => {
        if (!acc[sale.product]) {
          acc[sale.product] = [];
        }
        acc[sale.product].push(sale);
        return acc;
      }, {});

      setFilteredResults(response.data);
      setGroupedSales(grouped);
    } catch (err) {
      toast.error("Failed to filter sales. Please try again.");
      console.error("Error filtering sales:", err);
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      product: "",
      quantityMin: "",
      quantityMax: "",
      priceMin: "",
      priceMax: "",
      dateFrom: "",
      dateTo: "",
    });
    setFilteredSales(sales);
    setShowFilters(false);
    toast.info("Filters have been reset");
  };

  // Handle form input changes for new/edit sale
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal && currentSale) {
      setCurrentSale({ ...currentSale, [name]: value });
    } else {
      setNewSale({ ...newSale, [name]: value });
    }
  };

  // Add new sale
  const addSale = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const total = newSale.quantity * newSale.price;
      const saleData = { ...newSale, total };
      const response = await axios.post(
        "http://localhost:5000/api/sales",
        saleData
      );
      setSales([...sales, response.data]);
      setFilteredSales([...filteredSales, response.data]);
      setNewSale({
        product: "Petrol",
        quantity: "",
        price: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
      toast.success("Sale added successfully!");
    } catch (err) {
      toast.error("Failed to add sale. Please try again.");
      console.error("Error adding sale:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit sale
  const editSale = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const total = currentSale.quantity * currentSale.price;
      const saleData = { ...currentSale, total };
      const response = await axios.put(
        `http://localhost:5000/api/sales/${currentSale._id}`,
        saleData
      );
      const updatedSales = sales.map((sale) =>
        sale._id === currentSale._id ? response.data : sale
      );
      setSales(updatedSales);
      setFilteredSales(updatedSales);
      setShowEditModal(false);
      toast.success("Sale updated successfully!");
    } catch (err) {
      toast.error("Failed to update sale. Please try again.");
      console.error("Error updating sale:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete sale
  const deleteSale = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/sales/${currentSale._id}`);
      const updatedSales = sales.filter((sale) => sale._id !== currentSale._id);
      setSales(updatedSales);
      setFilteredSales(updatedSales);
      setShowDeleteModal(false);
      toast.success("Sale deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete sale. Please try again.");
      console.error("Error deleting sale:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export sales data to CSV
  const exportToCSV = () => {
    const headers = ["Product", "Quantity", "Price", "Total", "Date"];
    const csvData = filteredSales.map((sale) => [
      sale.product,
      sale.quantity,
      sale.price,
      sale.total,
      new Date(sale.date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sales.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Sales data exported to CSV");
  };

  // Download CSV for filtered results
  const downloadCSV = (data) => {
    const headers = ["Product", "Quantity", "Price", "Total", "Date"];
    const csvData = data.map((sale) => [
      sale.product,
      sale.quantity,
      sale.price,
      sale.total,
      new Date(sale.date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "filtered_sales.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Filtered sales data exported to CSV");
  };

  // Calculate sales metrics
  const totalSales = filteredSales.length;
  const totalSalesInWords = getTotalSalesInWords(totalSales);
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalRevenueInWords = toWords(totalRevenue);
  const totalQuantity = filteredSales.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <HeaderWithActions
        title="Sales Management"
        onAdd={() => setShowAddModal(true)}
        onFilter={() => setShowFilters(!showFilters)}
        onExport={exportToCSV}
        addLabel="Add Sale"
      />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 mb-6 text-white bg-gray-800 rounded shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Product</label>
              <select
                name="product"
                value={filters.product}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value="">All Products</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">
                  Min Quantity
                </label>
                <input
                  type="number"
                  name="quantityMin"
                  value={filters.quantityMin}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Max Quantity
                </label>
                <input
                  type="number"
                  name="quantityMax"
                  value={filters.quantityMax}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Min Price</label>
                <input
                  type="number"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Max Price</label>
                <input
                  type="number"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Interactive Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        {/* Total Sales Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-indigo-300 bg-indigo-900 rounded-full">
              <BarChart2 size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Total Sales
              </p>
              <p className="text-3xl font-bold text-white">{totalSales}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-green-300 bg-green-900 rounded-full">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-white">
                ₹{new Intl.NumberFormat("en-IN").format(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Quantity Card */}
        <div className="p-6 transition-colors bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center">
            <div className="p-3 mr-4 text-blue-300 bg-blue-900 rounded-full">
              <Package size={24} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-400">
                Total Quantity
              </p>
              <p className="text-3xl font-bold text-white">
                {new Intl.NumberFormat("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalQuantity)}{" "}
                L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  <div className="flex items-center justify-center">
                    <RefreshCw
                      size={20}
                      className="mr-2 text-gray-300 animate-spin"
                    />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  No sales found. Add a new sale to get started.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {sale.product}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {sale.quantity} L
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    ₹{sale.price}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    ₹{sale.total}
                  </td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentSale(sale);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-300 bg-blue-900 rounded-full hover:bg-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentSale(sale);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-300 bg-red-900 rounded-full hover:bg-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Sale Modal */}
      <AddModalForm
        show={showAddModal}
        title="Add New Sale"
        fields={salesFields}
        formData={newSale}
        onChange={handleInputChange}
        onSubmit={addSale}
        onCancel={() => setShowAddModal(false)}
        loading={loading}
      />

      {/* Edit Sale Modal */}
      {showEditModal && currentSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">Edit Sale</h2>
            <form onSubmit={editSale}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Product
                </label>
                <select
                  name="product"
                  value={currentSale.product}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Quantity (L)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={currentSale.quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Price per Liter (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={currentSale.price}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={currentSale.date ? currentSale.date.split("T")[0] : ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    "Update Sale"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-xl">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle size={48} />
            </div>
            <h3 className="mb-4 text-xl font-bold text-center text-white">
              Confirm Delete
            </h3>
            <p className="mb-6 text-center text-gray-300">
              Are you sure you want to delete this {currentSale?.product} sale?
              This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 font-medium text-white transition duration-200 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteSale}
                className="px-4 py-2 font-medium text-white transition duration-200 bg-red-600 rounded-lg hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
