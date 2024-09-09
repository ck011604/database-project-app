import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import Navbar from "./components/Navbar";
import VirtualRegister from "./components/VirtualRegister";

function App() {

  const location = useLocation(); // Get current location
  const hideNavbarRoutes = ["/login", "/create-account"]

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
        </Routes>
      </div>
    </div>
  );
}

export default App;