import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pencil, Trash2, Download, Filter, PlusCircle, X, Check, Calendar, DollarSign, BarChart3, Database } from 'lucide-react';

const SalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({ 
    product: 'Petrol', 
    quantity: '', 
    price: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [dateRange, setDateRange] = useState({ 
    startDate: '', 
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [filteredResults, setFilteredResults] = useState([]);
  const [showFilteredPopup, setShowFilteredPopup] = useState(false);
  const [groupedSales, setGroupedSales] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  const popupRef = useRef(null);

  useEffect(() => {
    getSales();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowFilteredPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      const salesData = Array.isArray(response.data) ? response.data : [];
      setSales(sortData(salesData, sortConfig.key, sortConfig.direction));
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to fetch sales records.');
    }
  };

  const addSale = async () => {
    if (newSale.quantity > 0 && newSale.price > 0 && newSale.date) {
      const total = newSale.quantity * newSale.price;
      const saleData = { ...newSale, total };
      try {
        const response = await axios.post('http://localhost:5000/api/sales', saleData);
        setSales([response.data, ...sales]);
        resetForm();
        toast.success('Sale recorded successfully!');
      } catch (error) {
        console.error('Error adding sale:', error);
        toast.error('Failed to record sale.');
      }
    } else {
      toast.error('Please enter valid quantity, price, and date!');
    }
  };

  const editSale = async () => {
    if (editingSaleId && newSale.quantity > 0 && newSale.price > 0 && newSale.date) {
      const total = newSale.quantity * newSale.price;
      const saleData = { ...newSale, total };
      try {
        const response = await axios.put(`http://localhost:5000/api/sales/${editingSaleId}`, saleData);
        setSales(sales.map(sale => (sale._id === editingSaleId ? response.data : sale)));
        resetForm();
        toast.success('Sale updated successfully!');
      } catch (error) {
        console.error('Error updating sale:', error);
        toast.error('Failed to update sale.');
      }
    } else {
      toast.error('Please enter valid quantity, price, and date!');
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${id}`);
      setSales(sales.filter(sale => sale._id !== id));
      toast.success('Sale deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale.');
    }
  };

  const resetForm = () => {
    setNewSale({ 
      product: 'Petrol', 
      quantity: '', 
      price: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setEditingSaleId(null);
  };

  const handleEditClick = (sale) => {
    setNewSale({ 
      product: sale.product, 
      quantity: sale.quantity, 
      price: sale.price,
      date: format(new Date(sale.date || Date.now()), 'yyyy-MM-dd')
    });
    setEditingSaleId(sale._id);
  };

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (key === 'date') {
        const dateA = new Date(a[key] || Date.now());
        const dateB = new Date(b[key] || Date.now());
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return direction === 'asc' 
        ? (a[key] < b[key] ? -1 : 1) 
        : (a[key] > b[key] ? -1 : 1);
    });
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setSales(sortData(sales, key, direction));
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const filterAndGroupSales = () => {
    // Filter sales based on search criteria
    let filtered = [...sales];
    
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedProduct) {
      filtered = filtered.filter(sale => sale.product === selectedProduct);
    }
    
    if (dateRange.startDate) {
      const startDate = new Date(dateRange.startDate);
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.date || Date.now());
        return saleDate >= startDate;
      });
    }
    
    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.date || Date.now());
        return saleDate <= endDate;
      });
    }
    
    setFilteredResults(filtered);
    
    // Group sales by product
    const grouped = filtered.reduce((acc, sale) => {
      if (!acc[sale.product]) {
        acc[sale.product] = [];
      }
      acc[sale.product].push(sale);
      return acc;
    }, {});
    
    setGroupedSales(grouped);
    setShowFilteredPopup(true);
  };

  const generateCSV = (data) => {
    const headers = ['Product', 'Quantity (L)', 'Price (₹)', 'Total (₹)', 'Date'];
    const csvRows = [headers.join(',')];

    data.forEach(sale => {
      const formattedDate = new Date(sale.date || Date.now()).toLocaleDateString();
      csvRows.push([
        sale.product,
        sale.quantity,
        sale.price.toFixed(2),
        sale.total.toFixed(2),
        formattedDate
      ].join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = (dataToDownload) => {
    const csvContent = generateCSV(dataToDownload);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalSales = () => sales.length;
  const getTotalQuantity = () => sales.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(2);
  const getTotalRevenue = () => sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2);
  const getAvgSaleValue = () => (sales.length ? (sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length).toFixed(2) : '0.00');

  return (
    <div className="p-6 mx-auto bg-gray-900 rounded-lg shadow-lg">
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

      <motion.h1 
        className="flex items-center mb-6 text-3xl font-bold text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Database className="mr-2" size={28} /> Sales Management
      </motion.h1>

      {/* Form for adding or editing sales */}
      <motion.div 
        className="p-4 mb-6 bg-gray-800 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Product</label>
            <select 
              value={newSale.product} 
              onChange={(e) => setNewSale({...newSale, product: e.target.value})} 
              className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>Petrol</option>
              <option>Diesel</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Quantity (L)</label>
            <input 
              type="number" 
              placeholder="Enter Quantity" 
              value={newSale.quantity} 
              onChange={(e) => setNewSale({...newSale, quantity: Number(e.target.value)})} 
              className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Price (₹/L)</label>
            <input 
              type="number" 
              placeholder="Price per Unit" 
              value={newSale.price} 
              onChange={(e) => setNewSale({...newSale, price: Number(e.target.value)})} 
              className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={newSale.date} 
                onChange={(e) => setNewSale({...newSale, date: e.target.value})} 
                className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
              <Calendar className="absolute text-gray-400 top-3 right-3" size={18} />
            </div>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={editingSaleId ? editSale : addSale} 
              className="flex items-center justify-center w-full p-3 font-medium text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            >
              {editingSaleId ? (
                <>
                  <Check className="mr-2" size={18} /> Update Sale
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2" size={18} /> Record Sale
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        className="p-4 mb-6 bg-gray-800 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Search</label>
            <select 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Product</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Product Filter</label>
            <select 
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)} 
              className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Products</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Start Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={dateRange.startDate} 
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} 
                className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
              <Calendar className="absolute text-gray-400 top-3 right-3" size={18} />
            </div>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">End Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={dateRange.endDate} 
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} 
                className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
              <Calendar className="absolute text-gray-400 top-3 right-3" size={18} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-end">
              <button 
                onClick={filterAndGroupSales} 
                className="flex items-center justify-center w-full p-3 font-medium text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-400"
              >
                <Filter className="mr-2" size={18} /> Filter
              </button>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => downloadCSV(sales)} 
                className="flex items-center justify-center w-full p-3 font-medium text-white transition duration-200 bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-400"
              >
                <Download className="mr-2" size={18} /> Export
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sales Summary */}
      <motion.div 
        className="p-4 mb-6 bg-gray-800 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="flex items-center mb-4 text-xl font-bold text-white">
          <BarChart3 className="mr-2" size={22} /> Sales Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 transition-all bg-gray-700 rounded-lg shadow-inner hover:bg-gray-600">
            <h3 className="text-sm font-medium text-gray-300">Total Sales</h3>
            <p className="text-2xl font-bold text-white">{getTotalSales()}</p>
          </div>
          <div className="p-4 transition-all bg-gray-700 rounded-lg shadow-inner hover:bg-gray-600">
            <h3 className="text-sm font-medium text-gray-300">Total Quantity</h3>
            <p className="text-2xl font-bold text-white">{getTotalQuantity()} L</p>
          </div>
          <div className="p-4 transition-all bg-gray-700 rounded-lg shadow-inner hover:bg-gray-600">
            <h3 className="flex items-center text-sm font-medium text-gray-300">
              <DollarSign size={14} className="mr-1" /> Total Revenue
            </h3>
            <p className="text-2xl font-bold text-white">₹{getTotalRevenue()}</p>
          </div>
          <div className="p-4 transition-all bg-gray-700 rounded-lg shadow-inner hover:bg-gray-600">
            <h3 className="flex items-center text-sm font-medium text-gray-300">
              <DollarSign size={14} className="mr-1" /> Avg. Sale Value
            </h3>
            <p className="text-2xl font-bold text-white">₹{getAvgSaleValue()}</p>
          </div>
        </div>
      </motion.div>

      {/* Sales Table */}
      <motion.div 
        className="overflow-x-auto bg-gray-800 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 font-medium text-left cursor-pointer" onClick={() => handleSort('product')}>
                Product {renderSortIcon('product')}
              </th>
              <th className="p-3 font-medium text-left cursor-pointer" onClick={() => handleSort('quantity')}>
                Quantity {renderSortIcon('quantity')}
              </th>
              <th className="p-3 font-medium text-left cursor-pointer" onClick={() => handleSort('price')}>
                Price {renderSortIcon('price')}
              </th>
              <th className="p-3 font-medium text-left cursor-pointer" onClick={() => handleSort('total')}>
                Total {renderSortIcon('total')}
              </th>
              <th className="p-3 font-medium text-left cursor-pointer" onClick={() => handleSort('date')}>
                Date {renderSortIcon('date')}
              </th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sales.map(sale => (
                <motion.tr 
                  key={sale._id} 
                  className="border-b border-gray-700 hover:bg-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="p-3">
                    <span className={`font-medium ${
                      sale.product === 'Petrol' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {sale.product}
                    </span>
                  </td>
                  <td className="p-3">{sale.quantity.toFixed(2)} L</td>
                  <td className="p-3">₹{sale.price.toFixed(2)}</td>
                  <td className="p-3">₹{sale.total.toFixed(2)}</td>
                  <td className="p-3">{new Date(sale.date || Date.now()).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(sale)} 
                        className="p-2 text-blue-300 bg-blue-900 rounded-full hover:bg-blue-800"
                        title="Edit Sale"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => deleteSale(sale._id)} 
                        className="p-2 text-red-300 bg-red-900 rounded-full hover:bg-red-800"
                        title="Delete Sale"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Filtered Results Popup */}
      <AnimatePresence>
        {showFilteredPopup && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              ref={popupRef}
              className="w-11/12 max-w-4xl max-h-screen p-6 overflow-y-auto bg-gray-900 rounded-lg shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Filtered Sales Results</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadCSV(filteredResults)}
                    className="flex items-center px-4 py-2 font-medium text-white transition duration-200 bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    <Download size={18} className="mr-2" /> Export
                  </button>
                  <button
                    onClick={() => setShowFilteredPopup(false)}
                    className="flex items-center px-4 py-2 font-medium text-white transition duration-200 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    <X size={18} className="mr-2" /> Close
                  </button>
                </div>
              </div>

              {/* Summary of filtered results */}
              {filteredResults.length > 0 && (
                <motion.div 
                  className="p-4 mb-6 bg-gray-800 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="mb-3 text-lg font-semibold text-white">Summary</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-300">Total Sales: <span className="font-bold text-white">{filteredResults.length}</span></p>
                    </div>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-300">Total Quantity: <span className="font-bold text-white">
                        {filteredResults.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(2)} L
                      </span></p>
                    </div>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-300">Total Revenue: <span className="font-bold text-white">
                        ₹{filteredResults.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
                      </span></p>
                    </div>
                  </div>
                </motion.div>
              )}

              {Object.keys(groupedSales).length === 0 ? (
                <div className="p-4 text-center bg-gray-800 rounded-lg">
                  <p className="text-gray-300">No results found matching your filter criteria.</p>
                </div>
              ) : (
                Object.entries(groupedSales).map(([product, sales]) => (
                  <motion.div 
                    key={product}
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between p-3 mb-2 bg-gray-800 rounded-lg">
                      <h3 className="text-xl font-semibold text-white capitalize">
                        {product} ({sales.length})
                      </h3>
                      <div className="flex flex-col items-end space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                        <span className="text-sm font-medium text-gray-300">
                          Total: <span className="text-white">₹{sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}</span>
                        </span>
                        <span className="text-sm font-medium text-gray-300">
                          Quantity: <span className="text-white">{sales.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(2)} L</span>
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto rounded-lg">
                      <table className="w-full text-white border-collapse shadow-md">
                        <thead>
                          <tr className="bg-gray-700">
                            <th className="p-3 font-medium text-left">Quantity</th>
                            <th className="p-3 font-medium text-left">Price</th>
                            <th className="p-3 font-medium text-left">Total</th>
                            <th className="p-3 font-medium text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sales.map((sale) => (
                            <motion.tr 
                              key={sale._id} 
                              className="border-b border-gray-700 hover:bg-gray-700"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <td className="p-3">{sale.quantity.toFixed(2)} L</td>
                              <td className="p-3">₹{sale.price.toFixed(2)}</td>
                              <td className="p-3">₹{sale.total.toFixed(2)}</td>
                              <td className="p-3">{new Date(sale.date || Date.now()).toLocaleDateString()}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesManagement;