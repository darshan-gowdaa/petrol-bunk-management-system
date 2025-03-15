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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Router>
      <AppContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </Router>
  );
};

const AppContent = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {isLoginPage ? (
        <div className="h-screen text-gray-100 bg-gray-900">
          <Login />
        </div>
      ) : (
        <div className="flex h-screen bg-gray-900">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <DashboardLayout isCollapsed={isCollapsed}>
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

// Dashboard layout that adjusts based on sidebar state
const DashboardLayout = ({ isCollapsed, children }) => {
  return (
    <main
      className={`flex-1 p-8 overflow-auto transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}
    >
      {children}
    </main>
  );
};

export default App;
