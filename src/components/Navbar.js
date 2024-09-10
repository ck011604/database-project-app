import "../css/Navbar.css";

const Navbar = () => {
    return ( 
        <header className="header">
            <a href="/home" className="logo">POS System</a>
            <nav className="navbar">
                <a href="/virtual-register">Virtual Register</a>
                <a href="">Tab2</a>
                <a href="">Tab3</a>
                <a href="">Tab4</a>
                <a href="">Tab5</a>
            </nav>
        </header>
     );
}
 
export default Navbar;