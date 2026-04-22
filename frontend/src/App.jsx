// frontend/src/App.jsx - Main application component
import React, { lazy, Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { SkeletonPageFallback } from "./components/common/Skeleton.jsx";

// Import styles directly
import "./styles/App.css";
import "./styles/toast.css";

// Lazy load components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const SalesManagement = lazy(() => import("./pages/SalesManagement"));
const EmployeeManagement = lazy(() => import("./pages/EmployeeManagement"));
const ExpenseTracking = lazy(() => import("./pages/ExpenseTracking"));
const Reports = lazy(() => import("./pages/Reports"));
const Login = lazy(() => import("./pages/Login"));
const Sidebar = lazy(() => import("./components/layout/Sidebar"));

// Thin spinner used only for sidebar (tiny lazy load)
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[40px]">
    <div className="w-6 h-6 border-[3px] border-gray-700 rounded-full animate-spin border-t-red-500" />
  </div>
);

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
  const [isReady, setIsReady] = useState(false);
  const [authState, setAuthState] = useState(false);

  // Wait for initial auth check to complete
  useEffect(() => {
    if (!loading) {
      try {
        const auth = isAuthenticated();
        setAuthState(auth);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthState(false);
      } finally {
        setIsReady(true);
      }
    }
  }, [loading, isAuthenticated]);

  // Dynamic Title
  useEffect(() => {
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

  if (!isReady) {
    return <SkeletonPageFallback />;
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
    return <Navigate to={authState ? "/dashboard" : "/"} replace />;
  }

  // Handle authentication redirects
  if (!authState && !isLoginPage) {
    return <Navigate to="/" replace />;
  }

  if (authState && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gray-900">
      <Suspense fallback={<SkeletonPageFallback />}>
        {isLoginPage ? (
          <div className="h-screen text-gray-100">
            <Login />
          </div>
        ) : (
          <ProtectedLayout />
        )}
      </Suspense>
    </div>
  );
};

const ProtectedLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState("w-16");

  return (
    <div className="flex h-screen overflow-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <Sidebar updateSidebarState={setSidebarWidth} />
      </Suspense>
      <div
        className={`flex-1 overflow-auto transition-all duration-300 p-3 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 ${
          sidebarWidth === "w-64" ? "ml-64" : "ml-16"
        }`}
      >
        <Suspense fallback={<SkeletonPageFallback />}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/sales" element={<SalesManagement />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/expenses" element={<ExpenseTracking />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
