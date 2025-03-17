import React, { useState } from 'react';
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

  return (
    <>
      {isLoginPage ? (
        <div className="h-screen text-gray-100 bg-gray-900">
          <Login />
        </div>
      ) : (
        <div className="flex h-screen bg-gray-900">
          <Sidebar updateSidebarState={setSidebarWidth} />
          <DashboardLayout sidebarWidth={sidebarWidth}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/sales" element={<SalesManagement />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/expenses" element={<ExpenseTracking />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </DashboardLayout>
        </div>
      )}
    </>
  );
};

// Dashboard layout that adjusts dynamically based on sidebar state
const DashboardLayout = ({ sidebarWidth, children }) => {
  return (
    <main
      className={`flex-1 p-8 overflow-auto transition-all duration-300 ${
        sidebarWidth === 'w-64' ? 'ml-64' : 'ml-16'
      }`}
    >
      {children}
    </main>
  );
};

export default App;