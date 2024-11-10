import { Link } from "react-router-dom";
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
  };

  return (
    <header className="header">
      {role !== "user" && (
        <a href="/home" className="logo">
          POS System
        </a>
      )}
      {role === "user" && (
        <a href="/customer-portal-menu" className="logo">
          Customer Portal
        </a>
      )}
      <nav className="navbar">
        <div className="navbar-pages">
          {(role == "Waiter" || role == "Manager") && (
            <a href="/virtual-register">Virtual Register</a>
          )}
          {role == "Manager" && <a href="/management">Management</a>}
          {role == "Manager" && (
            <a href="/inventory-report">Inventory Report</a>
          )}
          {role == "user" && <Link to="/customer-portal-menu">Our Menu</Link>}
          {role == "user" && (
            <Link to="/customer-portal-view">Order History</Link>
          )}
        </div>
        {(role == "Accountant" || role == "Manager") && (
          <div className="finance-dropdown">
            <div className="finance-tab">Finance Reports</div>
            <div className="finance-dropdown-content">
              <a href="/sales-report">Sales</a>
              <a href="/orders-report">Orders</a>
            </div>
          </div>
        )}
        <div className="user-dropdown">
          {role !== "user" && (
            <span className="employee-name">
              {role}: {firstName}
            </span>
          )}
          {role === "user" && (
            <span className="customer-name">Welcome, {firstName}</span>
          )}
          <div className="user-dropdown-content">
            {role !== "user" && <a href="/employee-settings">Settings</a>}
            {role === "user" && <a href="/customer-settings">Settings</a>}
            <a href="/login" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
