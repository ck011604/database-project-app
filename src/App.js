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
import Products from "./components/Products";
import InventoryReport from "./components/InventoryReport";

function App() {
  const location = useLocation(); // Get current location
  const hideNavbarRoutes = ["/login", "/create-account"];
  const hideFooterRoutes = ["/login", "/create-account"];

  return (
    <div className="App">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route 
            path="/home" 
            element={ <ProtectedRoute element={<Home />} allowedRoles={['Waiter','Accountant', 'Manager']} /> }
          />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/create-account" element={<CreateAccount />} />

          <Route
            path="/virtual-register"
            element={ <ProtectedRoute element={<VirtualRegister/>} allowedRoles={['Waiter','Manager']} /> }
          />

          <Route 
            path="/products" 
            element={ <ProtectedRoute element={<Products />} allowedRoles={['Manager']} /> }
          />

          <Route
            path="/inventory-report"
            element={ <ProtectedRoute element={<InventoryReport />} allowedRoles={['Manager']} /> }
          />
        </Routes>
      </div>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;