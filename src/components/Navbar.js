import { jwtDecode } from "jwt-decode";
import "../css/Navbar.css";

const Navbar = () => {
  const token = sessionStorage.getItem("token");
  let role = null;
  let firstName = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role;
      firstName = decodedToken.first_name;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
  }

  return (
    <header className="header">
      <a href="/home" className="logo">
        POS System
      </a>
      <nav className="navbar">
        <div className="navbar-pages">
            <a href="/virtual-register">Virtual Register</a>
            <a href="/management">Management</a>
            <a href="/inventory-report">Inventory Report</a>
            <a href="/sales-report">Sales Report</a>
        </div>
        <div className="user-dropdown">
          <span className="employee-name">{role}: {firstName}</span>
          <div className="user-dropdown-content">
            <a href="">Settings</a>
            <a href="/login" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
