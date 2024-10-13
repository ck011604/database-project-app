import "../css/Navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return ( 
        <header className="header">
            <a href="/home" className="logo">POS System</a>
            <nav className="navbar">
                <a href="/virtual-register">Virtual Register</a>
                <a href="/products">Products</a>
                <a href="/inventory-report">Inventory Report</a>
            </nav>
        </header>
     );
}

export default Navbar;