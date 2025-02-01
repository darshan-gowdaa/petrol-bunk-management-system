import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({ product: 'Petrol', quantity: '', price: '' });
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    getSales();
  }, []);

  const getSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      setSales(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      showAlert('Failed to fetch sales records.', 'error');
    }
  };

  const addSale = async () => {
    if (newSale.quantity > 0 && newSale.price > 0) {
      const total = newSale.quantity * newSale.price;
      const saleData = { ...newSale, total };
      try {
        const response = await axios.post('http://localhost:5000/api/sales', saleData);
        setSales([...sales, response.data]);
        resetForm();
        showAlert('Sale recorded successfully!', 'added');
      } catch (error) {
        console.error('Error adding sale:', error);
        showAlert('Failed to record sale.', 'error');
      }
    } else {
      showAlert('Please enter valid quantity and price!', 'error');
    }
  };

  const editSale = async () => {
    if (editingSaleId && newSale.quantity > 0 && newSale.price > 0) {
      const total = newSale.quantity * newSale.price;
      const saleData = { ...newSale, total };
      try {
        const response = await axios.put(`http://localhost:5000/api/sales/${editingSaleId}`, saleData);
        setSales(sales.map(sale => (sale._id === editingSaleId ? response.data : sale)));
        resetForm();
        showAlert('Sale updated successfully!', 'edited');
      } catch (error) {
        console.error('Error updating sale:', error);
        showAlert('Failed to update sale.', 'error');
      }
    } else {
      showAlert('Please enter valid quantity and price!', 'error');
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${id}`);
      setSales(sales.filter(sale => sale._id !== id));
      showAlert('Sale deleted successfully!', 'deleted');
    } catch (error) {
      console.error('Error deleting sale:', error);
      showAlert('Failed to delete sale.', 'error');
    }
  };

  const resetForm = () => {
    setNewSale({ product: 'Petrol', quantity: '', price: '' });
    setEditingSaleId(null);
  };

  const handleEditClick = (sale) => {
    setNewSale({ product: sale.product, quantity: sale.quantity, price: sale.price });
    setEditingSaleId(sale._id);
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  return (
    <div className="p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-white">Sales Management</h1>
      
      {alertVisible && (
        <div className="fixed z-50 p-4 text-center text-white transition-opacity transform -translate-x-1/2 bg-yellow-500 rounded-lg shadow-lg bottom-4 left-1/2">
          {alertMessage}
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <select value={newSale.product} onChange={(e) => setNewSale({...newSale, product: e.target.value})} className="p-3 text-white bg-gray-700 rounded-lg">
          <option>Petrol</option>
          <option>Diesel</option>
        </select>
        <input type="number" placeholder="Quantity" value={newSale.quantity} onChange={(e) => setNewSale({...newSale, quantity: Number(e.target.value)})} className="p-3 text-white bg-gray-700 rounded-lg" />
        <input type="number" placeholder="Price per Unit" value={newSale.price} onChange={(e) => setNewSale({...newSale, price: Number(e.target.value)})} className="p-3 text-white bg-gray-700 rounded-lg" />
        <button onClick={editingSaleId ? editSale : addSale} className="p-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {editingSaleId ? 'Update Sale' : 'Record Sale'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="text-gray-300 bg-gray-600">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale._id} className="border-b border-gray-500 hover:bg-gray-900">
                <td className="p-3">{sale.product}</td>
                <td className="p-3">{sale.quantity}</td>
                <td className="p-3">₹{sale.price.toFixed(2)}</td>
                <td className="p-3">₹{sale.total.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleEditClick(sale)} className="px-3 py-2 mr-2 text-sm font-bold text-gray-800 bg-yellow-400 rounded-lg hover:bg-yellow-500">✏️ Edit</button>
                  <button onClick={() => deleteSale(sale._id)} className="px-3 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesManagement;
