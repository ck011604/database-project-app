import "../css/Navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return ( 
        <header className="header">
            <a href="/home" className="logo">POS System</a>
            <nav className="navbar">
                <a href="/virtual-register">Virtual Register</a>
                <a href="">Tab2</a>
                <a href="">Tab3</a>
                <a href="">Tab4</a>
                <a href="/schedule">schedule</a>
            </nav>
        </header>
     );
}
 
export default Navbar;