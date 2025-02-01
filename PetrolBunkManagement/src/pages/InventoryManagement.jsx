import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', currentStock: '', reorderLevel: '' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    getInventoryItems();
  }, []);

  // Get all inventory items
  const getInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      showAlert('Failed to fetch inventory items.', 'error');
    }
  };

  // Add new inventory item
  const addInventoryItem = async () => {
    if (newItem.name && newItem.currentStock > 0 && newItem.reorderLevel > 0) {
      try {
        const response = await axios.post('http://localhost:5000/api/inventory', newItem);
        setInventory([...inventory, response.data]);
        resetForm();
        showAlert('Item added successfully!', 'added');
      } catch (error) {
        console.error('Error adding inventory item:', error);
        showAlert('Failed to add item.', 'error');
      }
    } else {
      showAlert('Please fill all fields with valid data!', 'error');
    }
  };

  // Edit an existing inventory item
  const editInventoryItem = async () => {
    if (editingItemId && newItem.name && newItem.currentStock > 0 && newItem.reorderLevel > 0) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/inventory/${editingItemId}`,
          newItem
        );
        setInventory(
          inventory.map((item) =>
            item._id === editingItemId ? response.data : item
          )
        );
        resetForm();
        showAlert('Item updated successfully!', 'edited');
      } catch (error) {
        console.error('Error updating inventory item:', error);
        showAlert('Failed to update item.', 'error');
      }
    } else {
      showAlert('Please fill all fields with valid data!', 'error');
    }
  };

  // Delete an inventory item
  const deleteInventoryItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setInventory(inventory.filter((item) => item._id !== id));
      showAlert('Item deleted successfully!', 'deleted');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      showAlert('Failed to delete item.', 'error');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewItem({ name: '', currentStock: '', reorderLevel: '' });
    setEditingItemId(null);
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setNewItem({
      name: item.name,
      currentStock: item.currentStock,
      reorderLevel: item.reorderLevel,
    });
    setEditingItemId(item._id);
  };

  // Show alert with fade effect
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000); // Hide alert after 3 seconds
  };

  return (
    <div className="p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-white">Inventory Management</h1>

      {/* Alert message */}
      {alertVisible && (
        <div className="fixed z-50 p-4 text-center text-white transition-opacity transform -translate-x-1/2 bg-yellow-500 rounded-lg shadow-lg bottom-4 left-1/2">
          {alertMessage}
        </div>
      )}

      {/* Form for adding or editing inventory items */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="p-3 text-white bg-gray-700 rounded-lg"
        />
        <input
          type="number"
          placeholder="Current Stock"
          value={newItem.currentStock}
          onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
          className="p-3 text-white bg-gray-700 rounded-lg"
        />
        <input
          type="number"
          placeholder="Reorder Level"
          value={newItem.reorderLevel}
          onChange={(e) => setNewItem({ ...newItem, reorderLevel: Number(e.target.value) })}
          className="p-3 text-white bg-gray-700 rounded-lg"
        />
        <button
          onClick={editingItemId ? editInventoryItem : addInventoryItem}
          className="p-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {editingItemId ? 'Save Changes' : 'Add Item'}
        </button>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="text-gray-300 bg-gray-600">
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Current Stock</th>
              <th className="p-3 text-left">Reorder Level</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id} className="border-b border-gray-500 hover:bg-gray-900">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.currentStock}</td>
                <td className="p-3">{item.reorderLevel}</td>
                <td className="p-3">
                  <span
                    className={
                      item.currentStock <= item.reorderLevel
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    {item.currentStock <= item.reorderLevel ? 'Low Stock' : 'Sufficient'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="px-3 py-2 mr-2 text-sm font-bold text-gray-800 bg-yellow-400 rounded-lg hover:bg-yellow-500"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteInventoryItem(item._id)}
                    className="px-3 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
