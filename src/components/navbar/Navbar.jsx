// components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importăm Link pentru navigare
import "./Navbar.css";
import icon from "../../assets/logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Stânga: Logo și Brand */}
        <div className="navbar-brand">
          <img src={icon} alt="logo" />
          <span className="brand-name">AIrtistic</span>
        </div>

        {/* Mijloc: Link-urile de navigare (pot fi adăugate după preferințe) */}
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/chatAI">ChatAI</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>

        {/* Dreapta: Butoane */}
        <div className="navbar-buttons">
          <Link to="/signup">
            <button className="btn register">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="btn log-in">Log in</button>
          </Link>
        </div>

        {/* Iconiță pentru meniul mobil */}
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
        </div>
      </div>

      {/* Meniu mobil (se afișează când mobileOpen este true) */}
      {mobileOpen && (
        <ul className="mobile-navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="#">ChatAI</a>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          <li>
            <a href="#">Profil</a>
          </li>
          <li>
            <Link to="/signup">
              <button className="btn register">Sign Up</button>
            </Link>
          </li>
          <li>
            <Link to="/login">
              <button className="btn log-in">Log In</button>
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
