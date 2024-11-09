import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoutes";
import CreateAccount from "./components/CreateAccount";
import Navbar from "./components/Navbar";
import VirtualRegister from "./components/VirtualRegister";
import Footer from "./components/Footer";
import Management from './components/Management';
import InventoryReport from "./components/InventoryReport";
import NotFoundPage from "./components/NotFoundPage";
import SalesReport from "./components/SalesReport";
import OrdersReport from "./components/OrdersReport";
import EmployeeSettings from "./components/EmployeeSettings";
import CustomerPortal from "./components/CustomerPortal";
import CustomerView from "./components/CustomerView";

function App() {
  const location = useLocation(); // Get current location

  const hideNavbarRoutes = ["/login", "/create-account", "/404-Page-Not-Found"];
  const hideFooterRoutes = ["/login", "/create-account", "/404-Page-Not-Found"];

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
            element={ <ProtectedRoute element={<Home />} allowedRoles={['Waiter','Accountant', 'Manager']} /> }
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
          
          {/* Switch to Customer Portal and remove this */}
          <Route path="/customer-view" element={<CustomerView />} />

          <Route
            path="/orders-report"
            element={ <ProtectedRoute element={<OrdersReport />} allowedRoles={['Manager']} /> }
          />
          <Route
            path="/customer-portal"
            element={ <ProtectedRoute element={<CustomerPortal />} allowedRoles={['user']} /> }
          />
          <Route path="*" element={<Navigate to="/404-Page-Not-Found" />} />
        </Routes>
      </div>
      {/* {!hideFooterRoutes.includes(location.pathname) && <Footer />} */}
    </div>
  );
}

export default App;