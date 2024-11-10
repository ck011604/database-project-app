import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomeRoute from "./components/HomeRoutes"
import ProtectedRoute from "./components/ProtectedRoutes";
import CreateAccount from "./components/CreateAccount";
import Navbar from "./components/Navbar";
import VirtualRegister from "./components/VirtualRegister";
import Management from './components/Management';
import InventoryReport from "./components/InventoryReport";
import NotFoundPage from "./components/NotFoundPage";
import SalesReport from "./components/SalesReport";
import OrdersReport from "./components/OrdersReport";
import EmployeeSettings from "./components/EmployeeSettings";
import CustomerSettings from "./components/CustomerSettings";
import CustomerPortalMenu from "./components/CustomerPortalMenu";
import CustomerPortalView from "./components/CustomerPortalView";

function App() {
  const location = useLocation(); // Get current location

  const hideNavbarRoutes = ["/login", "/create-account", "/404-Page-Not-Found"];

  return (
    <div className="App">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/404-Page-Not-Found" element={<NotFoundPage />} />

          <Route
            path="/home"
            element={<HomeRoute />}
          />

          <Route path="/create-account" element={<CreateAccount />} />

          <Route
            path="/virtual-register"
            element={ <ProtectedRoute element={<VirtualRegister/>} allowedRoles={['Waiter','Manager']} /> }
          />

          <Route 
            path="/Management" 
            element={ <ProtectedRoute element={<Management />} allowedRoles={['Manager']} /> }
          />

          <Route
            path="/inventory-report"
            element={ <ProtectedRoute element={<InventoryReport />} allowedRoles={['Manager']} /> }
          />

          <Route
            path="/sales-report"
            element={ <ProtectedRoute element={<SalesReport />} allowedRoles={['Manager', 'Accountant']} /> }
          />

          <Route
            path="/employee-settings"
            element={ <ProtectedRoute element={<EmployeeSettings />} allowedRoles={['Waiter', 'Manager', 'Accountant']} /> }
          />

          <Route
            path="/customer-settings"
            element={ <ProtectedRoute element={<CustomerSettings />} allowedRoles={['user']} /> }
          />

          <Route
            path="/orders-report"
            element={ <ProtectedRoute element={<OrdersReport />} allowedRoles={['Accountant', 'Manager']} /> }
          />

          <Route
            path="/customer-portal-menu"
            element={ <ProtectedRoute element={<CustomerPortalMenu />} allowedRoles={['user']} /> }
          />

          <Route
            path="/customer-portal-view"
            element={ <ProtectedRoute element={<CustomerPortalView />} allowedRoles={['user']} /> }
          />

          <Route path="*" element={<Navigate to="/404-Page-Not-Found" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;