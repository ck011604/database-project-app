import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import Navbar from "./components/Navbar";
import VirtualRegister from "./components/VirtualRegister";
import Footer from "./components/Footer";
import Schedule from "./components/Schedule";
import Products from "./components/Products";

function App() {

  const location = useLocation(); // Get current location
  const hideNavbarRoutes = ["/login", "/create-account"]
  const hideFooterRoutes = ["/login", "/create-account"]

  return (
    <div className="App">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/virtual-register" element={<VirtualRegister />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;