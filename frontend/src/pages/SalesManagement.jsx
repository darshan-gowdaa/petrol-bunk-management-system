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
    date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
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
        date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
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

  // Handle removing a filter
  const handleRemoveFilter = (key) => {
    const newFilters = { ...filters };
    
    // Handle range filters
    if (key.endsWith('Min') || key.endsWith('Max')) {
      const baseKey = key.slice(0, -3); // Remove 'Min' or 'Max'
      delete newFilters[`${baseKey}Min`];
      delete newFilters[`${baseKey}Max`];
    } else {
      // Handle regular filters
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    
    // Build query params with the new filters
    const params = new URLSearchParams();
    if (newFilters.product) params.append("product", newFilters.product);
    if (newFilters.quantityMin) params.append("quantityMin", newFilters.quantityMin);
    if (newFilters.quantityMax) params.append("quantityMax", newFilters.quantityMax);
    if (newFilters.priceMin) params.append("priceMin", newFilters.priceMin);
    if (newFilters.priceMax) params.append("priceMax", newFilters.priceMax);
    if (newFilters.dateFrom) params.append("dateFrom", newFilters.dateFrom);
    if (newFilters.dateTo) params.append("dateTo", newFilters.dateTo);

    // If no filters are active, show all sales
    if (params.toString() === '') {
      setFilteredSales(sales);
    } else {
      // Apply the remaining filters
      axios.get(`${API_URL}?${params}`)
        .then(response => {
          setFilteredSales(response.data);
        })
        .catch(err => {
          toast.error("Failed to update filters. Please try again.");
          console.error("Error updating filters:", err);
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-100 transition-all duration-200 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-fadeIn">
      <main className="container flex flex-col w-full max-w-7xl p-6 mx-auto">
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
          fields={[
            {
              name: "product",
              label: "Product",
              type: "select",
              options: ["Petrol", "Diesel"],
            },
            { name: "quantity", label: "Quantity Range", type: "range" },
            { name: "price", label: "Price Range", type: "range" },
            { name: "dateFrom", label: "Date From", type: "date" },
            { name: "dateTo", label: "Date To", type: "date" },
          ]}
          title="Filter Sales"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <StatsCard
            title="Total Sales"
            value={totalSales}
            icon={BarChart2}
            color="blue"
            footer={`Total number of sales`}
          />
          <StatsCard
            title="Total Revenue"
            value={`₹${totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="green"
            footer={`Total revenue generated`}
          />
          <StatsCard
            title="Total Quantity"
            value={`${totalQuantity.toFixed(2)}L`}
            icon={Package}
            color="purple"
            footer={`Total quantity sold`}
          />
        </div>

        {/* Sales Table */}
        <Table
          columns={[
            { key: "product", label: "Product" },
            { key: "quantity", label: "Quantity (L)" },
            { key: "price", label: "Price per Liter (₹)" },
            { key: "total", label: "Total (₹)" },
            { 
              key: "date", 
              label: "Date",
              render: (value) => new Date(value).toLocaleDateString('en-GB')
            },
          ]}
          data={filteredSales}
          loading={loading}
          onEdit={(item) => {
            setCurrentSale(item);
            setShowEditModal(true);
          }}
          onDelete={(item) => {
            setCurrentSale(item);
            setShowDeleteModal(true);
          }}
          activeFilters={filters}
          onRemoveFilter={handleRemoveFilter}
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
      </main>
    </div>
  );
};

export default SalesManagement;
