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
      {role !== "user" && <a href="/home" className="logo">POS System</a>}
      {role === "user" && <a href="/customer-portal" className="logo">Customer Portal</a>}
      <nav className="navbar">
        <div className="navbar-pages">
          {(role == "Waiter" || role == "Manager") && <a href="/virtual-register">Virtual Register</a>}
          {role == "Manager" && <a href="/management">Management</a>}
          {role == "Manager" && <a href="/inventory-report">Inventory Report</a>}
          {(role == "Accountant" || role == "Manager") && <a href="/sales-report">Sales Report</a>}
          {(role == "Manager") && <a href="/orders-report">Orders Report</a>}
        </div>
        <div className="user-dropdown">
          {role !== "user" && <span className="employee-name">{role}: {firstName}</span>}
          {role === "user" && <span className="customer-name">Welcome, {firstName}</span>}
          <div className="user-dropdown-content">
            <a href="/employee-settings">Settings</a>
            <a href="/login" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
