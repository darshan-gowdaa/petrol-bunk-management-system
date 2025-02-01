// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import SalesManagement from './pages/SalesManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import ExpenseTracking from './pages/ExpenseTracking';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen text-gray-100 bg-gray-900">
        <Sidebar />
        <main className="flex-1 p-8 ml-64 overflow-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/sales" element={<SalesManagement />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/expenses" element={<ExpenseTracking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;