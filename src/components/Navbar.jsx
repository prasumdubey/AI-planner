import { Link } from "react-router-dom";
import "./Navbar.css";
import profileImage from "../assets/profile.svg"; 

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">Planless</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <img src={profileImage} alt="person planning" />
      </nav>
    </header>
  );
};

export default Navbar;
