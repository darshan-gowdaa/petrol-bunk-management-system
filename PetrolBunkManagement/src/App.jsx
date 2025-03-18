import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import SalesManagement from './pages/SalesManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import ExpenseTracking from './pages/ExpenseTracking';
import Reports from './pages/Reports';
import Login from './components/Login';
import './App.css';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const [sidebarWidth, setSidebarWidth] = useState('w-16');

  useEffect(() => {
    const pageTitles = {
      '/dashboard': 'Dashboard',
      '/inventory': 'Inventory Management',
      '/sales': 'Sales Management',
      '/employees': 'Employee Management',
      '/expenses': 'Expense Tracking',
      '/reports': 'Reports',
      '/': 'Login',
    };

    document.title = pageTitles[location.pathname] || 'HP PBMS';
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-hidden bg-gray-900">
      {isLoginPage ? (
        <div className="h-screen text-gray-100">
          <Login />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar updateSidebarState={setSidebarWidth} />
          <div className={`flex-1 overflow-auto transition-all duration-300 p-3 ${sidebarWidth === 'w-64' ? 'ml-64' : 'ml-16'}`}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/sales" element={<SalesManagement />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/expenses" element={<ExpenseTracking />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
