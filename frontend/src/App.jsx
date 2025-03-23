import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/layout";
import Dashboard from "./pages/Dashboard";
import InventoryManagement from "./pages/InventoryManagement";
import SalesManagement from "./pages/SalesManagement";
import EmployeeManagement from "./pages/EmployeeManagement";
import ExpenseTracking from "./pages/ExpenseTracking";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import "./styles/App.css";
import "./styles/toast.css"; // Custom toast styles
import { useAuth } from "./hooks/useAuth";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const isLoginPage = location.pathname === "/";

  // Dynamic Title
  React.useEffect(() => {
    const pageTitles = {
      "/dashboard": "Dashboard",
      "/inventory": "Inventory Management",
      "/sales": "Sales Management",
      "/employees": "Employee Management",
      "/expenses": "Expense Tracking",
      "/reports": "Reports",
      "/": "Login",
    };
    document.title =
      pageTitles[location.pathname] || "PetrolBunk Management System";
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle undefined routes
  const validRoutes = [
    "/",
    "/dashboard",
    "/inventory",
    "/sales",
    "/employees",
    "/expenses",
    "/reports",
  ];
  if (!validRoutes.includes(location.pathname)) {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated()) {
      return <Navigate to="/dashboard" replace />;
    }
    // If user is not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  // Handle authentication redirects
  if (!isAuthenticated() && !isLoginPage) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated() && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gray-900">
      {isLoginPage ? (
        <div className="h-screen text-gray-100">
          <Login />
        </div>
      ) : (
        <ProtectedLayout />
      )}
    </div>
  );
};

const ProtectedLayout = () => {
  const [sidebarWidth, setSidebarWidth] = React.useState("w-16");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar updateSidebarState={setSidebarWidth} />
      <div
        className={`flex-1 overflow-auto transition-all duration-300 p-3 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 ${
          sidebarWidth === "w-64" ? "ml-64" : "ml-16"
        }`}
      >
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
  );
};

export default App;
