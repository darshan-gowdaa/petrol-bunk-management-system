import React, { useState, useEffect } from "react";
import { DollarSign, BarChart2, Package } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import HeaderWithActions from "../components/HeaderWithActions";
import Filters from "../PagesModals/Filters";
import { exportToCSV } from "../utils/ExportToCSV";
import StatsCard from "../PagesModals/StatsCard";
import Table from "../PagesModals/Tables";
import AddModalForm from "../PagesModals/AddModalForm";
import EditModalForm from "../PagesModals/EditModalForm";
import DeleteRow from "../PagesModals/DeleteRow";

const API_URL = "http://localhost:5000/api/sales";

const SalesManagement = () => {
  // State management
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

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
      const response = await axios.get(API_URL);
      setSales(response.data);
      setFilteredSales(response.data);
    } catch (err) {
      toast.error("Failed to fetch sales. Please try again.");
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

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
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_URL}?${params}`);
      setFilteredSales(response.data);
    } catch (err) {
      toast.error("Failed to filter sales. Please try again.");
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
      const response = await axios.post(API_URL, saleData);
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
        `${API_URL}/${currentSale._id}`,
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
    } finally {
      setLoading(false);
    }
  };

  // Delete sale
  const deleteSale = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${currentSale._id}`);
      const updatedSales = sales.filter((sale) => sale._id !== currentSale._id);
      setSales(updatedSales);
      setFilteredSales(updatedSales);
      setShowDeleteModal(false);
      toast.success("Sale deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete sale. Please try again.");
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
    <div className="container px-4 py-8 mx-auto transition-all duration-300 animate-fadeIn">
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
      <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        fields={salesFields}
        title="Filter Products"
      />

      {/* Interactive Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <StatsCard
          title="Total Sales"
          value={totalSales}
          icon={BarChart2}
          color="indigo"
          footer={`Total transactions`}
        />

        <StatsCard
          title="Total Revenue"
          value={`₹${new Intl.NumberFormat("en-IN").format(totalRevenue)}`}
          icon={DollarSign}
          color="green"
          footer={`Gross revenue`}
        />

        <StatsCard
          title="Total Quantity"
          value={`${new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalQuantity)} L`}
          icon={Package}
          color="blue"
          footer={`Total volume sold`}
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
