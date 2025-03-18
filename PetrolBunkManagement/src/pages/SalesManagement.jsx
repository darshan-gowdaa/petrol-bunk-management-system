// src/pages/SalesManagement.jsx
import React, { useState, useEffect, useRef } from "react";
import { DollarSign, BarChart2, Package } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

import HeaderWithActions from "../components/HeaderWithActions";
import { exportToCSV } from "../utils/ExportToCSV";
import StatsCard from "../PagesModals/StatsCard";
import Table from "../PagesModals/Tables";
import AddModalForm from "../PagesModals/AddModalForm";
import EditModalForm from "../PagesModals/EditModalForm";
import DeleteRow from "../PagesModals/DeleteRow";

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

  const handleExportSales = () => {
    const headers = [
      { key: "product", label: "Product" },
      { key: "quantity", label: "Quantity" },
      { key: "price", label: "Price" },
      { key: "total", label: "Total" },
      { key: "date", label: "Date" },
    ];
    exportToCSV(filteredSales, headers, "sales");
  };

  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
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
        onExport={handleExportSales}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-full max-w-4xl overflow-hidden bg-gray-900 rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-medium text-white">
                Filter Products
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Product
                  </label>
                  <select
                    name="product"
                    value={filters.product}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Products</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-300">
                    Quantity
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400">
                        Minimum
                      </label>
                      <input
                        type="number"
                        name="quantityMin"
                        value={filters.quantityMin}
                        onChange={handleFilterChange}
                        className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Maximum
                      </label>
                      <input
                        type="number"
                        name="quantityMax"
                        value={filters.quantityMax}
                        onChange={handleFilterChange}
                        className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-300">
                    Price
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400">
                        Minimum
                      </label>
                      <input
                        type="number"
                        name="priceMin"
                        value={filters.priceMin}
                        onChange={handleFilterChange}
                        className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Maximum
                      </label>
                      <input
                        type="number"
                        name="priceMax"
                        value={filters.priceMax}
                        onChange={handleFilterChange}
                        className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 bg-gray-800 border-t border-gray-700">
              <button
                onClick={resetFilters}
                className="px-4 py-2 mr-2 text-white transition-colors bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  setShowFilters(false);
                }}
                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <StatsCard
          icon={<BarChart2 size={24} />}
          iconBgColor="bg-indigo-900"
          iconColor="text-indigo-300"
          title="Total Sales"
          value={totalSales}
        />

        <StatsCard
          icon={<DollarSign size={24} />}
          iconBgColor="bg-green-900"
          iconColor="text-green-300"
          title="Total Revenue"
          value={new Intl.NumberFormat("en-IN").format(totalRevenue)}
          suffix="₹"
        />

        <StatsCard
          icon={<Package size={24} />}
          iconBgColor="bg-blue-900"
          iconColor="text-blue-300"
          title="Total Quantity"
          value={new Intl.NumberFormat("en-IN", {minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(totalQuantity)}
          suffix=" L"
        />
      </div>

      {/* Sales Table */}
      <Table
        columns={[
          { key: "product", label: "Product" },
          {
            key: "quantity",
            label: "Quantity",
            render: (value) => `${value} L`,
          },
          {
            key: "price",
            label: "Price",
            render: (value) => `₹${Number(value).toLocaleString()}`,
          },
          {
            key: "total",
            label: "Total",
            render: (value) => `₹${Number(value).toLocaleString()}`,
          },
          {
            key: "date",
            label: "Date",
            render: (value) => new Date(value).toLocaleDateString(),
          },
        ]}
        data={filteredSales}
        loading={loading}
        onEdit={(sale) => {
          setCurrentSale(sale);
          setShowEditModal(true);
        }}
        onDelete={(sale) => {
          setCurrentSale(sale);
          setShowDeleteModal(true);
        }}
      />

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
      <EditModalForm
        showEditModal={showEditModal}
        currentData={currentSale}
        setShowEditModal={setShowEditModal}
        handleInputChange={handleInputChange}
        loading={loading}
        editFunction={editSale}
        entityType="Sales"
      />

      {/* Delete Confirmation Modal */}

      <DeleteRow
        show={showDeleteModal}
        item={currentSale}
        itemType="Sale"
        itemName={currentSale?.product}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={deleteSale}
        loading={loading}
      />
    </div>
  );
};

export default SalesManagement;
